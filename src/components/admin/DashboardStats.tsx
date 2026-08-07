import React from 'react';
import { Package, Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Produk',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      change: '+12% bulan ini',
    },
    {
      title: 'Total Pelanggan',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
      change: '+18% bulan ini',
    },
    {
      title: 'Total Pesanan',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
      change: '+24% bulan ini',
    },
    {
      title: 'Total Pendapatan',
      value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      change: '+30% dibanding bulan lalu',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                {card.value}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 pt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
