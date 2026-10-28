import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Download,
  MessageCircle,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  Heart,
  Settings,
  Save,
  Sparkles,
  FolderDown,
} from 'lucide-react';
import { formatIDR, generateServiceWhatsAppUrl } from '../lib/utils';
import ItemCard from '../components/ItemCard';

export default function BuyerDashboardPage({
  currentUser,
  orders,
  items,
  profiles,
  wishlistIds = [],
  onToggleWishlist,
  onCompleteEscrowOrder,
  onUpdateProfile,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = searchParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab);

  // State Pengaturan Profil Pelanggan
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp_number || '');
  const [location, setLocation] = useState(currentUser?.location || 'Indonesia');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
      setWhatsapp(currentUser.whatsapp_number || '');
      setLocation(currentUser.location || 'Indonesia');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const myOrders = orders.filter(
    (o) =>
      o.buyer_id === currentUser?.id ||
      o.buyer_email?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const productOrders = myOrders.filter((o) => o.item_type === 'product');
  const serviceOrders = myOrders.filter((o) => o.item_type === 'service');
  const wishlistedItems = items.filter((i) => wishlistIds.includes(i.id));

  const displayedOrders =
    activeTab === 'product'
      ? productOrders
      : activeTab === 'service'
      ? serviceOrders
      : myOrders;

  const getCreator = (creatorId) => profiles.find((p) => p.id === creatorId);
  const getItem = (itemId) => items.find((i) => i.id === itemId);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!currentUser || !onUpdateProfile) return;
    onUpdateProfile({
      ...currentUser,
      full_name: fullName,
      email,
      whatsapp_number: whatsapp,
      location,
      bio,
    });
    setSavedNotice('Pengaturan profil pelanggan berhasil disimpan!');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleUpgradeToCreator = () => {
    if (!currentUser || !onUpdateProfile) return;
    onUpdateProfile({
      ...currentUser,
      role: 'creator',
      headline: 'Kreator Digital & Freelancer Lokal',
      bank_info: 'BCA • Rekening Kreator',
    });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header Akun Pelanggan */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar_url}
            alt={currentUser?.full_name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-400/40"
          />
          <div>
            <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-0.5 text-[11px] font-bold text-indigo-300">
              Pusat Akun Pelanggan
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
              Halo, {currentUser?.full_name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Kelola riwayat unduhan file digital, status garansi jasa Escrow, wishlist, dan pengaturan profil Anda.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-indigo-50 transition"
        >
          <ShoppingBag className="h-4 w-4 text-indigo-600" />
          <span>Lanjut Belanja di Katalog</span>
        </Link>
      </div>

      {/* Ringkasan Cepat Pelanggan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500">Produk Digital Dimiliki</span>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-1">
            {productOrders.length} File
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500">Booking Jasa Escrow</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
            {serviceOrders.length} Proyek
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500">Wishlist Tersimpan</span>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-500 mt-1">
            {wishlistedItems.length} Item
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500">Garansi Pembeli</span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>100% Escrow Aktif</span>
          </p>
        </div>
      </div>

      {/* Navigasi Tab Internal Pelanggan */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        <button
          onClick={() => handleTabChange('all')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderDown className="h-4 w-4" />
          <span>Semua Riwayat ({myOrders.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('product')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'product'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="h-4 w-4" />
          <span>File Produk Digital ({productOrders.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('service')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'service'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Pesanan Jasa Escrow ({serviceOrders.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('wishlist')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'wishlist'
              ? 'bg-rose-500 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="h-4 w-4" />
          <span>Wishlist ({wishlistedItems.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Pengaturan Akun</span>
        </button>
      </div>

      {/* KONTEN TAB 1-3: RIWAYAT PESANAN & LIBRARY */}
      {(activeTab === 'all' || activeTab === 'product' || activeTab === 'service') && (
        <>
          {displayedOrders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
              <p className="text-base font-bold text-slate-800">
                Belum ada riwayat transaksi di kategori ini
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white"
              >
                Jelajahi Katalog Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedOrders.map((ord) => {
                const creator = getCreator(ord.creator_id);
                const item = getItem(ord.item_id);
                const isProd = ord.item_type === 'product';
                const isEscrowDone = ord.escrow_status === 'completed';

                const handleFollowUpWA = () => {
                  if (!creator) return;
                  const waUrl = generateServiceWhatsAppUrl({
                    creatorPhone: creator.whatsapp_number,
                    creatorName: creator.full_name,
                    serviceTitle: ord.item_title,
                    servicePrice: ord.amount,
                    clientName: ord.buyer_name,
                    deadline: ord.deadline,
                    projectBrief: ord.project_brief,
                    bookingCode: ord.invoice_number,
                  });
                  window.open(waUrl, '_blank', 'noopener,noreferrer');
                };

                return (
                  <div
                    key={ord.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {item?.thumbnail_url && (
                        <img
                          src={item.thumbnail_url}
                          alt={ord.item_title}
                          className="h-16 w-20 sm:h-20 sm:w-24 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                        />
                      )}
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-indigo-600">
                            #{ord.invoice_number}
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              isProd
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isProd ? 'Produk Digital Instan' : 'Booking Jasa Escrow'}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {formatIDR(ord.amount)} ({ord.payment_method})
                          </span>
                        </div>

                        <Link
                          to={`/item/${ord.item_id}`}
                          className="text-base font-extrabold text-slate-900 hover:text-indigo-600 block truncate"
                        >
                          {ord.item_title}
                        </Link>

                        <p className="text-xs text-slate-500">
                          Kreator: <strong>{creator?.full_name || 'Kreator Lapak Digi'}</strong>
                        </p>

                        {!isProd && ord.project_brief && (
                          <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-600">
                            <span className="font-bold text-slate-800">Brief Proyek: </span>
                            {ord.project_brief} ({ord.deadline || 'Fleksibel'})
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
                      {isProd ? (
                        <a
                          href={ord.download_url || item?.download_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download File Produk</span>
                        </a>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleFollowUpWA}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Chat 1-on-1 WA Kreator</span>
                          </button>

                          {!isEscrowDone ? (
                            <button
                              type="button"
                              onClick={() =>
                                onCompleteEscrowOrder && onCompleteEscrowOrder(ord.id)
                              }
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Konfirmasi Jasa Selesai</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" /> Proyek Selesai
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* KONTEN TAB 4: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
              <p className="text-base font-bold text-slate-800">
                Belum ada produk atau jasa di Wishlist Anda
              </p>
              <p className="text-xs text-slate-500">
                Klik ikon hati (❤️) pada kartu produk/jasa di katalog untuk menyimpannya di sini.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white"
              >
                Cari Produk & Jasa
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {wishlistedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  creator={getCreator(item.creator_id)}
                  isWishlisted={true}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* KONTEN TAB 5: PENGATURAN AKUN PELANGGAN + UPGRADE JADI KREATOR */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              Pengaturan Profil & Kontak Pelanggan
            </h2>

            {savedNotice && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-700">
                {savedNotice}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Email Penerima File
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Kota / Domisili
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Bio Singkat
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-base sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Pengaturan Profil</span>
              </button>
            </form>
          </div>

          {/* Kartu Upgrade Menjadi Kreator */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> Buka Toko Kreator Gratis
              </span>
              <h3 className="text-xl font-extrabold">
                Ingin Ikut Menjual Produk Digital atau Jasa Freelance?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aktifkan mode <strong>Studio Kreator</strong> pada akun Anda. Nikmati bagi hasil{' '}
                <strong>95% untuk Kreator</strong> dan hanya 5% biaya platform saat item Anda laku terjual!
              </p>
            </div>

            <button
              type="button"
              onClick={handleUpgradeToCreator}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-xs sm:text-sm font-extrabold text-slate-950 hover:bg-emerald-400 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Upgrade Akun Saya Menjadi Kreator Sekarang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
