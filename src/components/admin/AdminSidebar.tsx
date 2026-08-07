import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  Tag,
  ShoppingBag,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  adminTab: string;
  setAdminTab: (tab: string) => void;
  onExitAdmin: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  adminTab,
  setAdminTab,
  onExitAdmin,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Kelola Produk', icon: Package },
    { id: 'categories', label: 'Kelola Kategori', icon: FolderTree },
    { id: 'orders', label: 'Kelola Pesanan', icon: ShoppingBag },
    { id: 'customers', label: 'Data Pelanggan', icon: Users },
    { id: 'banners', label: 'Banner & Slider', icon: ImageIcon },
    { id: 'promos', label: 'Voucher Promo', icon: Tag },
    { id: 'testimonials', label: 'Testimoni', icon: MessageSquare },
    { id: 'blogs', label: 'Artikel & Blog', icon: FileText },
    { id: 'reports', label: 'Laporan Penjualan', icon: BarChart3 },
    { id: 'settings', label: 'Pengaturan Toko', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between shrink-0 border-r border-slate-800">
      <div>
        {/* Header Branding */}
        <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm tracking-tight">Admin UMKM</h2>
              <span className="text-[10px] text-emerald-400 font-medium">Control Center</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Exit Button */}
      <div className="pt-6 border-t border-slate-800">
        <button
          onClick={onExitAdmin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Toko
        </button>
      </div>
    </aside>
  );
};
