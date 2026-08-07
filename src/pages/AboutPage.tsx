import React from 'react';
import { Store, Award, Users, HeartHandshake, ShieldCheck, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-8 sm:p-12 rounded-3xl shadow-md text-center space-y-3">
        <span className="bg-emerald-900/60 font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full border border-emerald-400/30 inline-block">
          Tentang Karya UMKM Nusantara
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Memberdayakan Usaha Lokal, Menjangkau Seluruh Nusantara
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Wadah pasar digital terpercaya yang menghubungkan pengrajin, produsen camilan tradisional, pembatik, dan petani kopi daerah dengan seluruh konsumen di Indonesia.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Visi Kami</h3>
          <p className="text-slate-600 leading-relaxed">
            Menjadi platform e-commerce UMKM pilihan utama masyarakat Indonesia yang menjamin keaslian, kualitas mutu, serta keberlanjutan ekonomi bagi pengusaha mikro dan kecil.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Misi Utama</h3>
          <p className="text-slate-600 leading-relaxed">
            Membantu digitalisasi UMKM daerah melalui standardisasi pengemasan, sistem transaksi online yang aman, promosi aktif, serta edukasi kewirausahaan secara berkelanjutan.
          </p>
        </div>
      </div>

      {/* Unique Values */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 text-center">Mengapa Memilih Produk Kami?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-center">
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
              100%
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Resep & Bahan Otentik</h4>
            <p className="text-slate-500">
              Menggunakan komoditas lokal seperti kedelai lokal, kopi single origin Gayo, dan rempah alami tanpa bahan pengawet sintetis.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
              QC
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Kontrol Kualitas Ketat</h4>
            <p className="text-slate-500">
              Setiap batch produksi melalui pemeriksaan kebersihan pIRT, sertifikasi Halal, dan ketahanan pengemasan aman.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
              ID
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Dampak Ekonomi Nyata</h4>
            <p className="text-slate-500">
              Setiap pembelian yang Anda lakukan langsung berdampak pada kesejahteraan keluarga petani dan pengrajin lokal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
