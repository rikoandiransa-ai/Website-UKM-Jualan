import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Promo } from '../types';
import api from '../services/api';

interface PromosPageProps {
  setActiveTab: (tab: string) => void;
}

export const PromosPage: React.FC<PromosPageProps> = ({ setActiveTab }) => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const res = await api.get('/promos?active=true');
      if (res.data.success) setPromos(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Kupon Promo & Voucher Diskon</h1>
        <p className="text-xs sm:text-sm text-emerald-100">
          Gunakan voucher hemat di bawah ini saat checkout pesanan Anda untuk menikmati potongan harga menarik!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Diskon {p.discount_percent}%
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Berlaku s/d {p.end_date}
                </span>
              </div>

              <div className="pt-1">
                <h3 className="font-extrabold text-base text-slate-800 font-mono tracking-wider">
                  {p.code}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Maksimal potongan Rp {p.max_discount.toLocaleString('id-ID')} dengan minimal transaksi Rp {p.min_purchase.toLocaleString('id-ID')}.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleCopy(p.code)}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                {copiedCode === p.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode === p.code ? 'Tersalin!' : 'Salin Kode'}
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Pakai Belanja <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
