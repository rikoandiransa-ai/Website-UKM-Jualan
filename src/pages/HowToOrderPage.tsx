import React from 'react';
import { Search, ShoppingBag, CreditCard, Truck, CheckCircle2 } from 'lucide-react';

export const HowToOrderPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Pilih Produk UMKM',
      desc: 'Jelajahi katalog produk, filter berdasarkan kategori atau gunakan kolom pencarian untuk menemukan camilan, kopi, atau kerajinan favorit Anda.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Masukkan ke Keranjang',
      desc: 'Pilih variasi produk (rasa/ukuran) dan jumlah yang diinginkan, lalu klik tombol "Tambah ke Keranjang" atau "Beli Sekarang".',
      icon: ShoppingBag,
    },
    {
      num: '03',
      title: 'Lengkapi Data Pengiriman',
      desc: 'Isi nama penerima, nomor WhatsApp aktif, dan alamat pengiriman lengkap, lalu pilih kurir favorit Anda (JNE, TIKI, POS, GoSend, atau GrabExpress).',
      icon: Truck,
    },
    {
      num: '04',
      title: 'Bayar & Konfirmasi Pembayaran',
      desc: 'Pilih metode pembayaran sesuai kenyamanan Anda (Transfer Bank BCA/Mandiri/BNI/BRI/BSI, QRIS, Kartu Kredit/Debit, Gerai Indomaret/Alfamart, atau COD).',
      icon: CreditCard,
    },
    {
      num: '05',
      title: 'Pesanan Dikirim!',
      desc: 'Admin akan memverifikasi pembayaran Anda dan nomor resi pengiriman akan langsung dikirimkan ke riwayat transaksi Anda.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Panduan Cara Pemesanan</h1>
        <p className="text-xs sm:text-sm text-emerald-100">
          Langkah mudah dan praktis untuk berbelanja produk asli UMKM Indonesia
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-extrabold text-lg flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-600" /> {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
