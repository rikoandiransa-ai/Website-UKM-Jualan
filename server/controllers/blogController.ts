import { Request, Response } from 'express';
import { db, Blog } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const publishedOnly = req.query.published === 'true';
    const list = publishedOnly ? db.blogs.filter((b) => b.is_published) : db.blogs;
    return res.json({ success: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = db.blogs.find((b) => b.slug === slug || String(b.id) === slug);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    return res.json({ success: true, data: blog });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, excerpt, content, author, category, is_published, image } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Judul dan konten artikel wajib diisi.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const imgUrl = req.file
      ? `/uploads/${req.file.filename}`
      : image || 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=80';

    const newBlog: Blog = {
      id: db.blogs.length > 0 ? Math.max(...db.blogs.map((b) => b.id)) + 1 : 1,
      title,
      slug,
      excerpt: excerpt || content.slice(0, 150) + '...',
      content,
      image: imgUrl,
      author: author || req.user?.name || 'Admin UMKM',
      category: category || 'Edukasi & Bisnis',
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      created_at: new Date().toISOString().split('T')[0],
    };

    db.blogs.push(newBlog);
    return res.status(201).json({ success: true, message: 'Artikel berhasil diterbitkan.', data: newBlog });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.blogs.findIndex((b) => b.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    const { title, excerpt, content, author, category, is_published, image } = req.body;
    if (title) {
      db.blogs[index].title = title;
      db.blogs[index].slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (excerpt !== undefined) db.blogs[index].excerpt = excerpt;
    if (content !== undefined) db.blogs[index].content = content;
    if (author !== undefined) db.blogs[index].author = author;
    if (category !== undefined) db.blogs[index].category = category;
    if (is_published !== undefined) db.blogs[index].is_published = Boolean(is_published);

    if (req.file) {
      db.blogs[index].image = `/uploads/${req.file.filename}`;
    } else if (image) {
      db.blogs[index].image = image;
    }

    return res.json({ success: true, message: 'Artikel berhasil diperbarui.', data: db.blogs[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.blogs.findIndex((b) => b.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    db.blogs.splice(index, 1);
    return res.json({ success: true, message: 'Artikel berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
