import React, { useState } from 'react';
import { CheckCircle2, Upload, CreditCard, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import api from '../services/api';

interface PaymentUploadPageProps {
  orderData: any;
  setActiveTab: (tab: string) => void;
}

export const PaymentUploadPage: React.FC<PaymentUploadPageProps> = ({ orderData, setActiveTab }) => {
  const [bankName, setBankName] = useState('Bank BCA');
  const [accountHolder, setAccountHolder] = useState('');
  const [amount, setAmount] = useState(orderData?.total_amount || '');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!orderData) {
    return (
      <div className="text-center py-12">
        <p className="text-xs text-slate-500">Data pesanan tidak ditemukan.</p>
        <button onClick={() => setActiveTab('home')} className="mt-2 text-xs font-bold text-emerald-700">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleUploadPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountHolder || !amount || !proofFile) {
      setError('Mohon isi nama pemilik rekening, nominal transfer, dan pilih foto bukti transfer.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('bank_name', bankName);
      formData.append('account_holder', accountHolder);
      formData.append('amount', String(amount));
      formData.append('proof_image', proofFile);

      const res = await api.post(`/orders/${orderData.id}/payment`, formData);
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border border-slate-100 shadow-lg space-y-4 my-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Bukti Transfer Berhasil Diunggah!</h2>
        <p className="text-xs text-slate-500">
          Pesanan Anda dengan nomor <strong>{orderData.order_number}</strong> sedang diverifikasi oleh admin. Kami akan memproses pengiriman secepatnya.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => setActiveTab('order-history')}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
          >
            Lihat Riwayat Pesanan
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
          >
            Kembali Berbelanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 rounded-3xl shadow-md text-center space-y-2">
        <span className="bg-emerald-900/60 font-mono font-bold text-xs px-3 py-1 rounded-full border border-emerald-400/30">
          Nomor Pesanan: {orderData.order_number}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Total Tagihan: Rp {Number(orderData.total_amount).toLocaleString('id-ID')}
        </h1>
        <p className="text-xs text-emerald-100">
          Silakan lakukan pembayaran sesuai nominal di atas ke rekening resmi toko kami.
        </p>
      </div>

      {/* Payment Target Account Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
          <CreditCard className="w-4 h-4 text-emerald-600" /> Rekening Tujuan Transfer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-800 block">Bank BCA</span>
            <p className="font-mono text-emerald-800 font-bold text-sm my-0.5">123-456-7890</p>
            <p className="text-[11px] text-slate-500">a/n Toko Karya UMKM Nusantara</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-800 block">Bank Mandiri</span>
            <p className="font-mono text-emerald-800 font-bold text-sm my-0.5">987-654-3210</p>
            <p className="text-[11px] text-slate-500">a/n Toko Karya UMKM Nusantara</p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Form Konfirmasi Pembayaran</h3>

        {error && (
          <p className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleUploadPayment} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank / E-Wallet Pengirim *</label>
              <input
                type="text"
                required
                placeholder="misal: BCA / Gopay / Mandiri"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Pemilik Rekening *</label>
              <input
                type="text"
                required
                placeholder="Budi Santoso"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nominal Ditransfer (Rp) *</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Foto Bukti Transfer *</label>
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 transition">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => e.target.files && setProofFile(e.target.files[0])}
                className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-600 file:text-white file:font-bold hover:file:bg-emerald-700"
              />
              <p className="text-[10px] text-slate-400 mt-2">Format gambar JPG, PNG, max 5MB</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
          </button>
        </form>
      </div>
    </div>
  );
};
