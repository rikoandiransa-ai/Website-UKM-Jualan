import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/authRoutes';
import productRoutes from './server/routes/productRoutes';
import categoryRoutes from './server/routes/categoryRoutes';
import orderRoutes from './server/routes/orderRoutes';
import bannerRoutes from './server/routes/bannerRoutes';
import promoRoutes from './server/routes/promoRoutes';
import testimonialRoutes from './server/routes/testimonialRoutes';
import blogRoutes from './server/routes/blogRoutes';
import reportRoutes from './server/routes/reportRoutes';
import settingRoutes from './server/routes/settingRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static uploads route
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/banners', bannerRoutes);
  app.use('/api/promos', promoRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/settings', settingRoutes);

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Toko Penjualan UMKM', version: '1.0.0' });
  });

  // Vite Middleware for Development or Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server toko UMKM berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
});
