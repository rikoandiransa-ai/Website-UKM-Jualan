import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileStatusBar } from './components/common/MobileStatusBar';
import { BottomNav } from './components/common/BottomNav';
import { PhoneFrameControls } from './components/common/PhoneFrameControls';

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

  // Mobile Phone Simulation States
  const [isFrameActive, setIsFrameActive] = useState<boolean>(false);
  const [phoneModel, setPhoneModel] = useState<string>('iPhone 15 Pro');
  const [caseColor, setCaseColor] = useState<string>('titanium');

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

  // Case color gradient generator
  const getCaseColorClass = () => {
    switch (caseColor) {
      case 'black':
        return 'bg-gradient-to-b from-slate-800 via-slate-900 to-black border-slate-700 shadow-slate-950/80';
      case 'emerald':
        return 'bg-gradient-to-b from-emerald-800 via-emerald-950 to-slate-950 border-emerald-700 shadow-emerald-950/80';
      case 'gold':
        return 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 border-amber-300 shadow-amber-950/80';
      case 'titanium':
      default:
        return 'bg-gradient-to-b from-slate-400 via-slate-500 to-slate-700 border-slate-300 shadow-slate-900/60';
    }
  };

  return (
    <div className={`min-h-screen font-sans text-slate-800 antialiased flex flex-col selection:bg-emerald-500 selection:text-white ${isFrameActive ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Simulation Controls Header */}
      <PhoneFrameControls
        isFrameActive={isFrameActive}
        setIsFrameActive={setIsFrameActive}
        phoneModel={phoneModel}
        setPhoneModel={setPhoneModel}
        caseColor={caseColor}
        setCaseColor={setCaseColor}
      />

      {/* Main Container Wrapper */}
      <div className={`flex-1 flex items-center justify-center ${isFrameActive ? 'py-6 px-2 sm:px-4' : 'w-full'}`}>
        <div
          className={`w-full transition-all duration-300 relative ${
            isFrameActive
              ? `max-w-[430px] rounded-[52px] p-[10px] border-[4px] shadow-2xl relative ${getCaseColorClass()}`
              : 'max-w-full min-h-screen bg-slate-50'
          }`}
        >
          {/* Side Phone Hardware Buttons (When frame is active) */}
          {isFrameActive && (
            <>
              {/* Volume Buttons */}
              <div className="absolute -left-[7px] top-28 w-[5px] h-12 bg-slate-600 rounded-l-md border-r border-slate-800"></div>
              <div className="absolute -left-[7px] top-44 w-[5px] h-12 bg-slate-600 rounded-l-md border-r border-slate-800"></div>
              {/* Power Button */}
              <div className="absolute -right-[7px] top-36 w-[5px] h-16 bg-slate-600 rounded-r-md border-l border-slate-800"></div>
            </>
          )}

          {/* Screen Display Box */}
          <div
            className={`w-full bg-slate-50 flex flex-col relative ${
              isFrameActive
                ? 'rounded-[44px] h-[830px] shadow-inner border border-slate-900/50 overflow-hidden'
                : 'min-h-screen'
            }`}
          >
            {/* Mobile Status Bar (Rendered ONLY in Mobile Simulator Mode) */}
            {isFrameActive && <MobileStatusBar deviceModel={phoneModel} />}

            {/* Application Sticky Header Navbar */}
            <Navbar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                const screenContainer = document.getElementById('mobile-screen-body');
                if (screenContainer) screenContainer.scrollTop = 0;
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isAdminView={isAdminView}
              setIsAdminView={setIsAdminView}
            />

            {/* Scrollable Main App Body View */}
            <div
              id="mobile-screen-body"
              className={`flex-1 scroll-smooth ${
                isFrameActive
                  ? 'overflow-y-auto px-3 sm:px-4 pt-3 pb-24'
                  : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-20'
              }`}
            >
              {isAdminView ? (
                <AdminDashboardPage onExitAdmin={() => setIsAdminView(false)} />
              ) : (
                <main className="w-full mx-auto">
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

                  {activeTab === 'forgot-password' && (
                    <ForgotPasswordPage setActiveTab={setActiveTab} />
                  )}

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

              {/* App Footer */}
              {!isAdminView && (
                <div className="mt-12 pt-6 border-t border-slate-200">
                  <Footer setActiveTab={setActiveTab} />
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar (Hidden on Laptop/Desktop) */}
            <div className={isFrameActive ? 'block' : 'lg:hidden'}>
              <BottomNav
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  const screenContainer = document.getElementById('mobile-screen-body');
                  if (screenContainer) screenContainer.scrollTop = 0;
                  else window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isAdminView={isAdminView}
                setIsAdminView={setIsAdminView}
              />
            </div>
          </div>
        </div>
      </div>
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
