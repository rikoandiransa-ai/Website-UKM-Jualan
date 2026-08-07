import { Request, Response } from 'express';
import { db, Product } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort = 'newest',
      is_featured,
    } = req.query;

    let filtered = [...db.products];

    // Search filter
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Category filter by slug or category_id
    if (category) {
      if (!isNaN(Number(category))) {
        filtered = filtered.filter((p) => p.category_id === Number(category));
      } else {
        const catObj = db.categories.find((c) => c.slug === category);
        if (catObj) {
          filtered = filtered.filter((p) => p.category_id === catObj.id);
        }
      }
    }

    // Min / Max Price Filter
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    // Rating Filter
    if (minRating) {
      filtered = filtered.filter((p) => p.rating >= Number(minRating));
    }

    // Featured filter
    if (is_featured === 'true' || is_featured === '1') {
      filtered = filtered.filter((p) => p.is_featured);
    }

    // Sorting
    switch (sort) {
      case 'lowest_price':
        filtered.sort((a, b) => a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100));
        break;
      case 'highest_price':
        filtered.sort((a, b) => b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100));
        break;
      case 'best_selling':
        filtered.sort((a, b) => b.sold_count - a.sold_count);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return res.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    let product = db.products.find((p) => p.slug === slug || String(p.id) === slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    const category = db.categories.find((c) => c.id === product?.category_id);

    return res.json({
      success: true,
      data: {
        ...product,
        category_name: category ? category.name : 'Umum',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category_id,
      description,
      price,
      discount,
      weight,
      stock,
      image,
      is_featured,
      variations,
    } = req.body;

    if (!name || !category_id || !price) {
      return res.status(400).json({ success: false, message: 'Nama produk, Kategori, dan Harga wajib diisi.' });
    }

    const category = db.categories.find((c) => c.id === Number(category_id));
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : image || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80';

    const newProduct: Product = {
      id: db.products.length > 0 ? Math.max(...db.products.map((p) => p.id)) + 1 : 1,
      category_id: Number(category_id),
      category_name: category ? category.name : '',
      name,
      slug,
      description: description || '',
      price: Number(price),
      discount: Number(discount) || 0,
      weight: Number(weight) || 100,
      stock: Number(stock) || 0,
      image: imageUrl,
      rating: 5.0,
      sold_count: 0,
      is_featured: Boolean(is_featured),
      variations: Array.isArray(variations) ? variations : [],
      reviews: [],
      created_at: new Date().toISOString(),
    };

    db.products.push(newProduct);

    return res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan.',
      data: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    const {
      name,
      category_id,
      description,
      price,
      discount,
      weight,
      stock,
      image,
      is_featured,
      variations,
    } = req.body;

    const current = db.products[index];

    if (name) {
      current.name = name;
      current.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (category_id) {
      current.category_id = Number(category_id);
      const category = db.categories.find((c) => c.id === Number(category_id));
      current.category_name = category ? category.name : current.category_name;
    }
    if (description !== undefined) current.description = description;
    if (price !== undefined) current.price = Number(price);
    if (discount !== undefined) current.discount = Number(discount);
    if (weight !== undefined) current.weight = Number(weight);
    if (stock !== undefined) current.stock = Number(stock);
    if (is_featured !== undefined) current.is_featured = Boolean(is_featured);
    if (Array.isArray(variations)) current.variations = variations;

    if (req.file) {
      current.image = `/uploads/${req.file.filename}`;
    } else if (image) {
      current.image = image;
    }

    db.products[index] = current;

    return res.json({
      success: true,
      message: 'Produk berhasil diperbarui.',
      data: current,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    db.products.splice(index, 1);
    return res.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
    }

    const product = db.products.find((p) => p.id === Number(id));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating harus antara 1 sampai 5 bintang.' });
    }

    const newReview = {
      id: Date.now(),
      product_id: Number(id),
      user_id: user.id,
      user_name: user.name,
      rating: Number(rating),
      comment: comment || '',
      created_at: new Date().toISOString().split('T')[0],
    };

    if (!product.reviews) product.reviews = [];
    product.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));

    return res.status(201).json({
      success: true,
      message: 'Ulasan Anda berhasil ditambahkan!',
      data: newReview,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
    }

    const existingIndex = db.wishlists.findIndex((w) => w.user_id === userId && w.product_id === Number(productId));

    if (existingIndex > -1) {
      db.wishlists.splice(existingIndex, 1);
      return res.json({ success: true, message: 'Produk dihapus dari wishlist.', isWishlisted: false });
    } else {
      db.wishlists.push({
        id: Date.now(),
        user_id: userId,
        product_id: Number(productId),
        created_at: new Date().toISOString(),
      });
      return res.json({ success: true, message: 'Produk ditambahkan ke wishlist!', isWishlisted: true });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishlists = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userWishlistIds = db.wishlists.filter((w) => w.user_id === userId).map((w) => w.product_id);
    const products = db.products.filter((p) => userWishlistIds.includes(p.id));

    return res.json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
