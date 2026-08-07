import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Promo } from '../../types';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  promo?: Promo | null;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  promo,
}) => {
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [maxDiscount, setMaxDiscount] = useState('25000');
  const [minPurchase, setMinPurchase] = useState('50000');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promo) {
      setCode(promo.code || '');
      setDiscountPercent(String(promo.discount_percent || 10));
      setMaxDiscount(String(promo.max_discount || 0));
      setMinPurchase(String(promo.min_purchase || 0));
      setStartDate(promo.start_date || '2026-01-01');
      setEndDate(promo.end_date || '2026-12-31');
      setIsActive(Boolean(promo.is_active));
    } else {
      setCode('');
      setDiscountPercent('10');
      setMaxDiscount('25000');
      setMinPurchase('50000');
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
      setIsActive(true);
    }
  }, [promo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountPercent) return;

    setLoading(true);
    const data = {
      code: code.toUpperCase(),
      discount_percent: Number(discountPercent),
      max_discount: Number(maxDiscount),
      min_purchase: Number(minPurchase),
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
    };

    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800">
            {promo ? 'Edit Voucher Promo' : 'Buat Voucher Promo Baru'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kode Voucher *</label>
            <input
              type="text"
              required
              placeholder="misal: BANGGAUMKM"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Diskon (%) *</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maksimal Diskon (Rp)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Minimal Pembelian (Rp)</label>
            <input
              type="number"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mulai Berlaku</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Berakhir Pada</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActivePromo"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isActivePromo" className="font-semibold text-slate-700">
              Aktifkan Voucher Ini
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow"
            >
              {loading ? 'Menyimpan...' : 'Simpan Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
