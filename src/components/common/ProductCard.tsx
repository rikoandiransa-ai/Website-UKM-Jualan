import React, { useState } from 'react';
import { ShoppingBag, Heart, Check, Weight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = useState(false);

  const isWish = isInWishlist(product.id);
  const discountPrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Hemat {product.discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Terlaris
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition ${
          isWish
            ? 'bg-rose-50 text-rose-500 shadow'
            : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-sm'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
            {product.category_name || 'UMKM Nusantara'}
          </span>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition">
            {product.name}
          </h3>
        </div>

        {/* Rating & Sold Info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <RatingStars rating={product.rating} size="sm" />
            <span className="font-semibold text-slate-700">{product.rating}</span>
          </div>
          <span className="text-slate-400 font-normal">
            Terjual {product.sold_count || 0}
          </span>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-50 flex items-end justify-between gap-1">
          <div>
            {product.discount > 0 && (
              <p className="text-[10px] text-slate-400 line-through leading-none">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
            )}
            <p className="text-sm sm:text-base font-extrabold text-emerald-800 leading-tight">
              Rp {discountPrice.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
              <Weight className="w-2.5 h-2.5" /> {product.weight}g
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition flex items-center justify-center ${
              added
                ? 'bg-emerald-700 text-white'
                : product.stock <= 0
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
            }`}
            title="Tambah ke Keranjang"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
