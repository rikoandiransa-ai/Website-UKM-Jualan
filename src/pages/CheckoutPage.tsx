import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface CheckoutPageProps {
  setActiveTab: (tab: string) => void;
  onOrderSuccess: (orderData: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setActiveTab, onOrderSuccess }) => {
  const { cart, cartSubtotal, cartDiscount, appliedPromo, clearCart } = useCart();
  const { user } = useAuth();

  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [courier, setCourier] = useState('JNE Regular (2-3 Hari)');
  const [shippingCost, setShippingCost] = useState(15000);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank BCA');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCourier(val);
    if (val.includes('JNE')) setShippingCost(15000);
    else if (val.includes('TIKI')) setShippingCost(22000);
    else if (val.includes('POS')) setShippingCost(12000);
    else if (val.includes('GoSend')) setShippingCost(30000);
  };

  const finalTotal = cartSubtotal - cartDiscount + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientPhone || !shippingAddress) {
      setError('Mohon lengkapi nama penerima, nomor telepon, dan alamat pengiriman.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const items = cart.map((c) => ({
        product_id: c.product_id,
        quantity: c.quantity,
        price: c.price,
        variation_info: c.variation_info,
      }));

      const res = await api.post('/orders', {
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        shipping_address: shippingAddress,
        courier,
        shipping_cost: shippingCost,
        payment_method: paymentMethod,
        notes,
        promo_code: appliedPromo ? appliedPromo.code : null,
        items,
      });

      if (res.data.success) {
        clearCart();
        onOrderSuccess(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses checkout. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <button
        onClick={() => setActiveTab('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Keranjang
      </button>

      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Checkout Pemesanan</h1>
        <p className="text-xs text-slate-500">Lengkapi data pengiriman dan pilih metode pembayaran</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
        {/* Left Form Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Recipient Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Truck className="w-4 h-4 text-emerald-600" /> Alamat & Kontak Penerima
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Penerima *</label>
                <input
                  type="text"
                  required
                  placeholder="Budi Santoso"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="08123456789"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Pengiriman *</label>
              <textarea
                rows={3}
                required
                placeholder="Jl. Anggrek No. 12, RT 02/RW 05, Kelurahan Menteng, Jakarta Pusat 10310"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Kurir Pengiriman *</label>
              <select
                value={courier}
                onChange={handleCourierChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
              >
                <option value="JNE Regular (2-3 Hari)">JNE Regular - Rp 15.000</option>
                <option value="TIKI Over Night Service (1 Hari)">TIKI ONS (Express) - Rp 22.000</option>
                <option value="POS Indonesia Kilat (2-4 Hari)">POS Indonesia Kilat - Rp 12.000</option>
                <option value="GoSend Instant (Area Jabodetabek)">GoSend Instant - Rp 30.000</option>
              </select>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Metode Pembayaran
            </h3>

            <div className="space-y-2">
              {[
                { id: 'Transfer Bank BCA', label: 'Transfer Bank BCA (Manual Check)', desc: 'No. Rek: 123-456-7890 a/n Toko Karya UMKM' },
                { id: 'Transfer Bank Mandiri', label: 'Transfer Bank Mandiri', desc: 'No. Rek: 987-654-3210 a/n Toko Karya UMKM' },
                { id: 'QRIS Instant Scan', label: 'QRIS All Payment (Gopay/OVO/Dana/ShopeePay)', desc: 'Scan QRIS otomatis di halaman berikutnya' },
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === pm.id
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={paymentMethod === pm.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">{pm.label}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{pm.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                placeholder="misal: Titipkan ke satpam jika rumah kosong"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right Order Summary Panel */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Rincian Pesanan
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                  <span className="line-clamp-1 flex-1 pr-2">
                    {item.quantity}x {item.product_name}
                  </span>
                  <span className="font-semibold text-slate-800 shrink-0">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon Voucher</span>
                  <span>- Rp {cartDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ongkos Kirim ({courier.split(' ')[0]})</span>
                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-extrabold text-slate-900 text-base">
              <span>Total Tagihan</span>
              <span className="text-emerald-800">Rp {finalTotal.toLocaleString('id-ID')}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Membuat Pesanan...' : 'Buat Pesanan & Bayar'}
            </button>

            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Transaksi Terproteksi & Aman
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
