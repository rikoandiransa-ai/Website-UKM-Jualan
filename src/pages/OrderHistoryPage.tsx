import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Upload, Clock, CheckCircle2, AlertCircle, Truck, FileText } from 'lucide-react';
import { Order } from '../types';
import api from '../services/api';

interface OrderHistoryPageProps {
  setActiveTab: (tab: string) => void;
  onSelectOrderForPayment: (order: Order) => void;
  onSelectOrderForInvoice: (order: Order) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  setActiveTab,
  onSelectOrderForPayment,
  onSelectOrderForInvoice,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Selesai</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Dikirim</span>;
      case 'processing':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Diproses</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Dibatalkan</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Menunggu Verifikasi</span>;
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Riwayat Pesanan Saya</h1>
        <p className="text-xs text-slate-500">Pantau status pesanan dan unggah bukti transfer pembayaran Anda</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Belum Ada Transaksi</h3>
          <p className="text-xs text-slate-500">Anda belum membuat transaksi pembelian di toko kami.</p>
          <button
            onClick={() => setActiveTab('products')}
            className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
          >
            Mulai Belanja Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{order.order_number}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">{order.created_at}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.order_status)}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.payment_status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.payment_status === 'paid'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {order.payment_status === 'verified' ? 'Lunas' : order.payment_status === 'paid' ? 'Sudah Bayar' : 'Belum Bayar'}
                  </span>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {item.quantity}x {item.product_name}
                      {item.variation_info && ` (${item.variation_info})`}
                    </span>
                    <span className="text-slate-600">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              {/* Order Total & Actions */}
              <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400">Total Tagihan:</span>
                  <p className="font-extrabold text-sm text-emerald-900">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {order.payment_status === 'unpaid' && (
                    <button
                      onClick={() => onSelectOrderForPayment(order)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl shadow text-xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Bukti Bayar
                    </button>
                  )}
                  <button
                    onClick={() => onSelectOrderForInvoice(order)}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Cetak Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
