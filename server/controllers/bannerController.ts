import { Request, Response } from 'express';
import { db, Banner } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getBanners = async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active === 'true';
    const banners = activeOnly ? db.banners.filter((b) => b.is_active) : db.banners;
    return res.json({ success: true, data: banners });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, image_url, link_url, is_active } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Judul banner wajib diisi.' });
    }

    const img = req.file
      ? `/uploads/${req.file.filename}`
      : image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80';

    const newBanner: Banner = {
      id: db.banners.length > 0 ? Math.max(...db.banners.map((b) => b.id)) + 1 : 1,
      title,
      subtitle: subtitle || '',
      image_url: img,
      link_url: link_url || '/products',
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      created_at: new Date().toISOString(),
    };

    db.banners.push(newBanner);
    return res.status(201).json({ success: true, message: 'Banner berhasil ditambahkan.', data: newBanner });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.banners.findIndex((b) => b.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Banner tidak ditemukan.' });
    }

    const { title, subtitle, image_url, link_url, is_active } = req.body;
    if (title) db.banners[index].title = title;
    if (subtitle !== undefined) db.banners[index].subtitle = subtitle;
    if (link_url !== undefined) db.banners[index].link_url = link_url;
    if (is_active !== undefined) db.banners[index].is_active = Boolean(is_active);

    if (req.file) {
      db.banners[index].image_url = `/uploads/${req.file.filename}`;
    } else if (image_url) {
      db.banners[index].image_url = image_url;
    }

    return res.json({ success: true, message: 'Banner berhasil diperbarui.', data: db.banners[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.banners.findIndex((b) => b.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Banner tidak ditemukan.' });
    }

    db.banners.splice(index, 1);
    return res.json({ success: true, message: 'Banner berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
