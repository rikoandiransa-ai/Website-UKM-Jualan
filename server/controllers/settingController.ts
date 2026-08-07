import { Request, Response } from 'express';
import { db, Settings } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getSettings = async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, data: db.settings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    db.settings = { ...db.settings, ...updates };

    return res.json({
      success: true,
      message: 'Pengaturan toko berhasil disimpan.',
      data: db.settings,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
