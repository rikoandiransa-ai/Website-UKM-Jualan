import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Banner } from '../../types';

interface BannerCarouselProps {
  banners: Banner[];
  onBannerClick?: (linkUrl: string) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const activeBanner = banners[currentIndex];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-emerald-900/10 bg-slate-900">
      <div className="relative h-[280px] sm:h-[360px] md:h-[420px] w-full">
        {/* Banner Background Image */}
        <img
          src={activeBanner.image_url}
          alt={activeBanner.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex items-center p-6 sm:p-12 md:p-16">
          <div className="max-w-xl space-y-3 sm:space-y-4">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block backdrop-blur-md">
              Karya UMKM Nusantara
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {activeBanner.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 leading-relaxed">
              {activeBanner.subtitle}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onBannerClick && onBannerClick(activeBanner.link_url)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-emerald-900/50 hover:scale-105 transition"
              >
                Jelajahi Produk Sekarang <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
