import React from 'react';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  setActiveTab: (tab: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setActiveTab }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartDiscount, cartTotal, appliedPromo, applyPromo, removePromo } = useCart();
  const [promoCodeInput, setPromoCodeInput] = React.useState('');
  const [promoMsg, setPromoMsg] = React.useState({ text: '', isError: false });

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const result = await applyPromo(promoCodeInput.trim());
    setPromoMsg({ text: result.message, isError: !result.success });
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4 max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Keranjang Belanja Kosong</h2>
        <p className="text-xs text-slate-500">
          Anda belum menambahkan produk UMKM ke keranjang belanja. Yuk, jelajahi produk unik lokal kami!
        </p>
        <button
          onClick={() => setActiveTab('products')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-lg transition"
        >
          Mulai Belanja <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Keranjang Belanja</h1>
          <p className="text-xs text-slate-500">Periksa item pesanan Anda sebelum lanjut ke pembayaran</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item Table */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div
              key={`${item.product_id}-${item.variation_info}`}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                    {item.product_name}
                  </h3>
                  {item.variation_info && (
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block my-0.5">
                      {item.variation_info}
                    </span>
                  )}
                  <p className="text-xs font-semibold text-emerald-800 mt-1">
                    Rp {item.price.toLocaleString('id-ID')} / unit
                  </p>
                </div>
              </div>

              {/* Quantity controls & subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-2 sm:pt-0 border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.variation_info, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-white shadow-xs font-bold text-slate-700 hover:bg-slate-100 text-xs flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.variation_info, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-white shadow-xs font-bold text-slate-700 hover:bg-slate-100 text-xs flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id, item.variation_info)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Promo Voucher Side Panel */}
        <div className="space-y-4">
          {/* Voucher Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" /> Punya Kode Promo?
            </h3>
            {appliedPromo ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-900 font-mono">{appliedPromo.code}</p>
                  <p className="text-[11px] text-emerald-700">
                    Potongan {appliedPromo.discount_percent}% (Hemat Rp {cartDiscount.toLocaleString('id-ID')})
                  </p>
                </div>
                <button
                  onClick={removePromo}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kode: BANGGAUMKM"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Pakai
                </button>
              </form>
            )}
            {promoMsg.text && (
              <p className={`text-[11px] ${promoMsg.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                {promoMsg.text}
              </p>
            )}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Ringkasan Belanja
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Total Harga Produk</span>
                <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Diskon Promo</span>
                  <span>- Rp {cartDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-extrabold text-slate-900 text-base">
              <span>Total Pembayaran</span>
              <span className="text-emerald-800">Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 mt-2"
            >
              Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
