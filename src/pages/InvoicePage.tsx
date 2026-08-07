import React from 'react';
import { ArrowLeft, Printer, Download, Store, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import jsPDF from 'jspdf';

interface InvoicePageProps {
  order: Order | null;
  onBack: () => void;
}

export const InvoicePage: React.FC<InvoicePageProps> = ({ order, onBack }) => {
  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-xs text-slate-500">Data invoice tidak ditemukan.</p>
        <button onClick={onBack} className="mt-2 text-xs font-bold text-emerald-700">
          Kembali
        </button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('INVOICE PEMBELIAN UMKM', 14, 20);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`No. Invoice: ${order.order_number}`, 14, 30);
    doc.text(`Tanggal: ${order.created_at}`, 14, 36);
    doc.text(`Status: ${order.order_status.toUpperCase()}`, 14, 42);

    doc.text(`Penerima: ${order.recipient_name}`, 14, 54);
    doc.text(`Telepon: ${order.recipient_phone}`, 14, 60);
    doc.text(`Alamat: ${order.shipping_address}`, 14, 66);

    let y = 80;
    doc.setFont('Helvetica', 'bold');
    doc.text('Produk', 14, y);
    doc.text('Qty', 120, y);
    doc.text('Harga', 140, y);
    doc.text('Subtotal', 170, y);

    doc.setFont('Helvetica', 'normal');
    y += 8;
    order.items?.forEach((item) => {
      doc.text(item.product_name.substring(0, 35), 14, y);
      doc.text(String(item.quantity), 120, y);
      doc.text(`Rp ${item.price.toLocaleString('id-ID')}`, 140, y);
      doc.text(`Rp ${item.subtotal.toLocaleString('id-ID')}`, 170, y);
      y += 8;
    });

    y += 10;
    doc.setFont('Helvetica', 'bold');
    doc.text(`Total Tagihan: Rp ${order.total_amount.toLocaleString('id-ID')}`, 14, y);

    doc.save(`Invoice_${order.order_number}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Cetak
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Unduh PDF
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                Karya<span className="text-emerald-600">UMKM</span>
              </h2>
              <p className="text-[11px] text-slate-500">Pasar Online Produk UMKM Indonesia</p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-1">
              {order.order_number}
            </span>
            <p className="text-[11px] text-slate-400">Tanggal: {order.created_at}</p>
          </div>
        </div>

        {/* Invoice Customer & Order Details */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-1">
              Diterbitkan Untuk:
            </span>
            <p className="font-semibold text-slate-800">{order.recipient_name}</p>
            <p>{order.recipient_phone}</p>
            <p>{order.shipping_address}</p>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-1">
              Rincian Pengiriman:
            </span>
            <p><strong>Kurir:</strong> {order.courier}</p>
            <p><strong>Metode Bayar:</strong> {order.payment_method}</p>
            <p><strong>Status Bayar:</strong> <span className="font-bold text-emerald-700 uppercase">{order.payment_status}</span></p>
          </div>
        </div>

        {/* Item Table */}
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2">Produk</th>
                <th className="py-2 text-center">Jumlah</th>
                <th className="py-2 text-right">Harga Satuan</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-800">
                    {item.product_name}
                    {item.variation_info && (
                      <span className="block text-[10px] text-slate-400">{item.variation_info}</span>
                    )}
                  </td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                  <td className="py-3 text-right font-bold text-slate-800">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="border-t border-slate-200 pt-4 text-right space-y-1">
          <p>Ongkos Kirim: Rp {order.shipping_cost.toLocaleString('id-ID')}</p>
          <p className="text-base font-extrabold text-emerald-900 pt-1">
            Total Pembayaran: Rp {order.total_amount.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};
