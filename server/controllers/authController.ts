import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db';
import { generateToken, AuthRequest } from '../middlewares/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, Email, dan Password wajib diisi.' });
    }

    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role: 'customer' as const,
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);

    const token = generateToken(newUser);
    const { password: _, ...userWithoutPass } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil!',
      data: {
        token,
        user: userWithoutPass,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan Password wajib diisi.' });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password tidak ditemukan.' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPass } = user;

    return res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        token,
        user: userWithoutPass,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const { password, ...userWithoutPass } = user;
    return res.json({ success: true, data: userWithoutPass });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, phone, address } = req.body;

    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    if (name) db.users[userIndex].name = name;
    if (phone !== undefined) db.users[userIndex].phone = phone;
    if (address !== undefined) db.users[userIndex].address = address;

    const { password, ...updatedUser } = db.users[userIndex];
    return res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Password saat ini dan password baru wajib diisi.' });
    }

    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return res.json({ success: true, message: 'Password berhasil diubah!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Masukkan email terdaftar.' });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email tidak terdaftar dalam sistem.' });
    }

    return res.json({
      success: true,
      message: 'Instruksi reset password telah dikirimkan ke email Anda. Silakan periksa kotak masuk.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const customers = db.users
      .filter((u) => u.role === 'customer')
      .map(({ password, ...u }) => ({
        ...u,
        total_orders: db.orders.filter((o) => o.user_id === u.id).length,
      }));

    return res.json({ success: true, data: customers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
