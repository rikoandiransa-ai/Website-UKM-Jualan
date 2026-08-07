import { Request, Response } from 'express';
import { db, Testimonial } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const approvedOnly = req.query.approved === 'true';
    const list = approvedOnly ? db.testimonials.filter((t) => t.is_approved) : db.testimonials;
    return res.json({ success: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, role, comment, rating } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Nama dan Testimoni wajib diisi.' });
    }

    const avatarUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

    const newTestimonial: Testimonial = {
      id: db.testimonials.length > 0 ? Math.max(...db.testimonials.map((t) => t.id)) + 1 : 1,
      name,
      role: role || 'Pelanggan Setia',
      avatar: avatarUrl,
      comment,
      rating: Number(rating) || 5,
      is_approved: true, // Auto-approved for preview
      created_at: new Date().toISOString().split('T')[0],
    };

    db.testimonials.push(newTestimonial);
    return res.status(201).json({
      success: true,
      message: 'Terima kasih! Testimoni Anda berhasil dikirimkan.',
      data: newTestimonial,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleTestimonialApproval = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = db.testimonials.find((t) => t.id === Number(id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimoni tidak ditemukan.' });
    }

    item.is_approved = !item.is_approved;
    return res.json({ success: true, message: 'Status testimoni diperbarui.', data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.testimonials.findIndex((t) => t.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimoni tidak ditemukan.' });
    }

    db.testimonials.splice(index, 1);
    return res.json({ success: true, message: 'Testimoni berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
