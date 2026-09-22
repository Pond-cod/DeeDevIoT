"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, LogIn, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center p-4 sm:p-6 selection:bg-[#E53935]/20 selection:text-white font-mono text-white relative">
      <div className="w-full max-w-md bg-[#111318] border border-[#252832] rounded-lg p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono text-[#9CA3AF] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>BACK TO HOME</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-[#08090D] border border-[#252832] mb-3 text-[#E53935]">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white mb-1 uppercase font-mono">
            DEEDEV IOT <span className="text-[#6B7280]">/</span> ADMIN
          </h1>
          <p className="text-[#9CA3AF] text-xs">AUTHORIZED ACCESS ONLY</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-[#E53935]/10 border border-[#E53935]/30 flex items-start gap-2.5 text-xs text-[#E53935]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-mono">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#9CA3AF]">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                <User size={14} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#08090D] border border-[#252832] rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#E53935] transition-colors placeholder:text-[#6B7280]"
                placeholder="operator_id"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#9CA3AF]">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                <Lock size={14} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#08090D] border border-[#252832] rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#E53935] transition-colors placeholder:text-[#6B7280]"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-4 bg-[#E53935] hover:bg-[#c62828] text-white rounded font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={14} /> <span>AUTHENTICATE</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[#252832] text-center font-mono text-[10px] text-[#6B7280]">
          ENCRYPTED SESSION MANAGEMENT • DEEDEV IOT
        </div>
      </div>
    </div>
  );
}
