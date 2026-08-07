import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PromosPage } from './pages/PromosPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { HowToOrderPage } from './pages/HowToOrderPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentUploadPage } from './pages/PaymentUploadPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { InvoicePage } from './pages/InvoicePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { Product, Order } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Selected item states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderData, setSelectedOrderData] = useState<any>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
  };

  const handleOrderCreatedSuccess = (orderData: any) => {
    setSelectedOrderData(orderData);
    setActiveTab('payment-upload');
  };

  const handleSelectOrderForPayment = (order: Order) => {
    setSelectedOrderData(order);
    setActiveTab('payment-upload');
  };

  const handleSelectOrderForInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
    setActiveTab('invoice');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
      />

      {/* Main View Switcher */}
      {isAdminView ? (
        <AdminDashboardPage onExitAdmin={() => setIsAdminView(false)} />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'home' && (
            <HomePage onSelectProduct={handleSelectProduct} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'about' && <AboutPage />}

          {activeTab === 'products' && (
            <ProductsPage
              onSelectProduct={handleSelectProduct}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'product-detail' && selectedProduct && (
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => setActiveTab('products')}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'promos' && <PromosPage setActiveTab={setActiveTab} />}

          {activeTab === 'testimonials' && <TestimonialsPage />}

          {activeTab === 'how-to-order' && <HowToOrderPage />}

          {activeTab === 'faq' && <FaqPage />}

          {activeTab === 'contact' && <ContactPage />}

          {activeTab === 'blog' && <BlogPage />}

          {activeTab === 'privacy' && <PrivacyPolicyPage />}

          {activeTab === 'login' && <LoginPage setActiveTab={setActiveTab} />}

          {activeTab === 'register' && <RegisterPage setActiveTab={setActiveTab} />}

          {activeTab === 'forgot-password' && <ForgotPasswordPage setActiveTab={setActiveTab} />}

          {activeTab === 'profile' && <ProfilePage />}

          {activeTab === 'cart' && <CartPage setActiveTab={setActiveTab} />}

          {activeTab === 'wishlist' && (
            <ProductsPage
              onSelectProduct={handleSelectProduct}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'checkout' && (
            <CheckoutPage
              setActiveTab={setActiveTab}
              onOrderSuccess={handleOrderCreatedSuccess}
            />
          )}

          {activeTab === 'payment-upload' && (
            <PaymentUploadPage
              orderData={selectedOrderData}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'order-history' && (
            <OrderHistoryPage
              setActiveTab={setActiveTab}
              onSelectOrderForPayment={handleSelectOrderForPayment}
              onSelectOrderForInvoice={handleSelectOrderForInvoice}
            />
          )}

          {activeTab === 'invoice' && (
            <InvoicePage
              order={selectedInvoiceOrder}
              onBack={() => setActiveTab('order-history')}
            />
          )}
        </main>
      )}

      {/* Footer */}
      {!isAdminView && <Footer setActiveTab={setActiveTab} />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
