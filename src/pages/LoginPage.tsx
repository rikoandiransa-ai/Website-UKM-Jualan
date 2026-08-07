import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  setActiveTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActiveTab }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setActiveTab('home');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6 pb-16">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk Akun Toko</h1>
        <p className="text-xs text-slate-500">
          Masuk untuk mengelola pesanan dan mendapatkan promo menarik
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        {/* Quick Demo Login Credentials Hint */}
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-[11px] text-emerald-900 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Akun Demo Uji Coba:
          </p>
          <p>• <strong>Admin:</strong> admin@umkm.id / admin123</p>
          <p>• <strong>Pelanggan:</strong> budi@gmail.com / password123</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-semibold text-slate-700">Password *</label>
              <button
                type="button"
                onClick={() => setActiveTab('forgot-password')}
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Masuk...' : 'Masuk Sekarang'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Belum punya akun?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="font-bold text-emerald-700 hover:underline"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
};
