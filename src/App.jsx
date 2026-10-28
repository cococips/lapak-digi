import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import HomePage from './pages/HomePage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import DashboardPage from './pages/DashboardPage';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthPage from './pages/AuthPage';
import { INITIAL_ITEMS, INITIAL_PROFILES, INITIAL_ORDERS } from './data/mockData';

// Guard Komponen: Wajib Login & Sesuai Role untuk Membuka Dashboard
function RoleProtectedRoute({ currentUser, allowedRole, children }) {
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  if (allowedRole && currentUser.role !== allowedRole) {
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    if (currentUser.role === 'creator') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/library" replace />;
  }
  return children;
}

export default function App() {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_profiles_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_current_user_v3');
    return saved ? JSON.parse(saved) : null;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_items_v3');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_orders_v3');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [payouts, setPayouts] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_payouts_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_wishlist_v3');
    return saved ? JSON.parse(saved) : ['item-1'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('lapakdigi_profiles_v3', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lapakdigi_current_user_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lapakdigi_current_user_v3');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lapakdigi_items_v3', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('lapakdigi_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lapakdigi_payouts_v3', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem('lapakdigi_wishlist_v3', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const handleRegisterProfile = (newProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setCurrentUser(newProfile);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    setCurrentUser(updatedProfile);
  };

  const handleToggleWishlist = (itemId) => {
    setWishlistIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSaveItem = (newItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === newItem.id);
      return exists ? prev.map((i) => (i.id === newItem.id ? newItem : i)) : [newItem, ...prev];
    });
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleRecordOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleCompleteEscrowOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, escrow_status: 'completed' } : o))
    );
  };

  const handleRequestPayout = (payoutObj) => {
    setPayouts((prev) => [payoutObj, ...prev]);
  };

  const handleApprovePayout = (payoutId) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'completed' } : p))
    );
  };

  const handleIncrementMetric = (itemId) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, sales_or_clicks: (i.sales_or_clicks || 0) + 1 } : i
      )
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-0">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          currentUser={currentUser}
          wishlistCount={wishlistIds.length}
          onLogout={() => setCurrentUser(null)}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  items={items}
                  profiles={profiles}
                  currentUser={currentUser}
                  orders={orders}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  searchQuery={searchQuery}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                />
              }
            />
            <Route
              path="/item/:id"
              element={
                <ItemDetailPage
                  items={items}
                  profiles={profiles}
                  currentUser={currentUser}
                  onRecordOrder={handleRecordOrder}
                  onIncrementMetric={handleIncrementMetric}
                />
              }
            />
            <Route
              path="/creator/:username"
              element={<CreatorProfilePage items={items} profiles={profiles} />}
            />
            <Route
              path="/auth"
              element={
                <AuthPage
                  profiles={profiles}
                  currentUser={currentUser}
                  onLogin={(user) => setCurrentUser(user)}
                  onRegisterProfile={handleRegisterProfile}
                />
              }
            />

            {/* 1. Rute Khusus Pelanggan / Customer (Wajib Login sebagai Buyer) */}
            <Route
              path="/library"
              element={
                <RoleProtectedRoute currentUser={currentUser} allowedRole="buyer">
                  <BuyerDashboardPage
                    currentUser={currentUser}
                    orders={orders}
                    items={items}
                    profiles={profiles}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onCompleteEscrowOrder={handleCompleteEscrowOrder}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </RoleProtectedRoute>
              }
            />

            {/* 2. Rute Khusus Kreator / Penjual (Wajib Login sebagai Creator) */}
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute currentUser={currentUser} allowedRole="creator">
                  <DashboardPage
                    currentUser={currentUser}
                    items={items}
                    profiles={profiles}
                    orders={orders}
                    payouts={payouts}
                    onSaveItem={handleSaveItem}
                    onDeleteItem={handleDeleteItem}
                    onRequestPayout={handleRequestPayout}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </RoleProtectedRoute>
              }
            />

            {/* 3. Rute Khusus Developer / Pemilik Platform (Wajib Login sebagai Admin) */}
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute currentUser={currentUser} allowedRole="admin">
                  <AdminDashboardPage
                    orders={orders}
                    profiles={profiles}
                    items={items}
                    payouts={payouts}
                    onApprovePayout={handleApprovePayout}
                    onDeleteItem={handleDeleteItem}
                  />
                </RoleProtectedRoute>
              }
            />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <BrandLogo size="sm" showTagline={false} />
            <p className="text-xs text-slate-500 text-center sm:text-right">
              © {new Date().getFullYear()} <strong>Lapak Digi</strong> — Ekosistem Produk Digital Instan, Jasa Escrow & Bagi Hasil 95% Kreator : 5% Platform.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
