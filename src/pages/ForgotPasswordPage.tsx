import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import api from '../services/api';

interface ForgotPasswordPageProps {
  setActiveTab: (tab: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true); // show generic success message for security
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6 pb-16">
      <button
        onClick={() => setActiveTab('login')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Login
      </button>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lupa Password Akun?</h1>
        <p className="text-xs text-slate-500">
          Masukkan email terdaftar Anda. Kami akan mengirimkan tautan instruksi reset password.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-2">
            <p className="font-bold">Instruksi Reset Dikirim!</p>
            <p>
              Silakan periksa kotak masuk email <strong>{email}</strong> untuk mengatur ulang kata sandi Anda.
            </p>
            <button
              onClick={() => setActiveTab('login')}
              className="mt-2 text-xs font-bold text-emerald-700 hover:underline block"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Terdaftar *</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Kirim Link Reset'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
