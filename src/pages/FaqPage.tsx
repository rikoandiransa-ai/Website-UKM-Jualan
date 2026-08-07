import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah semua produk yang dijual 100% buatan UMKM lokal?',
      a: 'Ya, benar sekali! Kami bermitra langsung dengan para pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) terverifikasi di berbagai daerah di Indonesia.',
    },
    {
      q: 'Berapa lama estimasi pengiriman barang sampai ke rumah?',
      a: 'Estimasi pengiriman tergantung pada pilihan kurir yang Anda pilih saat checkout. Untuk JNE/TIKI ONS biasanya 1 hari kerja, sedangkan layanan regular memakan waktu 2-3 hari kerja.',
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami menerima transfer bank manual (BCA & Mandiri) serta pembayaran instan melalui QRIS All Payment (Gopay, OVO, Dana, ShopeePay, dan M-Banking).',
    },
    {
      q: 'Bagaimana jika barang yang diterima rusak atau kadaluarsa?',
      a: 'Kami menyediakan garansi penggantian produk 100%. Silakan sertakan video unboxing dan hubungi Layanan Pelanggan WhatsApp kami dalam waktu 2x24 jam setelah paket diterima.',
    },
    {
      q: 'Apakah ada minimal pembelian untuk mendapatkan gratis ongkir?',
      a: 'Ya, nikmati subsidi ongkos kirim hingga Rp 15.000 dengan minimal pembelian Rp 100.000 menggunakan kode voucher promo yang tersedia.',
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pertanyaan Yang Sering Diajukan (FAQ)</h1>
        <p className="text-xs sm:text-sm text-emerald-100">
          Temukan jawaban cepat seputar pemesanan, pengiriman, dan garansi produk
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-4 font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
