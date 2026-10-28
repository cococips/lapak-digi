import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import HomePage from './pages/HomePage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import DashboardPage from './pages/DashboardPage';
import { INITIAL_ITEMS, INITIAL_PROFILES } from './data/mockData';

export default function App() {
  const [profiles] = useState(INITIAL_PROFILES);
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lapakdigi_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('lapakdigi_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('lapakdigi_orders', JSON.stringify(orders));
  }, [orders]);

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

  const handleIncrementMetric = (itemId) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, sales_or_clicks: (i.sales_or_clicks || 0) + 1 } : i
      )
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
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
              path="/dashboard"
              element={
                <DashboardPage
                  items={items}
                  profiles={profiles}
                  orders={orders}
                  onSaveItem={handleSaveItem}
                  onDeleteItem={handleDeleteItem}
                />
              }
            />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <BrandLogo size="sm" showTagline={false} />
            <p className="text-xs text-slate-500 text-center sm:text-right">
              © {new Date().getFullYear()} <strong>Lapak Digi</strong> — Ekosistem Produk Digital Instan & Jasa Freelance 1-on-1 Kreator Lokal.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
