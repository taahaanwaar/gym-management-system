import React, { useState } from 'react';
import { Dumbbell, Sparkles, BrainCircuit, History, ArrowRight, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function WorkoutGen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [form, setForm] = useState({
    memberName: '',
    goal: 'Muscle Gain',
    preferences: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.content) {
        setResult(data.content);
      } else {
        throw new Error(data.error || 'Failed to generate');
      }
    } catch (error) {
      console.error(error);
      alert("Error generating workout plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg text-black">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">AI Workout Architect</h2>
        </div>
        <p className="text-zinc-500">Generate hyper-personalized workout and nutrition plans using Gemini AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleGenerate} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Member Full Name</label>
              <input 
                required
                type="text"
                placeholder="e.g. Abdullah Khan"
                value={form.memberName}
                onChange={(e) => setForm({...form, memberName: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Primary Goal</label>
              <select 
                value={form.goal}
                onChange={(e) => setForm({...form, goal: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
              >
                <option>Muscle Gain</option>
                <option>Fat Loss</option>
                <option>Endurance</option>
                <option>Strength (Powerlifting)</option>
                <option>General Fitness</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Additional Preferences</label>
              <textarea 
                placeholder="e.g. Focus on legs, limited gym equipment, high protein diet (Halal), injured shoulder..."
                value={form.preferences}
                onChange={(e) => setForm({...form, preferences: e.target.value})}
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20 resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Smart Plan
                </>
              )}
            </button>
          </form>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
              <History className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Recent Generations</span>
            </div>
            <div className="space-y-3 opacity-50">
              <p className="text-sm italic">Recent plans will appear here after sync...</p>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center"
              >
                <Dumbbell className="w-16 h-16 text-zinc-800 mb-6" />
                <h3 className="text-xl font-bold text-zinc-500">Ready to build?</h3>
                <p className="text-zinc-600 mt-2 max-w-sm">Enter member details and goal to generate a custom fitness roadmap.</p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
                  <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mt-8">Training the AI...</h3>
                <p className="text-zinc-500 mt-2">Our intelligence engine is crafting a custom routine based on latest fitness science.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <button 
                    onClick={() => window.print()}
                    className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </button>
                </div>
                
                <div className="prose prose-invert prose-stone max-w-none prose-h1:text-2xl prose-h2:text-xl prose-p:text-zinc-400 prose-li:text-zinc-400">
                  <Markdown>{result}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
