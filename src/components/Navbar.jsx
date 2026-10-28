import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  ShoppingBag,
  MessageCircle,
  Home,
  Menu,
  X,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavFilter = (type) => {
    setActiveFilter(type);
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              setActiveFilter('all');
              setMobileMenuOpen(false);
            }}
            className="flex-shrink-0 focus:outline-none"
          >
            <div className="hidden sm:block">
              <BrandLogo size="md" showTagline={true} />
            </div>
            <div className="block sm:hidden">
              <BrandLogo size="sm" showTagline={false} />
            </div>
          </Link>

          {/* Desktop Search Bar */}
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/15 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavFilter('product')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
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
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                location.pathname === '/' && activeFilter === 'service'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>Cari Jasa</span>
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-600 transition shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard Kreator</span>
            </Link>
          </nav>

          {/* Mobile Action Icons (Search Toggle + Menu Toggle) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              aria-label="Cari Katalog"
              className={`rounded-xl p-2.5 transition ${
                mobileSearchOpen || searchQuery
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setMobileSearchOpen(false);
              }}
              aria-label="Buka Menu"
              className="rounded-xl bg-slate-100 p-2.5 text-slate-700 hover:bg-slate-200 transition"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (location.pathname !== '/') navigate('/');
                }}
                placeholder="Cari produk digital atau jasa freelance..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 py-2.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 shadow-xl">
            <button
              type="button"
              onClick={() => handleNavFilter('all')}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Home className="h-4 w-4 text-slate-500" />
              <span>Semua Katalog</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavFilter('product')}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50/60"
            >
              <ShoppingBag className="h-4 w-4 text-indigo-600" />
              <span>Produk Digital (Download Instan)</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavFilter('service')}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50/60"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>Jasa Freelance (1-on-1 WhatsApp)</span>
            </button>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm mt-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Buka Dashboard Kreator</span>
            </Link>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar (App-like Thumb Bar) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 py-1.5 grid grid-cols-4 gap-1 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          onClick={() => handleNavFilter('all')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
            location.pathname === '/' && activeFilter === 'all'
              ? 'text-indigo-600 bg-indigo-50/70'
              : 'text-slate-500'
          }`}
        >
          <Home className="h-4 w-4 mb-0.5" />
          <span>Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavFilter('product')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
            location.pathname === '/' && activeFilter === 'product'
              ? 'text-indigo-600 bg-indigo-50/70'
              : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="h-4 w-4 mb-0.5" />
          <span>Produk</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavFilter('service')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
            location.pathname === '/' && activeFilter === 'service'
              ? 'text-emerald-600 bg-emerald-50/70'
              : 'text-slate-500'
          }`}
        >
          <MessageCircle className="h-4 w-4 mb-0.5" />
          <span>Jasa WA</span>
        </button>

        <Link
          to="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
            location.pathname === '/dashboard'
              ? 'text-indigo-600 bg-indigo-50/70'
              : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 mb-0.5" />
          <span>Dashboard</span>
        </Link>
      </nav>
    </>
  );
}
