import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, ShoppingBag, MessageCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavFilter = (type) => {
    setActiveFilter(type);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo Profesional */}
        <Link
          to="/"
          onClick={() => setActiveFilter('all')}
          className="flex-shrink-0 focus:outline-none"
        >
          <BrandLogo size="md" showTagline={true} />
        </Link>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (location.pathname !== '/') navigate('/');
            }}
            placeholder="Cari template React, UI Kit, atau jasa web developer..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/15 transition"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => handleNavFilter('product')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition ${
              location.pathname === '/' && activeFilter === 'product'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4 text-indigo-600" />
            <span>Jelajahi Produk</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavFilter('service')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition ${
              location.pathname === '/' && activeFilter === 'service'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            <span>Cari Jasa</span>
          </button>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-indigo-600 transition shadow-sm"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard Kreator</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
