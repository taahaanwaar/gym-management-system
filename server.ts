import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/generate-workout", async (req, res) => {
    if (!genAI) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const { preferences, goal, memberName } = req.body;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a professional fitness trainer at a gym in Pakistan. 
        Generate a detailed 1-week workout plan for a member named ${memberName}.
        
        Member Goal: ${goal}
        User Preferences: ${preferences}
        
        Please include:
        1. Daily exercises with sets and reps.
        2. Nutritional tips suited for local Pakistani food options (e.g. Lentils, grilled chicken, specific local vegetables).
        3. Recovery advice.
        
        Format the response in clear Markdown.
      `;

      const result = await model.generateContent(prompt);
      const content = result.response.text();
      res.json({ content });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate workout plan", details: error.message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
