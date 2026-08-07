import { Request, Response } from 'express';
import { db, Category } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categoriesWithCount = db.categories.map((cat) => ({
      ...cat,
      product_count: db.products.filter((p) => p.category_id === cat.id).length,
    }));
    return res.json({ success: true, data: categoriesWithCount });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : image || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80';

    const newCategory: Category = {
      id: db.categories.length > 0 ? Math.max(...db.categories.map((c) => c.id)) + 1 : 1,
      name,
      slug,
      description: description || '',
      image: imageUrl,
      created_at: new Date().toISOString(),
    };

    db.categories.push(newCategory);
    return res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan.', data: newCategory });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.categories.findIndex((c) => c.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    const { name, description, image } = req.body;
    if (name) {
      db.categories[index].name = name;
      db.categories[index].slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) db.categories[index].description = description;

    if (req.file) {
      db.categories[index].image = `/uploads/${req.file.filename}`;
    } else if (image) {
      db.categories[index].image = image;
    }

    return res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: db.categories[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.categories.findIndex((c) => c.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    db.categories.splice(index, 1);
    return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
