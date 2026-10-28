import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Star,
  UserPlus,
  FolderDown,
  Heart,
  Settings,
  LayoutDashboard,
  Code2,
} from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { formatIDR, calculateSplitPayment } from '../lib/utils';

export default function HomePage({
  items,
  profiles,
  currentUser,
  orders = [],
  wishlistIds = [],
  onToggleWishlist,
  searchQuery,
  activeFilter,
  setActiveFilter,
}) {
  const [simPrice, setSimPrice] = useState(500000);
  const [simQty, setSimQty] = useState(10);

  const getCreator = (creatorId) => profiles.find((p) => p.id === creatorId);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeFilter === 'all' || item.item_type === activeFilter;
    return matchesSearch && matchesType;
  });

  const popularProducts = filteredItems.filter((i) => i.item_type === 'product');
  const bestServices = filteredItems.filter((i) => i.item_type === 'service');

  const simSplit = calculateSplitPayment(simPrice * simQty);

  const buyerOrdersCount = orders.filter(
    (o) =>
      o.buyer_id === currentUser?.id ||
      o.buyer_email?.toLowerCase() === currentUser?.email?.toLowerCase()
  ).length;

  return (
    <div className="space-y-10 sm:space-y-14 pb-14">
      {/* 1. HERO SECTION + TRUST BAR */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-indigo-200 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
            <span>Marketplace Kreator Lokal • Proteksi Escrow & Akses File Instan</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight">
            Beli <span className="text-indigo-400">Produk Digital Instan</span> & Sewa{' '}
            <span className="text-emerald-400">Jasa Freelancer 1-on-1</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Unduh source code, UI kit, dan template detik ini juga — atau diskusi 1-on-1 via WhatsApp & booking jasa dengan <strong>Garansi Dana Escrow 100% Aman</strong>.
          </p>

          {/* Filter Pills Katalog */}
          <div className="mt-6 grid grid-cols-1 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`w-full sm:w-auto rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Semua Katalog ({items.length})
            </button>
            <button
              onClick={() => setActiveFilter('product')}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition ${
                activeFilter === 'product'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="h-4 w-4 flex-shrink-0" />
              <span>Produk Digital (Download Instan)</span>
            </button>
            <button
              onClick={() => setActiveFilter('service')}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition ${
                activeFilter === 'service'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageCircle className="h-4 w-4 flex-shrink-0" />
              <span>Jasa Freelance (WA + Escrow)</span>
            </button>
          </div>

          {/* Statistik Kepercayaan Singkat */}
          <div className="mt-8 pt-6 border-t border-slate-800/90 grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto text-center">
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-white">100% Instan</p>
              <p className="text-[11px] sm:text-xs text-slate-400">Auto-Unlock File Produk</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-emerald-400">95% : 5%</p>
              <p className="text-[11px] sm:text-xs text-slate-400">Bagi Hasil Adil Kreator</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-indigo-400">4.9 / 5.0 ★</p>
              <p className="text-[11px] sm:text-xs text-slate-400">Garansi Escrow Aman</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* PANEL PERSONALISASI MENYATU UNTUK USER YANG SUDAH LOGIN */}
        {currentUser && (
          <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/90 via-white to-emerald-50/70 p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="h-12 w-12 rounded-2xl object-cover border border-indigo-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">
                    Halo, {currentUser.full_name}! 👋
                  </span>
                  <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    {currentUser.role === 'admin'
                      ? 'Developer (5%)'
                      : currentUser.role === 'creator'
                      ? 'Kreator (95%)'
                      : 'Pelanggan Aktif'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentUser.role === 'buyer'
                    ? `Jelajahi katalog di bawah atau akses cepat ${buyerOrdersCount} riwayat pembelian & pengaturan akun Anda.`
                    : currentUser.role === 'creator'
                    ? 'Pantau saldo bersih 95% Anda dan kelola produk/jasa di Studio Kreator.'
                    : 'Pantau keuntungan komisi platform 5% dan aktivitas Escrow di Developer Console.'}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-wrap items-center gap-2">
              {currentUser.role === 'buyer' && (
                <>
                  <Link
                    to="/library"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                  >
                    <FolderDown className="h-3.5 w-3.5" />
                    <span>Riwayat & Library ({buyerOrdersCount})</span>
                  </Link>
                  <Link
                    to="/library?tab=wishlist"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Heart className="h-3.5 w-3.5 text-rose-500" />
                    <span>Wishlist ({wishlistIds.length})</span>
                  </Link>
                  <Link
                    to="/library?tab=settings"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-500" />
                    <span>Pengaturan Akun</span>
                  </Link>
                </>
              )}

              {currentUser.role === 'creator' && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Buka Studio Kreator (Dompet 95%)</span>
                </Link>
              )}

              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                >
                  <Code2 className="h-4 w-4" />
                  <span>Buka Developer Console (Komisi 5%)</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 2. LANGSUNG MASUK KE KATALOG UTAMA (PRODUK DIGITAL & JASA FREELANCE) */}
        {(activeFilter === 'all' || activeFilter === 'product') && (
          <section className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
                  <ShoppingBag className="h-4 w-4" /> In-App Instant Checkout
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  Produk Digital Populer
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Bayar via QRIS/VA di web & langsung buka link download file detik itu juga.
              </p>
            </div>

            {popularProducts.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                Tidak ada produk digital yang cocok dengan pencarian Anda.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {popularProducts.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    creator={getCreator(item.creator_id)}
                    isWishlisted={wishlistIds.includes(item.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {(activeFilter === 'all' || activeFilter === 'service') && (
          <section className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  <MessageCircle className="h-4 w-4" /> 1-on-1 WhatsApp Consultation + Escrow Booking
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  Jasa Freelance Terbaik
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Konsultasi gratis di WhatsApp kreator & bayar aman dengan proteksi Escrow Lapak Digi.
              </p>
            </div>

            {bestServices.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                Tidak ada layanan jasa yang cocok dengan pencarian Anda.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {bestServices.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    creator={getCreator(item.creator_id)}
                    isWishlisted={wishlistIds.includes(item.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 3. SEKSI CARA KERJA PLATFORM & PROTEKSI ESCROW */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
              <ShieldCheck className="h-4 w-4" /> Ekosistem Transaksi Aman & Transparan
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
              Bagaimana Lapak Digi Melindungi Pembeli & Kreator?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kami menggabungkan kecepatan unduh produk digital dengan keamanan rekening bersama (Escrow) untuk jasa freelance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm">
                01
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Produk Digital: Bayar & Auto-Unlock File
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Untuk template, source code, dan e-book, pembeli cukup bayar via QRIS/VA. Link download langsung terbuka otomatis 24/7 tanpa menunggu balasan chat kreator.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm">
                02
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Jasa Freelance: Diskusi WA & Booking Escrow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Klien berdiskusi 1-on-1 dengan kreator di WhatsApp, lalu melakukan pembayaran Booking Escrow di web. Dana aman ditahan platform hingga pekerjaan selesai.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2.5">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm">
                03
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Bagi Hasil Adil: 95% Kreator & 5% Platform
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buka lapak 100% gratis tanpa biaya bulanan. Platform hanya memotong komisi layanan 5% saat produk/jasa Anda berhasil terjual!
              </p>
            </div>
          </div>
        </section>

        {/* 4. KALKULATOR SIMULASI PENDAPATAN KREATOR (95% vs 5%) + BANNER PENDAFTARAN */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-300">
                <Calculator className="h-4 w-4" />
                <span>Monetisasi Karya & Keahlian Anda</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Mulai Jualan sebagai Kreator — Terima{' '}
                <span className="text-emerald-400">95% Pendapatan Bersih</span>!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tidak ada biaya pendaftaran atau iuran bulanan. Lapak Digi hanya mengenakan biaya pemeliharaan platform & proteksi pembayaran sebesar <strong>5%</strong> dari setiap transaksi yang berhasil.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar / Masuk Akun Sekarang</span>
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition"
                >
                  <span>Buka Dashboard Sesuai Role Anda</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Kalkulator Interaktif */}
            <div className="lg:col-span-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                Kalkulator Simulasi Pendapatan Kreator
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Harga Produk / Jasa</span>
                    <span className="font-bold text-white">{formatIDR(simPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="2500000"
                    step="50000"
                    value={simPrice}
                    onChange={(e) => setSimPrice(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Target Terjual per Bulan</span>
                    <span className="font-bold text-white">{simQty}x Transaksi</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={simQty}
                    onChange={(e) => setSimQty(Number(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-4 space-y-2 text-xs border border-white/10">
                <div className="flex justify-between text-slate-400">
                  <span>Total Omzet Kotor (100%)</span>
                  <span className="font-semibold text-white">{formatIDR(simSplit.grossAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Komisi Layanan Platform (5%)</span>
                  <span className="font-semibold text-amber-300">
                    - {formatIDR(simSplit.platformFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-emerald-300">Masuk ke Dompet Anda (95%)</span>
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                    {formatIDR(simSplit.creatorNet)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TESTIMONI PENGGUNA & KREATOR LOKAL */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Dipercaya oleh Kreator & Pelaku Usaha Lokal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pengalaman nyata dari pembeli produk digital dan freelancer di ekosistem Lapak Digi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Dimas Anggara',
                role: 'Pembeli & Founder UMKM',
                quote:
                  'Beli boilerplate React jam 11 malam, bayar pakai QRIS langsung kebuka file ZIP-nya detik itu juga tanpa harus nunggu admin balas chat!',
              },
              {
                name: 'Raka Pratama',
                role: 'Full-Stack Creator (@rakadev)',
                quote:
                  'Potongan platformnya cuma 5%, jauh lebih hemat dibanding marketplace luar yang memotong sampai 20%. Klien jasa web juga enak bisa diskusi 1-on-1 di WA.',
              },
              {
                name: 'Nadia Larasati',
                role: 'UI/UX Designer (@nadiadesign)',
                quote:
                  'Fitur Booking Escrow bikin saya tenang saat mengerjakan proyek desain UI/UX bernilai jutaan rupiah karena dana klien sudah dijamin oleh Lapak Digi.',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-extrabold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-indigo-600 font-semibold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
