import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, Truck, User, MapPin, Phone, CreditCard, Image as ImageIcon } from 'lucide-react';
import { Order } from '../../types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: number, statusData: { order_status?: string; payment_status?: string }) => Promise<void>;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}) => {
  const [orderStatus, setOrderStatus] = useState<string>(order?.order_status || 'pending');
  const [paymentStatus, setPaymentStatus] = useState<string>(order?.payment_status || 'unpaid');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdateStatus(order.id, { order_status: orderStatus, payment_status: paymentStatus });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              {order.order_number}
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-1">Detail Pesanan Pelanggan</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Recipient Details */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
              <User className="w-4 h-4 text-emerald-600" /> Informasi Penerima
            </h4>
            <p className="font-semibold text-slate-800">{order.recipient_name}</p>
            <p className="flex items-center gap-1 text-slate-600">
              <Phone className="w-3 h-3 text-slate-400" /> {order.recipient_phone}
            </p>
            <p className="flex items-start gap-1 text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" /> {order.shipping_address}
            </p>
            {order.notes && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-100 mt-2">
                <strong>Catatan:</strong> {order.notes}
              </p>
            )}
          </div>

          {/* Payment & Shipping Summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Pembayaran & Kurir
            </h4>
            <p><strong>Metode Pembayaran:</strong> {order.payment_method}</p>
            <p><strong>Kurir Pengiriman:</strong> {order.courier}</p>
            <p><strong>Ongkos Kirim:</strong> Rp {order.shipping_cost.toLocaleString('id-ID')}</p>
            <p className="text-sm font-extrabold text-emerald-800 pt-1">
              Total Tagihan: Rp {order.total_amount.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 text-xs">Daftar Produk Dipesan</h4>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-3 bg-white flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{item.product_name}</p>
                  {item.variation_info && (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.variation_info}
                    </span>
                  )}
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <p className="font-bold text-slate-800">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Proof of Payment Upload Preview */}
        {order.payment && (
          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-700" /> Bukti Pembayaran Diunggah Pelanggan
            </h4>
            <div className="flex items-center gap-4">
              <img
                src={order.payment.proof_image}
                alt="Bukti Transfer"
                className="w-24 h-24 object-cover rounded-xl border border-emerald-200 shadow-sm"
              />
              <div className="space-y-1 text-slate-700">
                <p><strong>Bank/E-Wallet:</strong> {order.payment.bank_name}</p>
                <p><strong>Atas Nama:</strong> {order.payment.account_holder}</p>
                <p><strong>Nominal Transfer:</strong> Rp {order.payment.amount.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-slate-500">Waktu Upload: {new Date(order.payment.uploaded_at).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Form Controls */}
        <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Status Pembayaran</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-800 bg-white"
            >
              <option value="unpaid">Belum Dibayar (Unpaid)</option>
              <option value="paid">Sudah Upload Bukti (Paid)</option>
              <option value="verified">Pembayaran Terverifikasi (Verified)</option>
              <option value="rejected">Ditolak / Pembayaran Salah (Rejected)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Status Pengiriman Order</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-800 bg-white"
            >
              <option value="pending">Menunggu Verifikasi (Pending)</option>
              <option value="processing">Pesanan Diproses (Processing)</option>
              <option value="shipped">Pesanan Dikirim (Shipped)</option>
              <option value="completed">Pesanan Selesai (Completed)</option>
              <option value="cancelled">Dibatalkan (Cancelled)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow"
          >
            {loading ? 'Menyimpan...' : 'Perbarui Status Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
