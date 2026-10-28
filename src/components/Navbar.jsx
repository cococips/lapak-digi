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
  UserCheck,
  Code2,
  FolderDown,
  LogOut,
  UserPlus,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  currentUser,
  onLogout,
}) {
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

  const roleBadgeLabel =
    currentUser?.role === 'admin'
      ? 'Developer (5%)'
      : currentUser?.role === 'creator'
      ? 'Kreator (95%)'
      : 'Pembeli';

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
          <div className="relative flex-1 max-w-xs lg:max-w-md hidden md:block">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== '/') navigate('/');
              }}
              placeholder="Cari produk digital atau jasa freelance..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 py-2 text-xs lg:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/15 transition"
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

          {/* Desktop Navigation Links (3 Role Ecosystem + Auth) */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/library"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                location.pathname === '/library'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Halaman Pembeli / Customer"
            >
              <FolderDown className="h-4 w-4 text-indigo-600" />
              <span>Library Pembeli</span>
            </Link>

            <Link
              to="/dashboard"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                location.pathname === '/dashboard'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Halaman Studio Kreator (95%)"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-600" />
              <span>Studio Kreator</span>
            </Link>

            <Link
              to="/admin"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                location.pathname === '/admin'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Halaman Developer Platform (Komisi 5%)"
            >
              <Code2 className="h-4 w-4 text-amber-600" />
              <span>Developer (5%)</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                  title="Klik untuk ganti Role / Akun"
                >
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="max-w-[90px] truncate">{currentUser.full_name}</span>
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-700">
                    {roleBadgeLabel}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar Akun"
                  className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                <span>Masuk / Daftar</span>
              </Link>
            )}
          </nav>

          {/* Mobile Action Icons */}
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
            <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navigasi 3 Role Ekosistem
              </span>
              {currentUser && (
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  Aktif: {currentUser.full_name} ({roleBadgeLabel})
                </span>
              )}
            </div>

            <Link
              to="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50/60"
            >
              <FolderDown className="h-4 w-4 text-indigo-600" />
              <span>1. Halaman Pembeli (Library & Escrow)</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50/60"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-600" />
              <span>2. Studio Kreator (Dompet 95% & Katalog)</span>
            </Link>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-amber-800 bg-amber-50/80"
            >
              <Code2 className="h-4 w-4 text-amber-600" />
              <span>3. Developer Platform (Komisi 5%)</span>
            </Link>

            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm mt-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>{currentUser ? 'Ganti Role / Akun' : 'Masuk / Daftar Akun'}</span>
            </Link>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar (5 Tab Lengkap) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-1.5 py-1.5 grid grid-cols-5 gap-1 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
            location.pathname === '/' ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500'
          }`}
        >
          <Home className="h-4 w-4 mb-0.5" />
          <span>Katalog</span>
        </Link>

        <Link
          to="/library"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
            location.pathname === '/library' ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500'
          }`}
        >
          <FolderDown className="h-4 w-4 mb-0.5" />
          <span>Pembeli</span>
        </Link>

        <Link
          to="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
            location.pathname === '/dashboard'
              ? 'text-emerald-600 bg-emerald-50/70'
              : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 mb-0.5" />
          <span>Kreator</span>
        </Link>

        <Link
          to="/admin"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
            location.pathname === '/admin' ? 'text-amber-700 bg-amber-50' : 'text-slate-500'
          }`}
        >
          <Code2 className="h-4 w-4 mb-0.5" />
          <span>Dev 5%</span>
        </Link>

        <Link
          to="/auth"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
            location.pathname === '/auth' ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500'
          }`}
        >
          <UserCheck className="h-4 w-4 mb-0.5" />
          <span>Akun</span>
        </Link>
      </nav>
    </>
  );
}
