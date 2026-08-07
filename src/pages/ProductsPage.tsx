import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { Product, Category, ProductFilterState } from '../types';
import api from '../services/api';

interface ProductsPageProps {
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onSelectProduct,
  searchQuery,
  setSearchQuery,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'lowest_price' | 'highest_price' | 'best_selling' | 'rating'>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, minPrice, maxPrice, minRating, sortBy]);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice > 0) params.append('minPrice', String(minPrice));
      if (maxPrice < 500000) params.append('maxPrice', String(maxPrice));
      if (minRating > 0) params.append('minRating', String(minRating));
      if (sortBy) params.append('sort', sortBy);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMinPrice(0);
    setMaxPrice(500000);
    setMinRating(0);
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Katalog Produk UMKM</h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
          Temukan aneka kuliner khas, olahan herbal, batik tulis, dan kerajinan tangan berkualitas tinggi buatan pengrajin lokal Indonesia.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter Produk
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Input Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Pencarian Kata Kunci</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Batas Harga (Rp)</label>
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
              <span>Rp {minPrice.toLocaleString('id-ID')}</span>
              <span>Rp {maxPrice.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Rating Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Rating Minimal</label>
            <div className="space-y-1 text-xs text-slate-600">
              {[0, 4, 4.5, 5].map((stars) => (
                <label key={stars} className="flex items-center gap-2 cursor-pointer hover:text-emerald-700">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === stars}
                    onChange={() => setMinRating(stars)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{stars === 0 ? 'Semua Rating' : `★ ${stars} Bintang ke Atas`}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Main Content */}
        <main className="flex-1 space-y-4">
          {/* Top Sort & Mobile Filter Button Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200"
            >
              <Filter className="w-4 h-4" /> Filter & Cari
            </button>

            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Menampilkan <strong className="text-slate-800">{products.length}</strong> produk
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Terbaru (Newest)</option>
                <option value="best_selling">Terlaris (Best Seller)</option>
                <option value="lowest_price">Harga Terendah</option>
                <option value="highest_price">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian, batas harga, atau pilihan kategori Anda.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-80 h-full p-6 space-y-5 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter Produk
              </h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cari Nama</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Maksimal Harga</label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <span className="font-bold text-emerald-800">
                  Rp {maxPrice.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-1/2 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl shadow"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
