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
  Code2,
  FolderDown,
  LogOut,
  UserPlus,
  LogIn,
  Settings,
  Heart,
  RefreshCw,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  currentUser,
  wishlistCount = 0,
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

  const handleLogoutClick = () => {
    setMobileMenuOpen(false);
    if (onLogout) onLogout();
    navigate('/');
  };

  const roleBadge =
    currentUser?.role === 'admin'
      ? { label: 'Developer (5%)', color: 'bg-amber-100 text-amber-800' }
      : currentUser?.role === 'creator'
      ? { label: 'Kreator (95%)', color: 'bg-emerald-100 text-emerald-800' }
      : { label: 'Pelanggan', color: 'bg-indigo-100 text-indigo-700' };

  // Link dashboard utama sesuai role yang sedang login
  const dashboardPath =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'creator'
      ? '/dashboard'
      : '/library';

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

          {/* Desktop Navigation — Menyesuaikan Status Login & Role */}
          <nav className="hidden md:flex items-center gap-1.5">
            {/* Menu Katalog Umum (Selalu Tampil untuk Tamu & Pelanggan) */}
            <button
              type="button"
              onClick={() => handleNavFilter('product')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                location.pathname === '/' && activeFilter === 'product'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-indigo-600" />
              <span>Produk Digital</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavFilter('service')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                location.pathname === '/' && activeFilter === 'service'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>Jasa Freelance</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            {/* JIKA BELUM LOGIN -> Hanya tampil tombol Masuk & Daftar */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <LogIn className="h-4 w-4 text-indigo-600" />
                  <span>Masuk</span>
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Akun</span>
                </Link>
              </div>
            ) : (
              /* JIKA SUDAH LOGIN -> Tampilkan Menu Spesifik Role Masing-Masing */
              <div className="flex items-center gap-2">
                {currentUser.role === 'buyer' && (
                  <>
                    <Link
                      to="/library?tab=wishlist"
                      className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-rose-600 transition"
                      title="Wishlist Tersimpan"
                    >
                      <Heart className="h-4 w-4" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/library"
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        location.pathname === '/library'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      <FolderDown className="h-4 w-4" />
                      <span>Riwayat & Library Saya</span>
                    </Link>
                  </>
                )}

                {currentUser.role === 'creator' && (
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      location.pathname === '/dashboard'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Studio Kreator (95%)</span>
                  </Link>
                )}

                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      location.pathname === '/admin'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    <Code2 className="h-4 w-4" />
                    <span>Developer Console (5%)</span>
                  </Link>
                )}

                {/* Profil Badge & Tombol Ganti Role / Logout */}
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="max-w-[90px] truncate">{currentUser.full_name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </Link>

                <Link
                  to="/auth"
                  title="Ganti Akun / Role"
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition"
                >
                  <RefreshCw className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  title="Keluar Akun"
                  className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
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
            {currentUser ? (
              <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.full_name}
                    </p>
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="pb-2 mb-2 border-b border-slate-100">
                <p className="text-xs text-slate-500">
                  Silakan masuk atau daftar akun untuk mengakses fitur Pembeli, Studio Kreator, atau Developer.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleNavFilter('all')}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Home className="h-4 w-4 text-slate-500" />
              <span>Beranda & Semua Katalog</span>
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
              <span>Jasa Freelance (WA + Escrow)</span>
            </button>

            {/* Menu Dashboard di Mobile Hanya Muncul Sesuai Role Login */}
            {currentUser?.role === 'buyer' && (
              <Link
                to="/library"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white bg-indigo-600"
              >
                <FolderDown className="h-4 w-4" />
                <span>Riwayat, Library & Pengaturan Saya</span>
              </Link>
            )}

            {currentUser?.role === 'creator' && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white bg-emerald-600"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Buka Studio Kreator (Dompet 95%)</span>
              </Link>
            )}

            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-950 bg-amber-400"
              >
                <Code2 className="h-4 w-4" />
                <span>Buka Developer Console (Komisi 5%)</span>
              </Link>
            )}

            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm mt-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>{currentUser ? 'Ganti Role / Pindah Akun' : 'Masuk / Daftar Akun'}</span>
            </Link>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar (Adaptif Sesuai Status Login & Role) */}
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

        {/* Tab ke-4: Menyesuaikan Status Login & Role */}
        {!currentUser ? (
          <Link
            to="/auth"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
              location.pathname === '/auth' ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-500'
            }`}
          >
            <LogIn className="h-4 w-4 mb-0.5" />
            <span>Masuk</span>
          </Link>
        ) : currentUser.role === 'creator' ? (
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
              location.pathname === '/dashboard'
                ? 'text-emerald-600 bg-emerald-50/70'
                : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mb-0.5" />
            <span>Studio 95%</span>
          </Link>
        ) : currentUser.role === 'admin' ? (
          <Link
            to="/admin"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
              location.pathname === '/admin' ? 'text-amber-700 bg-amber-50' : 'text-slate-500'
            }`}
          >
            <Code2 className="h-4 w-4 mb-0.5" />
            <span>Dev 5%</span>
          </Link>
        ) : (
          <Link
            to="/library"
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold transition ${
              location.pathname === '/library'
                ? 'text-indigo-600 bg-indigo-50/70'
                : 'text-slate-500'
            }`}
          >
            <FolderDown className="h-4 w-4 mb-0.5" />
            <span>Akun Saya</span>
          </Link>
        )}
      </nav>
    </>
  );
}
