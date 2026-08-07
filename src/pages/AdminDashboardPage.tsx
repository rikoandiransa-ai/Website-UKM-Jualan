import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  Save,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DashboardStats } from '../components/admin/DashboardStats';
import { RevenueChart } from '../components/admin/RevenueChart';
import { ProductModal } from '../components/admin/ProductModal';
import { CategoryModal } from '../components/admin/CategoryModal';
import { BannerModal } from '../components/admin/BannerModal';
import { PromoModal } from '../components/admin/PromoModal';
import { BlogModal } from '../components/admin/BlogModal';
import { OrderDetailModal } from '../components/admin/OrderDetailModal';

import { Product, Category, Banner, Promo, Order, Testimonial, Blog } from '../types';
import api from '../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface AdminDashboardPageProps {
  onExitAdmin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onExitAdmin }) => {
  const [adminTab, setAdminTab] = useState('dashboard');

  // Data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [settings, setSettings] = useState<any>({});

  const [loading, setLoading] = useState(true);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, [adminTab]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      if (adminTab === 'dashboard') {
        const res = await api.get('/reports/dashboard');
        if (res.data.success) setDashboardData(res.data.data);
      } else if (adminTab === 'products') {
        const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
        if (pRes.data.success) setProducts(pRes.data.data);
        if (cRes.data.success) setCategories(cRes.data.data);
      } else if (adminTab === 'categories') {
        const res = await api.get('/categories');
        if (res.data.success) setCategories(res.data.data);
      } else if (adminTab === 'orders') {
        const res = await api.get('/orders');
        if (res.data.success) setOrders(res.data.data);
      } else if (adminTab === 'customers') {
        const res = await api.get('/reports/customers');
        if (res.data.success) setCustomers(res.data.data);
      } else if (adminTab === 'banners') {
        const res = await api.get('/banners');
        if (res.data.success) setBanners(res.data.data);
      } else if (adminTab === 'promos') {
        const res = await api.get('/promos');
        if (res.data.success) setPromos(res.data.data);
      } else if (adminTab === 'testimonials') {
        const res = await api.get('/testimonials');
        if (res.data.success) setTestimonials(res.data.data);
      } else if (adminTab === 'blogs') {
        const res = await api.get('/blogs');
        if (res.data.success) setBlogs(res.data.data);
      } else if (adminTab === 'reports') {
        const res = await api.get('/reports/sales');
        if (res.data.success) setDashboardData(res.data.data);
      } else if (adminTab === 'settings') {
        const res = await api.get('/settings');
        if (res.data.success) setSettings(res.data.data);
      }
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Handlers
  const handleProductSubmit = async (formData: FormData) => {
    if (selectedProduct) {
      await api.put(`/products/${selectedProduct.id}`, formData);
    } else {
      await api.post('/products', formData);
    }
    loadAllAdminData();
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      await api.delete(`/products/${id}`);
      loadAllAdminData();
    }
  };

  const handleCategorySubmit = async (formData: FormData) => {
    if (selectedCategory) {
      await api.put(`/categories/${selectedCategory.id}`, formData);
    } else {
      await api.post('/categories', formData);
    }
    loadAllAdminData();
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Hapus kategori ini?')) {
      await api.delete(`/categories/${id}`);
      loadAllAdminData();
    }
  };

  const handleBannerSubmit = async (formData: FormData) => {
    if (selectedBanner) {
      await api.put(`/banners/${selectedBanner.id}`, formData);
    } else {
      await api.post('/banners', formData);
    }
    loadAllAdminData();
  };

  const handleDeleteBanner = async (id: number) => {
    if (window.confirm('Hapus banner ini?')) {
      await api.delete(`/banners/${id}`);
      loadAllAdminData();
    }
  };

  const handlePromoSubmit = async (data: any) => {
    if (selectedPromo) {
      await api.put(`/promos/${selectedPromo.id}`, data);
    } else {
      await api.post('/promos', data);
    }
    loadAllAdminData();
  };

  const handleDeletePromo = async (id: number) => {
    if (window.confirm('Hapus promo ini?')) {
      await api.delete(`/promos/${id}`);
      loadAllAdminData();
    }
  };

  const handleBlogSubmit = async (formData: FormData) => {
    if (selectedBlog) {
      await api.put(`/blogs/${selectedBlog.id}`, formData);
    } else {
      await api.post('/blogs', formData);
    }
    loadAllAdminData();
  };

  const handleDeleteBlog = async (id: number) => {
    if (window.confirm('Hapus artikel ini?')) {
      await api.delete(`/blogs/${id}`);
      loadAllAdminData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, statusData: any) => {
    await api.put(`/orders/${orderId}/status`, statusData);
    loadAllAdminData();
  };

  const handleToggleTestimonial = async (id: number, currentApproved: boolean) => {
    await api.put(`/testimonials/${id}`, { is_approved: !currentApproved });
    loadAllAdminData();
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (window.confirm('Hapus testimoni ini?')) {
      await api.delete(`/testimonials/${id}`);
      loadAllAdminData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put('/settings', settings);
    alert('Pengaturan toko berhasil diperbarui!');
  };

  // EXPORT EXCEL & PDF
  const exportExcelReport = () => {
    const reportData = orders.map((o) => ({
      'No Order': o.order_number,
      Tanggal: o.created_at,
      Penerima: o.recipient_name,
      Telepon: o.recipient_phone,
      Alamat: o.shipping_address,
      Total: o.total_amount,
      'Status Pembayaran': o.payment_status,
      'Status Pengiriman': o.order_status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Penjualan');
    XLSX.writeFile(workbook, 'Laporan_Penjualan_UMKM.xlsx');
  };

  const exportPdfReport = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('LAPORAN PENJUALAN TOKO UMKM', 14, 20);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

    let y = 40;
    doc.setFont('Helvetica', 'bold');
    doc.text('No Order', 14, y);
    doc.text('Penerima', 60, y);
    doc.text('Total', 120, y);
    doc.text('Status', 160, y);

    doc.setFont('Helvetica', 'normal');
    y += 8;
    orders.forEach((o) => {
      doc.text(o.order_number, 14, y);
      doc.text(o.recipient_name.substring(0, 25), 60, y);
      doc.text(`Rp ${o.total_amount.toLocaleString('id-ID')}`, 120, y);
      doc.text(o.order_status, 160, y);
      y += 8;
    });

    doc.save('Laporan_Penjualan_UMKM.pdf');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <AdminSidebar adminTab={adminTab} setAdminTab={setAdminTab} onExitAdmin={onExitAdmin} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        {/* Render Active View */}
        {adminTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Ringkasan Performa Toko</h1>
                <p className="text-xs text-slate-500">Statistik realtime penjualan dan pesanan masuk</p>
              </div>
            </div>

            <DashboardStats stats={dashboardData.stats} />
            <RevenueChart data={dashboardData.monthlyChart} />
          </div>
        )}

        {/* PRODUCTS CRUD VIEW */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kelola Produk UMKM</h1>
                <p className="text-xs text-slate-500">Tambah, ubah, atau atur variasi dan stok produk</p>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Produk Baru
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Cari nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-64"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100 text-[10px]">
                    <tr>
                      <th className="p-3">Produk</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Harga</th>
                      <th className="p-3">Stok</th>
                      <th className="p-3">Terjual</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="p-3 flex items-center gap-3 font-semibold text-slate-800">
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-lg object-cover bg-slate-100"
                            />
                            <span>{p.name}</span>
                          </td>
                          <td className="p-3 text-slate-600">{p.category_name}</td>
                          <td className="p-3 font-bold text-emerald-800">
                            Rp {p.price.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 font-semibold">{p.stock}</td>
                          <td className="p-3 text-slate-500">{p.sold_count || 0}</td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES VIEW */}
        {adminTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kelola Kategori Produk</h1>
                <p className="text-xs text-slate-500">Kategori pengelompokan produk UMKM</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Kategori
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">{c.product_count || 0} Produk</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(c);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-emerald-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT VIEW */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kelola Pesanan Pelanggan</h1>
                <p className="text-xs text-slate-500">Verifikasi bukti transfer dan update status pengiriman</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100 text-[10px]">
                    <tr>
                      <th className="p-3">No. Order</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status Bayar</th>
                      <th className="p-3">Status Kirim</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-emerald-800">{o.order_number}</td>
                        <td className="p-3 font-semibold">{o.recipient_name}</td>
                        <td className="p-3 font-bold text-slate-800">Rp {o.total_amount.toLocaleString('id-ID')}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.payment_status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.payment_status === 'paid'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {o.order_status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setIsOrderDetailModalOpen(true);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs"
                          >
                            Kelola Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS VIEW */}
        {adminTab === 'customers' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Data Pelanggan Terdaftar</h1>
              <p className="text-xs text-slate-500">Daftar akun pelanggan dan total riwayat transaksi</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100 text-[10px]">
                  <tr>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Jumlah Transaksi</th>
                    <th className="p-3">Total Belanja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-slate-800">{c.name}</td>
                      <td className="p-3 text-slate-600">{c.email}</td>
                      <td className="p-3">{c.phone}</td>
                      <td className="p-3 font-semibold">{c.order_count || 0} Order</td>
                      <td className="p-3 font-bold text-emerald-800">Rp {(c.total_spent || 0).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BANNERS VIEW */}
        {adminTab === 'banners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kelola Banner Slider</h1>
                <p className="text-xs text-slate-500">Atur tampilan slider promo di halaman depan toko</p>
              </div>
              <button
                onClick={() => {
                  setSelectedBanner(null);
                  setIsBannerModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <img src={b.image_url} alt={b.title} className="w-full h-36 object-cover rounded-xl" />
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800">{b.title}</h4>
                      <p className="text-slate-500 text-[11px]">{b.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedBanner(b);
                          setIsBannerModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBanner(b.id)} className="p-1.5 text-slate-500 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROMOS VIEW */}
        {adminTab === 'promos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kelola Voucher Promo</h1>
                <p className="text-xs text-slate-500">Buat kupon diskon untuk meningkatkan transaksi</p>
              </div>
              <button
                onClick={() => {
                  setSelectedPromo(null);
                  setIsPromoModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Buat Voucher Promo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {promos.map((pr) => (
                <div key={pr.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-800 text-sm bg-emerald-50 px-2.5 py-1 rounded-md">
                      {pr.code}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedPromo(pr);
                          setIsPromoModalOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-emerald-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeletePromo(pr.id)} className="p-1 text-slate-500 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600">Diskon {pr.discount_percent}% (Maks: Rp {pr.max_discount.toLocaleString('id-ID')})</p>
                  <p className="text-[11px] text-slate-400">Min. Beli: Rp {pr.min_purchase.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS VIEW */}
        {adminTab === 'testimonials' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Moderasi Testimoni</h1>
              <p className="text-xs text-slate-500">Setujui atau sembunyikan testimoni ulasan pelanggan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{t.name} ({t.role})</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.is_approved ? 'Disetujui' : 'Menunggu Moderasi'}
                    </span>
                  </div>
                  <p className="text-slate-600 italic">"{t.comment}"</p>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleTestimonial(t.id, t.is_approved)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                    >
                      {t.is_approved ? 'Sembunyikan' : 'Setujui Tampil'}
                    </button>
                    <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOGS VIEW */}
        {adminTab === 'blogs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kelola Artikel Blog</h1>
                <p className="text-xs text-slate-500">Edukasi konsumen tentang produk dan keunggulan UMKM</p>
              </div>
              <button
                onClick={() => {
                  setSelectedBlog(null);
                  setIsBlogModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tulis Artikel Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800 text-sm">{b.title}</h4>
                  <p className="text-slate-500 line-clamp-2">{b.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">{b.created_at}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedBlog(b);
                          setIsBlogModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBlog(b.id)} className="p-1.5 text-slate-500 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SALES REPORTS VIEW */}
        {adminTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Laporan Penjualan</h1>
                <p className="text-xs text-slate-500">Ekspor rekapitulasi data penjualan ke format PDF dan Excel</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportExcelReport}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel (.xlsx)
                </button>
                <button
                  onClick={exportPdfReport}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Ekspor PDF (.pdf)
                </button>
              </div>
            </div>

            {dashboardData && <RevenueChart data={dashboardData.monthlyChart} />}
          </div>
        )}

        {/* SETTINGS VIEW */}
        {adminTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Pengaturan Toko UMKM</h1>
              <p className="text-xs text-slate-500">Konfigurasi identitas toko, CS, dan rekening bank</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Toko *</label>
                <input
                  type="text"
                  value={settings.store_name || ''}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Customer Service</label>
                <input
                  type="text"
                  value={settings.store_phone || ''}
                  onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Usaha</label>
                <textarea
                  rows={2}
                  value={settings.store_address || ''}
                  onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rekening BCA</label>
                  <input
                    type="text"
                    value={settings.bank_bca || ''}
                    onChange={(e) => setSettings({ ...settings, bank_bca: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rekening Mandiri</label>
                  <input
                    type="text"
                    value={settings.bank_mandiri || ''}
                    onChange={(e) => setSettings({ ...settings, bank_mandiri: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Simpan Pengaturan Toko
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Admin Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        product={selectedProduct}
        categories={categories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        category={selectedCategory}
      />

      <BannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onSubmit={handleBannerSubmit}
        banner={selectedBanner}
      />

      <PromoModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        onSubmit={handlePromoSubmit}
        promo={selectedPromo}
      />

      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSubmit={handleBlogSubmit}
        blog={selectedBlog}
      />

      <OrderDetailModal
        isOpen={isOrderDetailModalOpen}
        onClose={() => setIsOrderDetailModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};
