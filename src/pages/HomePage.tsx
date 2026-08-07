import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  Quote,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { BannerCarousel } from '../components/common/BannerCarousel';
import { Product, Category, Banner, Testimonial, Blog } from '../types';
import api from '../services/api';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, setActiveTab }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [banRes, catRes, prodRes, testRes, blogRes] = await Promise.all([
        api.get('/banners?active=true'),
        api.get('/categories'),
        api.get('/products'),
        api.get('/testimonials?approved=true'),
        api.get('/blogs?published=true'),
      ]);

      if (banRes.data.success) setBanners(banRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (prodRes.data.success) {
        const allProds: Product[] = prodRes.data.data;
        setFeaturedProducts(allProds.filter((p) => p.is_featured));
        setNewestProducts([...allProds].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()).slice(0, 8));
        setBestSellers([...allProds].sort((a, b) => b.sold_count - a.sold_count).slice(0, 8));
      }
      if (testRes.data.success) setTestimonials(testRes.data.data);
      if (blogRes.data.success) setBlogs(blogRes.data.data);
    } catch (error) {
      console.error('Failed to load home page data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner Carousel */}
      <section className="pt-2">
        <BannerCarousel
          banners={banners}
          onBannerClick={() => setActiveTab('products')}
        />
      </section>

      {/* 2. Promo Announcement Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> VOUCHER SPESIAL UMKM
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Diskon 10% Hingga Rp 25.000 Untuk Seluruh Produk!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Gunakan kode kupon <span className="font-mono font-bold text-amber-300">BANGGAUMKM</span> saat checkout. Dukung pertumbuhan ekonomi lokal bersama kami!
          </p>
        </div>
        <button
          onClick={() => setActiveTab('promos')}
          className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-full shadow-md hover:scale-105 transition shrink-0"
        >
          Klaim Voucher Promo
        </button>
      </section>

      {/* 3. Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Koleksi Terbaik
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Kategori Produk UMKM
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveTab('products')}
              className="group bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-emerald-50 group-hover:scale-105 transition duration-300">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300'}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700 transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {cat.product_count || 0} Produk
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Products / Best Sellers */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Paling Banyak Dicari
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Produk Terlaris & Unggulan
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Lihat Katalog Lengkap <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 5. Newest Products Grid */}
      <section className="space-y-4 pt-4">
        <div className="flex items-end justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Terbaru & Segar
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Produk Baru Rilis
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newestProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
            Kata Pelanggan Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kepuasan & Kepercayaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Ribuan pelanggan telah merasakan kualitas otentik olahan produk UMKM pilihan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-emerald-400 opacity-60" />
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{test.comment}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-700/60">
                <img
                  src={test.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={test.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                />
                <div>
                  <h4 className="font-bold text-xs text-white">{test.name}</h4>
                  <p className="text-[10px] text-slate-400">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Blog Highlights */}
      <section className="space-y-4 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Edukasi & Cerita
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Artikel & Berita UMKM
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('blog')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Lihat Semua Artikel <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <div
              key={b.id}
              onClick={() => setActiveTab('blog')}
              className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden bg-slate-100">
                <img
                  src={b.image}
                  alt={b.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4 sm:w-3/5 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {b.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{b.excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                  <span>{b.author}</span>
                  <span>{b.created_at}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
