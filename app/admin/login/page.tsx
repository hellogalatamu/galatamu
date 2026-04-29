"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock, Mail, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin");
      } else {
        setIsChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Email atau password salah. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-serif text-4xl font-bold italic tracking-wider mb-4 inline-block">Galatamu.</Link>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] font-bold">Admin Portal Security</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-2xl font-serif font-bold mb-8 relative z-10">Selamat Datang Kembali</h2>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@galatamu.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a1a1a] focus:bg-white focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a1a1a] focus:bg-white focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium ml-1 animate-pulse">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-2 group disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : (
                <>
                  Masuk ke Dashboard <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-400 text-[10px] uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Galatamu Invitation System
        </p>
      </div>
    </main>
  );
}
