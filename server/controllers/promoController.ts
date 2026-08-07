import { Request, Response } from 'express';
import { db, Promo } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getPromos = async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active === 'true';
    const promos = activeOnly ? db.promos.filter((p) => p.is_active) : db.promos;
    return res.json({ success: true, data: promos });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPromo = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Kode kupon wajib diisi.' });
    }

    const promo = db.promos.find((p) => p.code.toUpperCase() === code.toUpperCase() && p.is_active);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Kode kupon promo tidak valid atau telah berakhir.' });
    }

    const total = Number(cartTotal) || 0;
    if (promo.min_purchase > 0 && total < promo.min_purchase) {
      return res.status(400).json({
        success: false,
        message: `Minimal pembelian Rp ${promo.min_purchase.toLocaleString('id-ID')} untuk menggunakan voucher ini.`,
      });
    }

    let discount = (total * promo.discount_percent) / 100;
    if (promo.max_discount > 0 && discount > promo.max_discount) {
      discount = promo.max_discount;
    }

    return res.json({
      success: true,
      message: `Berhasil! Diskon Rp ${discount.toLocaleString('id-ID')} diterapkan.`,
      data: {
        code: promo.code,
        discount_amount: discount,
        discount_percent: promo.discount_percent,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPromo = async (req: AuthRequest, res: Response) => {
  try {
    const { code, discount_percent, max_discount, min_purchase, start_date, end_date, is_active } = req.body;
    if (!code || !discount_percent) {
      return res.status(400).json({ success: false, message: 'Kode voucher dan Persentase diskon wajib diisi.' });
    }

    const newPromo: Promo = {
      id: db.promos.length > 0 ? Math.max(...db.promos.map((p) => p.id)) + 1 : 1,
      code: code.toUpperCase(),
      discount_percent: Number(discount_percent),
      max_discount: Number(max_discount) || 0,
      min_purchase: Number(min_purchase) || 0,
      start_date: start_date || '2026-01-01',
      end_date: end_date || '2026-12-31',
      is_active: is_active !== undefined ? Boolean(is_active) : true,
    };

    db.promos.push(newPromo);
    return res.status(201).json({ success: true, message: 'Promo berhasil dibuat.', data: newPromo });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePromo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.promos.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Promo tidak ditemukan.' });
    }

    const { code, discount_percent, max_discount, min_purchase, start_date, end_date, is_active } = req.body;
    if (code) db.promos[index].code = code.toUpperCase();
    if (discount_percent !== undefined) db.promos[index].discount_percent = Number(discount_percent);
    if (max_discount !== undefined) db.promos[index].max_discount = Number(max_discount);
    if (min_purchase !== undefined) db.promos[index].min_purchase = Number(min_purchase);
    if (start_date) db.promos[index].start_date = start_date;
    if (end_date) db.promos[index].end_date = end_date;
    if (is_active !== undefined) db.promos[index].is_active = Boolean(is_active);

    return res.json({ success: true, message: 'Promo berhasil diperbarui.', data: db.promos[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePromo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.promos.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Promo tidak ditemukan.' });
    }

    db.promos.splice(index, 1);
    return res.json({ success: true, message: 'Promo berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
