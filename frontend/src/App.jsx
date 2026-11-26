import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Scroll to top on every route and search navigation
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.body) {
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, search]);

  return null;
}

// Storefront Components
import Header from './components/storefront/Header';
import Footer from './components/storefront/Footer';
import CategoryDrawer from './components/storefront/CategoryDrawer';
import MobileBottomNav from './components/storefront/MobileBottomNav';
import AppSplashScreen from './components/common/AppSplashScreen';

// Storefront Pages
import HomePage from './pages/storefront/HomePage';
import CatalogPage from './pages/storefront/CatalogPage';
import ProductDetailPage from './pages/storefront/ProductDetailPage';
import CartPage from './pages/storefront/CartPage';
import CheckoutPage from './pages/storefront/CheckoutPage';
import WishlistPage from './pages/storefront/WishlistPage';
import ComparePage from './pages/storefront/ComparePage';
import AccountPage from './pages/storefront/AccountPage';
import DeliveryPage from './pages/storefront/DeliveryPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Sahifa o'zgarganda (boshqa panelga yoki mahsulotga o'tganda) katalogni avtomatik yopish
  useEffect(() => {
    setCatalogOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-clip bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <AppSplashScreen />
      <ScrollToTop />
      {!isAdminRoute && (
        <Header
          onToggleCatalog={() => setCatalogOpen((prev) => !prev)}
          isCatalogOpen={catalogOpen}
        />
      )}
      <CategoryDrawer isOpen={catalogOpen} onClose={() => setCatalogOpen(false)} />

      <main className="flex-1 w-full max-w-full min-w-0 bg-white dark:bg-black transition-colors duration-200 pb-16 md:pb-0">
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CatalogPage />} />
          <Route path="/shop/:categorySlug" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/about" element={<DeliveryPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback for Mini App / unexpected paths */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && (
        <MobileBottomNav
          onToggleCatalog={() => setCatalogOpen((prev) => !prev)}
          onCloseCatalog={() => setCatalogOpen(false)}
          isCatalogOpen={catalogOpen}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <AppContent />
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}
