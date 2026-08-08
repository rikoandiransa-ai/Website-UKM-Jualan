import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  Menu,
  X,
  Store,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Tag,
  BookOpen,
  HelpCircle,
  Phone,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isAdminView,
  setIsAdminView,
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, wishlistIds } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'products', label: 'Produk UMKM' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'promos', label: 'Promo' },
    { id: 'testimonials', label: 'Testimoni' },
    { id: 'how-to-order', label: 'Cara Pesan' },
    { id: 'faq', label: 'FAQ' },
    { id: 'blog', label: 'Artikel' },
    { id: 'contact', label: 'Kontak' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('products');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-emerald-100">
      {/* Top Banner Bar */}
      <div className="bg-emerald-800 text-white text-[11px] py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-3 text-[10px] sm:text-xs">
          {isAdmin && (
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium text-[10px] transition ${
                isAdminView
                  ? 'bg-amber-400 text-slate-900 font-semibold'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {isAdminView ? 'Mode Toko' : 'Panel Admin'}
            </button>
          )}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-emerald-200 transition text-emerald-100 font-semibold"
          >
            <Phone className="w-3 h-3 text-emerald-300" />
            <span>WhatsApp Support: 0812-3456-7890</span>
          </a>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setActiveTab('home');
              setIsAdminView(false);
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-lg text-emerald-950 tracking-tight leading-none">
                Karya<span className="text-emerald-600">UMKM</span>
              </span>
              <span className="block text-[11px] text-slate-500 font-medium tracking-wide">
                Pasar Online Produk Lokal
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Cari keripik, kopi Gayo, batik Solo, sambal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition"
            >
              Cari
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Button */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full transition border border-emerald-200"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold text-xs">Keranjang</span>
            </button>

            {/* User Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-slate-100 transition border border-slate-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                      {user?.name ? user.name[0] : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5" /> Profil Saya
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('order-history');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Riwayat Pesanan
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsAdminView(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-emerald-700 font-semibold hover:bg-emerald-50 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Panel Admin
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-xs font-semibold px-3 py-1.5 text-emerald-700 hover:text-emerald-800 transition"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-xs font-semibold px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-sm transition"
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-600 lg:hidden rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari produk UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 text-[11px] font-semibold bg-emerald-600 text-white rounded-full"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Navigation Category Bar */}
      <nav className="hidden lg:block bg-slate-50 border-t border-slate-100 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1 py-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsAdminView(false);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === link.id && !isAdminView
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="text-[11px] font-medium text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-emerald-600" /> Gunakan Kode Voucher: <span className="font-bold">BANGGAUMKM</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setIsAdminView(false);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                activeTab === link.id && !isAdminView
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                setIsAdminView(!isAdminView);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-amber-50 text-amber-800 flex items-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4" /> Switch to {isAdminView ? 'Mode Pembeli' : 'Panel Admin'}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
