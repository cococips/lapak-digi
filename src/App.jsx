import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

  const handleRegisterProfile = (newProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setCurrentUser(newProfile);
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
            <Route
              path="/library"
              element={
                <BuyerDashboardPage
                  currentUser={currentUser}
                  orders={orders}
                  items={items}
                  profiles={profiles}
                  onCompleteEscrowOrder={handleCompleteEscrowOrder}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  currentUser={currentUser}
                  items={items}
                  profiles={profiles}
                  orders={orders}
                  payouts={payouts}
                  onSaveItem={handleSaveItem}
                  onDeleteItem={handleDeleteItem}
                  onRequestPayout={handleRequestPayout}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <AdminDashboardPage
                  orders={orders}
                  profiles={profiles}
                  items={items}
                  payouts={payouts}
                  onApprovePayout={handleApprovePayout}
                />
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
