import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit3,
  ShoppingBag,
  MessageCircle,
  ExternalLink,
  Wallet,
  CheckCircle2,
  LayoutGrid,
  ClipboardList,
  Settings,
  Save,
  Share2,
} from 'lucide-react';
import { formatIDR, calculateSplitPayment, sanitizeWhatsAppNumber } from '../lib/utils';

export default function DashboardPage({
  currentUser,
  items,
  profiles,
  orders,
  payouts = [],
  onSaveItem,
  onDeleteItem,
  onRequestPayout,
  onUpdateProfile,
}) {
  const creatorProfiles = profiles.filter((p) => p.role === 'creator');
  const activeCreator =
    currentUser?.role === 'creator'
      ? currentUser
      : creatorProfiles[0] || profiles[0];

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'catalog' | 'orders' | 'settings'
  const [editingItem, setEditingItem] = useState(null);
  const [payoutNotice, setPayoutNotice] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // State Pengaturan Toko & Rekening Kreator
  const [fullName, setFullName] = useState(activeCreator?.full_name || '');
  const [headline, setHeadline] = useState(activeCreator?.headline || '');
  const [whatsapp, setWhatsapp] = useState(activeCreator?.whatsapp_number || '');
  const [bankInfo, setBankInfo] = useState(activeCreator?.bank_info || '');
  const [bio, setBio] = useState(activeCreator?.bio || '');

  useEffect(() => {
    if (activeCreator) {
      setFullName(activeCreator.full_name || '');
      setHeadline(activeCreator.headline || '');
      setWhatsapp(activeCreator.whatsapp_number || '');
      setBankInfo(activeCreator.bank_info || 'BCA • 8820192831');
      setBio(activeCreator.bio || '');
    }
  }, [activeCreator]);

  const emptyForm = {
    title: '',
    description: '',
    price: 150000,
    item_type: 'product',
    category: 'Source Code',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    featuresText: 'Full Source Code\nDokumentasi Lengkap\nGratis Update',
    demo_url: 'https://example.com/demo',
    download_url: 'https://example.com/download/package.zip',
    file_info: 'ZIP Archive • 15 MB',
    delivery_time: '3 - 5 Hari Kerja',
    revision_limit: '3x Revisi',
  };

  const [form, setForm] = useState(emptyForm);

  const creatorItems = items.filter((i) => i.creator_id === activeCreator?.id);
  const creatorOrders = orders.filter((o) => o.creator_id === activeCreator?.id);
  const creatorPayouts = payouts.filter((p) => p.creator_id === activeCreator?.id);

  const grossSales = creatorOrders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
  const totalFeeDeducted = creatorOrders.reduce(
    (acc, o) => acc + (Number(o.platform_fee) || 0),
    0
  );
  const netEarnings = creatorOrders.reduce((acc, o) => acc + (Number(o.creator_net) || 0), 0);
  const withdrawnAmount = creatorPayouts.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const availableBalance = Math.max(0, netEarnings - withdrawnAmount);

  const previewSplit = calculateSplitPayment(form.price);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setForm({
      ...item,
      featuresText: (item.features || []).join('\n'),
    });
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      creator_id: activeCreator.id,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      item_type: form.item_type,
      category: form.category,
      thumbnail_url: form.thumbnail_url,
      features: form.featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      demo_url: form.item_type === 'product' ? form.demo_url : '',
      download_url: form.item_type === 'product' ? form.download_url : '',
      file_info: form.item_type === 'product' ? form.file_info : '',
      delivery_time: form.item_type === 'service' ? form.delivery_time : '',
      revision_limit: form.item_type === 'service' ? form.revision_limit : '',
      sales_or_clicks: editingItem ? editingItem.sales_or_clicks : 0,
      created_at: editingItem ? editingItem.created_at : new Date().toISOString(),
    };

    onSaveItem(payload);
    setEditingItem(null);
    setForm(emptyForm);
    setPayoutNotice('Katalog produk/jasa berhasil disimpan dan diterbitkan!');
    setTimeout(() => setPayoutNotice(''), 3000);
  };

  const handleWithdraw = () => {
    if (availableBalance <= 0) return;
    if (onRequestPayout && activeCreator) {
      onRequestPayout({
        id: `pay-${Date.now()}`,
        creator_id: activeCreator.id,
        creator_name: activeCreator.full_name,
        bank_info: bankInfo || activeCreator.bank_info || 'BCA • Rekening Kreator',
        amount: availableBalance,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      setPayoutNotice(
        `Permintaan penarikan saldo bersih 95% sebesar ${formatIDR(
          availableBalance
        )} telah dikirim ke Developer Platform!`
      );
      setTimeout(() => setPayoutNotice(''), 4000);
    }
  };

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    if (!activeCreator || !onUpdateProfile) return;
    onUpdateProfile({
      ...activeCreator,
      full_name: fullName,
      headline,
      whatsapp_number: sanitizeWhatsAppNumber(whatsapp),
      bank_info: bankInfo,
      bio,
    });
    setPayoutNotice('Pengaturan toko & nomor rekening pencairan berhasil diperbarui!');
    setTimeout(() => setPayoutNotice(''), 3000);
  };

  const handleCopyStoreLink = () => {
    const url = `${window.location.origin}/creator/${activeCreator?.username}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Studio Kreator */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={activeCreator?.avatar_url}
            alt={activeCreator?.full_name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-400/50"
          />
          <div>
            <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-0.5 text-[11px] font-bold text-emerald-300">
              Studio Kreator • Bagi Hasil 95% Bersih
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
              {activeCreator?.full_name} (@{activeCreator?.username})
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">{activeCreator?.headline}</p>
          </div>
        </div>

        <div className="w-full lg:w-auto flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyStoreLink}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
          >
            <Share2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Lapak'}</span>
          </button>

          {activeCreator && (
            <Link
              to={`/creator/${activeCreator.username}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              <span>Lihat Lapak Publik</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {payoutNotice && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{payoutNotice}</span>
        </div>
      )}

      {/* Navigasi 4 Tab Internal Studio Kreator */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="h-4 w-4" />
          <span>1. Dompet 95% & Ringkasan</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'catalog'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>2. Kelola Katalog ({creatorItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>3. Pesanan & Klien Masuk ({creatorOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>4. Pengaturan Toko & Rekening</span>
        </button>
      </div>

      {/* === TAB 1: DOMPET 95% & RINGKASAN === */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800">
                  SALDO BERSIH SIAP TARIK (95%)
                </span>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {formatIDR(availableBalance)}
                </p>
                <p className="text-[11px] text-emerald-700/80 mt-0.5 truncate">
                  {bankInfo || activeCreator?.bank_info}
                </p>
              </div>

              <button
                type="button"
                disabled={availableBalance <= 0}
                onClick={handleWithdraw}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 transition shadow-sm"
              >
                <Wallet className="h-4 w-4" />
                <span>Tarik Saldo ke Rekening</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-xs font-semibold text-slate-500">
                Total Penjualan Kotor (100%)
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatIDR(grossSales)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Dari {creatorOrders.length} transaksi sukses
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-xs font-semibold text-slate-500">
                Potongan Komisi Platform (5%)
              </span>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">
                - {formatIDR(totalFeeDeducted)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Biaya layanan & proteksi Escrow 5%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-xs font-semibold text-slate-500">Total Karya & Jasa Aktif</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                {creatorItems.length} Katalog
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Produk / Jasa Baru
              </button>
            </div>
          </div>

          {/* Riwayat Penarikan Saldo (Payouts) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Riwayat Penarikan Dana (Withdraw 95%)
            </h2>
            {creatorPayouts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">
                Belum ada riwayat penarikan saldo. Klik tombol <strong>Tarik Saldo ke Rekening</strong> di atas untuk mencairkan pendapatan bersih Anda.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {creatorPayouts.map((pay) => (
                  <div
                    key={pay.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{formatIDR(pay.amount)}</span>
                      <p className="text-slate-500">Tujuan: {pay.bank_info}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 font-bold ${
                        pay.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {pay.status === 'completed'
                        ? 'Sudah Ditransfer oleh Admin'
                        : 'Menunggu Verifikasi Admin'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === TAB 2: KELOLA KATALOG PRODUK & JASA === */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {editingItem ? 'Edit Item Katalog' : 'Tambah Produk / Jasa Baru'}
                </h2>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setForm(emptyForm);
                    }}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Pilih Jenis Penawaran
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, item_type: 'product' })}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-bold transition ${
                      form.item_type === 'product'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                    <div className="text-left">
                      <div>Produk Digital</div>
                      <div className="text-[10px] font-normal opacity-80">
                        Checkout & Download Instan
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, item_type: 'service' })}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-bold transition ${
                      form.item_type === 'service'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 flex-shrink-0" />
                    <div className="text-left">
                      <div>Jasa Freelance</div>
                      <div className="text-[10px] font-normal opacity-80">
                        WA 1-on-1 + Booking Escrow
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Judul Produk / Jasa
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Template SaaS Next.js / Jasa Buat Website"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Harga Jual (IDR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Source Code / Web Dev"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* Kalkulasi Otomatis 95% vs 5% */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Potongan Komisi Platform (5%):</span>
                  <span className="font-semibold text-rose-600">
                    - {formatIDR(previewSplit.platformFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>Pendapatan Bersih Anda (95%):</span>
                  <span className="text-emerald-600">{formatIDR(previewSplit.creatorNet)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  URL Gambar Thumbnail
                </label>
                <input
                  type="url"
                  required
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                />
              </div>

              {form.item_type === 'product' ? (
                <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-3.5 space-y-3">
                  <p className="text-xs font-bold text-indigo-800">
                    Pengaturan File Produk Digital (Auto-Unlock)
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      URL File Download
                    </label>
                    <input
                      type="url"
                      required
                      value={form.download_url}
                      onChange={(e) => setForm({ ...form, download_url: e.target.value })}
                      className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-base sm:text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Format & Ukuran File
                      </label>
                      <input
                        type="text"
                        value={form.file_info}
                        onChange={(e) => setForm({ ...form, file_info: e.target.value })}
                        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-base sm:text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        URL Live Demo
                      </label>
                      <input
                        type="url"
                        value={form.demo_url}
                        onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-base sm:text-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3.5 space-y-3">
                  <p className="text-xs font-bold text-emerald-800">
                    Pengaturan Layanan Jasa Freelance
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Estimasi Pengerjaan
                      </label>
                      <input
                        type="text"
                        value={form.delivery_time}
                        onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base sm:text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Batas Revisi
                      </label>
                      <input
                        type="text"
                        value={form.revision_limit}
                        onChange={(e) => setForm({ ...form, revision_limit: e.target.value })}
                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base sm:text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-base sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Fitur / Deliverables (1 baris per poin)
                </label>
                <textarea
                  rows={3}
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-md"
              >
                <Plus className="h-4 w-4" />
                {editingItem ? 'Simpan Perubahan' : 'Terbitkan ke Katalog'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Daftar Katalog Anda ({creatorItems.length})
              </h2>

              <div className="divide-y divide-slate-100">
                {creatorItems.map((item) => {
                  const isProd = item.item_type === 'product';
                  const split = calculateSplitPayment(item.price);
                  return (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="h-14 w-16 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                isProd
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {isProd ? 'Produk Instan' : 'Jasa (WA + Escrow)'}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {formatIDR(item.price)}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600">
                              (Bersih 95%: {formatIDR(split.creatorNet)})
                            </span>
                          </div>
                          <Link
                            to={`/item/${item.id}`}
                            className="font-bold text-sm text-slate-900 hover:text-indigo-600 line-clamp-1 block mt-0.5"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-slate-400">
                            {item.sales_or_clicks || 0}x konversi
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TAB 3: PESANAN & KLIEN MASUK === */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Daftar Pesanan Produk & Proyek Jasa Escrow Masuk ({creatorOrders.length})
          </h2>

          {creatorOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Belum ada pesanan masuk untuk toko Anda.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {creatorOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600">
                        #{ord.invoice_number}
                      </span>
                      <span className="font-bold text-slate-900">{ord.buyer_name}</span>
                      <span className="text-slate-400">({ord.buyer_email})</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{ord.item_title}</p>
                    {ord.project_brief && (
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <strong>Brief Klien:</strong> {ord.project_brief} (Target: {ord.deadline})
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Harga Jual: {formatIDR(ord.amount)} • Potongan Platform 5%: -
                      {formatIDR(ord.platform_fee)}
                    </p>
                  </div>

                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1 flex-shrink-0">
                    <span className="text-base font-extrabold text-emerald-600">
                      + {formatIDR(ord.creator_net)}
                    </span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      HAK BERSIH ANDA (95%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === TAB 4: PENGATURAN TOKO & REKENING BANK === */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Pengaturan Toko Kreator & Rekening Pencairan (95%)
          </h2>

          <form onSubmit={handleSaveStoreSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nama Kreator / Nama Studio
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
                  Headline / Spesialisasi Keahlian
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nomor WhatsApp Penerima Brief Jasa
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
                  Rekening Bank / E-Wallet Pencairan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BCA • 8820192831 a/n Raka"
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Bio / Tentang Toko Anda
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-base sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Pengaturan Toko & Rekening</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
