import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Weight,
  Check,
  Star,
  MessageSquare,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { RatingStars } from '../components/common/RatingStars';
import api from '../services/api';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  setActiveTab: (tab: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  setActiveTab,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariation, setSelectedVariation] = useState<any>(
    product.variations && product.variations.length > 0 ? product.variations[0] : null
  );
  const [activeTab, setActiveDetailTab] = useState<'desc' | 'reviews'>('desc');
  const [added, setAdded] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const isWish = isInWishlist(product.id);
  const priceModifier = selectedVariation ? selectedVariation.price_modifier || 0 : 0;
  const basePrice = product.price + priceModifier;
  const discountPrice = basePrice * (1 - (product.discount || 0) / 100);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariation);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariation);
    setActiveTab('cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setActiveTab('login');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product.id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.data.success) {
        setReviewMsg('Terima kasih! Ulasan Anda berhasil ditambahkan.');
        setReviewComment('');
        if (!product.reviews) product.reviews = [];
        product.reviews.unshift(res.data.data);
      }
    } catch (err: any) {
      setReviewMsg(err.response?.data?.message || 'Gagal menambahkan ulasan.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </button>

      {/* Main Product Detail Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Diskon {product.discount}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition ${
                isWish ? 'bg-rose-50 text-rose-500' : 'bg-white/80 text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Product Meta & Purchase Panel */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-2">
              {product.category_name || 'UMKM Nusantara'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating & Sold Meta */}
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-1">
                <RatingStars rating={product.rating} size="sm" />
                <span className="font-bold text-slate-800">{product.rating}</span>
              </div>
              <span>&bull;</span>
              <span>Terjual {product.sold_count || 0} unit</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Weight className="w-3.5 h-3.5 text-emerald-600" /> {product.weight} gram
              </span>
            </div>
          </div>

          {/* Pricing Panel */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 space-y-1">
            {product.discount > 0 && (
              <p className="text-xs text-slate-400 line-through">
                Rp {basePrice.toLocaleString('id-ID')}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                Rp {discountPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-medium text-emerald-700">
                (Tersedia Stok: {product.stock})
              </span>
            </div>
          </div>

          {/* Variations Selector */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Pilih Variasi ({product.variations[0].variation_name}):
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((v, i) => {
                  const isSelected = selectedVariation?.option_value === v.option_value;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedVariation(v)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {v.option_value}
                      {v.price_modifier !== 0 && ` (+Rp ${v.price_modifier.toLocaleString('id-ID')})`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">Jumlah Pesanan:</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-xs text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500">
                Subtotal: <strong className="text-emerald-800">Rp {(discountPrice * quantity).toLocaleString('id-ID')}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                added
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? 'Berhasil Ditambahkan!' : 'Tambah ke Keranjang'}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 transition"
            >
              Beli Sekarang
            </button>
          </div>

          {/* Value Props Badge */}
          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garansi 100% Produk UMKM Asli</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Pengiriman Aman ke Seluruh Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tabs: Description & Reviews */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex border-b border-slate-100 space-x-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveDetailTab('desc')}
            className={`pb-3 transition ${
              activeTab === 'desc'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Deskripsi Produk
          </button>
          <button
            onClick={() => setActiveDetailTab('reviews')}
            className={`pb-3 transition flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Ulasan Pelanggan ({product.reviews?.length || 0})
          </button>
        </div>

        {activeTab === 'desc' ? (
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
            <p>{product.description}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                          {rev.user_name ? rev.user_name[0] : 'U'}
                        </div>
                        <span className="font-bold text-xs text-slate-800">{rev.user_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.created_at}</span>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" />
                    <p className="text-xs text-slate-600">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Belum ada ulasan untuk produk ini. Jadi yang pertama memberi ulasan!</p>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="font-bold text-xs text-emerald-900">Tulis Ulasan Produk</h4>
              {reviewMsg && (
                <p className="text-xs text-emerald-800 bg-emerald-100 p-2 rounded-xl">{reviewMsg}</p>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Beri Bintang Rating:</label>
                  <RatingStars rating={reviewRating} size="lg" interactive onRatingChange={(r) => setReviewRating(r)} />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tuliskan pengalaman Anda memakai atau mengonsumsi produk ini..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
