import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Lock, Mail, AlertCircle, Loader2, User, Chrome, PlayCircle } from 'lucide-react';

export default function Login() {
  const { user, login, loginWithGoogle, register, guestLogin } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(email, password, fullName);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = 'An error occurred. Please check your connection and try again.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered in our system.';
      } else if (err.code === 'auth/weak-password') {
        message = 'The password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Email & Password login is not enabled in your Firebase Console. Please enable it under Authentication > Sign-in method.';
      } else if (err.message && err.message.includes('permission-denied')) {
        message = 'Database access denied. Your profile could not be created.';
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-black shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <Dumbbell className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">PakGym Pro</h1>
            <p className="text-gray-400 mt-2">Staff Portal Access</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Abdullah Khan"
                    required={!isLoginMode}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@pakgym.com"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group h-[56px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{isLoginMode ? 'Log In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121212] px-3 text-zinc-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                <Chrome className="w-4 h-4" />
                Google
              </button>
              <button
                onClick={guestLogin}
                className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                <PlayCircle className="w-4 h-4 text-emerald-500" />
                Guest Mode
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
              }}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isLoginMode ? "Don't have an account? Create one" : "Already have an account? Log in"}
            </button>
          </div>
          
          <p className="text-[10px] text-center text-zinc-600 mt-6 leading-relaxed px-4">
            Authorized access only. Unauthorized attempts will be logged and reported. PakGym Pro v2.4.0
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-zinc-500">
            Need access? Contact your branch administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
