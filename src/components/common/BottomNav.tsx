import React from 'react';
import { Home, Grid, Tag, ShoppingBag, User, Heart, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isAdminView,
  setIsAdminView,
}) => {
  const { cart, wishlistIds } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    {
      id: 'home',
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'products',
      label: 'Katalog',
      icon: Grid,
    },
    {
      id: 'promos',
      label: 'Promo',
      icon: Tag,
    },
    {
      id: 'cart',
      label: 'Keranjang',
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: isAuthenticated ? 'profile' : 'login',
      label: isAuthenticated ? 'Akun' : 'Masuk',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-1.5 transition-all lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            !isAdminView &&
            (activeTab === tab.id ||
              (tab.id === 'profile' &&
                ['profile', 'order-history', 'payment-upload', 'invoice'].includes(activeTab)) ||
              (tab.id === 'products' && ['products', 'product-detail'].includes(activeTab)));

          return (
            <button
              key={tab.id}
              onClick={() => {
                setIsAdminView(false);
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'text-emerald-600 stroke-[2.5px]' : 'stroke-[1.8px]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-emerald-700' : 'font-medium text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}

        {isAdmin && (
          <button
            onClick={() => {
              setIsAdminView(!isAdminView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
              isAdminView
                ? 'text-amber-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <ShieldCheck
              className={`w-5 h-5 ${isAdminView ? 'text-amber-600 stroke-[2.5px]' : 'stroke-[1.8px]'}`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight">Admin</span>
            {isAdminView && <span className="w-1 h-1 bg-amber-500 rounded-full mt-0.5"></span>}
          </button>
        )}
      </div>

      {/* Mobile Swipe Home Bar Indicator */}
      <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-1.5"></div>
    </div>
  );
};
