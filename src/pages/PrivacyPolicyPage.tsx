import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Kebijakan Privasi</h1>
        <p className="text-xs sm:text-sm text-emerald-100">
          Komitmen kami menjaga kerahasiaan dan keamanan data pribadi Anda
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm">1. Pengumpulan Data Informasi</h3>
        <p>
          Kami mengumpulkan informasi yang Anda berikan saat membuat akun, melakukan pemesanan, atau menghubungi customer service kami. Data ini meliputi nama lengkap, nomor WhatsApp/telepon, alamat pengiriman, dan riwayat transaksi.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">2. Penggunaan Informasi Data</h3>
        <p>
          Informasi pribadi Anda digunakan khusus untuk memproses pengiriman order, memverifikasi bukti pembayaran, mengirimkan pembaruan status pesanan melalui WhatsApp/email, serta meningkatkan pengalaman berbelanja Anda.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">3. Perlindungan Keamanan Informasi</h3>
        <p>
          Kami menerapkan enkripsi password menggunakan bcrypt dan token autentikasi JWT standar industri untuk menjamin keamanan akun serta mencegah akses tidak sah dari pihak luar.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">4. Pihak Ketiga & Kurir</h3>
        <p>
          Data nama dan alamat pengiriman Anda hanya diserahkan kepada pihak mitra ekspedisi resmi (JNE, TIKI, POS Indonesia, GoSend) semata-mata untuk keperluan pengantaran paket pesanan.
        </p>
      </div>
    </div>
  );
};
