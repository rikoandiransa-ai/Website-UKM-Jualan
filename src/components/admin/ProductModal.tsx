import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  product?: Product | null;
  categories: Category[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [weight, setWeight] = useState('100');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [variations, setVariations] = useState<{ variation_name: string; option_value: string; price_modifier: number; stock: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategoryId(String(product.category_id || (categories[0]?.id || '')));
      setPrice(String(product.price || ''));
      setDiscount(String(product.discount || 0));
      setWeight(String(product.weight || 100));
      setStock(String(product.stock || 0));
      setDescription(product.description || '');
      setImageUrl(product.image || '');
      setIsFeatured(Boolean(product.is_featured));
      setVariations(product.variations || []);
    } else {
      setName('');
      setCategoryId(categories.length > 0 ? String(categories[0].id) : '');
      setPrice('');
      setDiscount('0');
      setWeight('100');
      setStock('10');
      setDescription('');
      setImageUrl('');
      setImageFile(null);
      setIsFeatured(false);
      setVariations([]);
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddVariation = () => {
    setVariations([...variations, { variation_name: 'Rasa', option_value: 'Pedas', price_modifier: 0, stock: 10 }]);
  };

  const handleRemoveVariation = (idx: number) => {
    setVariations(variations.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !price) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', categoryId);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('weight', weight);
    formData.append('stock', stock);
    formData.append('description', description);
    formData.append('is_featured', String(isFeatured));
    formData.append('variations', JSON.stringify(variations));

    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      formData.append('image', imageUrl);
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {product ? 'Edit Produk UMKM' : 'Tambah Produk Baru'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Produk *</label>
              <input
                type="text"
                required
                placeholder="misal: Keripik Tempe Renyah Original"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harga (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="25000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Diskon (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Berat (Gram)</label>
              <input
                type="number"
                min="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Stok Barang</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deskripsi Produk</label>
            <textarea
              rows={3}
              placeholder="Jelaskan keunggulan, bahan baku, dan saran penyajian..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Product Image Upload */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Foto Produk</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <span className="text-[11px] text-slate-400">Atau URL Gambar:</span>
            </div>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Variations Setup */}
          <div className="border border-slate-100 bg-slate-50 p-3 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Variasi Produk (Opsional: Rasa/Ukuran)</span>
              <button
                type="button"
                onClick={handleAddVariation}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Variasi
              </button>
            </div>
            {variations.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Jenis (misal: Rasa)"
                  value={v.variation_name}
                  onChange={(e) => {
                    const copy = [...variations];
                    copy[i].variation_name = e.target.value;
                    setVariations(copy);
                  }}
                  className="w-1/3 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Opsi (misal: Pedas)"
                  value={v.option_value}
                  onChange={(e) => {
                    const copy = [...variations];
                    copy[i].option_value = e.target.value;
                    setVariations(copy);
                  }}
                  className="w-1/3 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVariation(i)}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isFeatured" className="font-medium text-slate-700">
              Tampilkan sebagai Produk Unggulan di Beranda
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
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
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
