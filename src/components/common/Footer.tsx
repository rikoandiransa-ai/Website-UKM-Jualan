import React from 'react';
import { Store, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="bg-emerald-950/60 border-b border-emerald-900/50 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Asli UMKM</h4>
              <p className="text-[11px] text-slate-400">Produk otentik pengrajin lokal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Pengiriman Luas</h4>
              <p className="text-[11px] text-slate-400">Dukungan kurir JNE, TIKI, POS, GoSend</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Pembayaran Aman</h4>
              <p className="text-[11px] text-slate-400">Bank Transfer & QRIS Instant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Garansi Produk</h4>
              <p className="text-[11px] text-slate-400">Jaminan kualitas & purna jual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* SME Brand Info */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Karya<span className="text-emerald-400">UMKM</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs pr-4">
            Platform penjualan online terpercaya untuk Usaha Mikro, Kecil, dan Menengah (UMKM) Indonesia. Menghadirkan produk berkualitas dari camilan tradisional, kopi single origin, batik tulis, hingga kerajinan tangan daerah.
          </p>
          <div className="space-y-1.5 text-xs text-slate-400 pt-2">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              Jl. Merdeka Nusantara No. 88, Jakarta Pusat
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              0812-3456-7890 / WhatsApp Customer Service
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              kontak@karyaumkm.id
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Navigasi Toko</h3>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('home')} className="hover:text-emerald-400 transition">
                Beranda
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('products')} className="hover:text-emerald-400 transition">
                Semua Produk
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('promos')} className="hover:text-emerald-400 transition">
                Voucher & Promo
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('about')} className="hover:text-emerald-400 transition">
                Tentang UMKM
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('blog')} className="hover:text-emerald-400 transition">
                Artikel & Berita
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Help */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Bantuan & Panduan</h3>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('how-to-order')} className="hover:text-emerald-400 transition">
                Cara Pemesanan
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('faq')} className="hover:text-emerald-400 transition">
                Pertanyaan Umum (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('testimonials')} className="hover:text-emerald-400 transition">
                Testimoni Pelanggan
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('contact')} className="hover:text-emerald-400 transition">
                Hubungi Kami
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('privacy')} className="hover:text-emerald-400 transition">
                Kebijakan Privasi
              </button>
            </li>
          </ul>
        </div>

        {/* Payments & Couriers */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Metode Pembayaran</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold text-[11px]">
              BCA
            </span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold text-[11px]">
              Mandiri
            </span>
            <span className="bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded border border-emerald-700/50 font-bold text-[11px]">
              QRIS
            </span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold text-[11px]">
              E-Wallet
            </span>
          </div>

          <h3 className="text-white font-semibold mb-2 text-xs uppercase tracking-wider">Kurir Pengiriman</h3>
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
            <span className="bg-slate-800 px-2 py-0.5 rounded">JNE</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded">TIKI</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded">POS Indonesia</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded">GoSend</span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950 py-4 px-4 text-center text-slate-500 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px]">
          <p>&copy; 2026 Toko Karya UMKM Nusantara. Hak Cipta Dilindungi.</p>
          <p className="text-emerald-400 font-medium">Dibuat dengan bangga untuk Kemajuan UMKM Indonesia 🇮🇩</p>
        </div>
      </div>
    </footer>
  );
};
