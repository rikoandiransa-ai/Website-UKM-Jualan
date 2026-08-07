import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Banner } from '../../types';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  banner?: Banner | null;
}

export const BannerModal: React.FC<BannerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  banner,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('/products');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banner) {
      setTitle(banner.title || '');
      setSubtitle(banner.subtitle || '');
      setImageUrl(banner.image_url || '');
      setLinkUrl(banner.link_url || '/products');
      setIsActive(Boolean(banner.is_active));
    } else {
      setTitle('');
      setSubtitle('');
      setImageUrl('');
      setLinkUrl('/products');
      setIsActive(true);
      setImageFile(null);
    }
  }, [banner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('link_url', linkUrl);
    formData.append('is_active', String(isActive));

    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      formData.append('image_url', imageUrl);
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800">
            {banner ? 'Edit Banner Slider' : 'Tambah Banner Baru'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Judul Banner *</label>
            <input
              type="text"
              required
              placeholder="misal: Promo Produk Olahan Kedelai"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sub Judul</label>
            <input
              type="text"
              placeholder="Subteks promosi..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Link Target</label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Foto Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 mb-1.5"
            />
            <input
              type="text"
              placeholder="Atau URL Banner https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveBanner"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isActiveBanner" className="font-semibold text-slate-700">
              Aktifkan Banner Ini
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow"
            >
              {loading ? 'Menyimpan...' : 'Simpan Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
