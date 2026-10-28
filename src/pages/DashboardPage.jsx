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
  ArrowUpRight,
  Percent,
} from 'lucide-react';
import { formatIDR, calculateSplitPayment } from '../lib/utils';

export default function DashboardPage({
  currentUser,
  items,
  profiles,
  orders,
  payouts = [],
  onSaveItem,
  onDeleteItem,
  onRequestPayout,
}) {
  const creatorProfiles = profiles.filter((p) => p.role === 'creator');
  const [selectedCreatorId, setSelectedCreatorId] = useState(
    currentUser?.role === 'creator' ? currentUser.id : creatorProfiles[0]?.id || 'creator-1'
  );
  const [editingItem, setEditingItem] = useState(null);
  const [payoutNotice, setPayoutNotice] = useState('');

  useEffect(() => {
    if (currentUser?.role === 'creator') {
      setSelectedCreatorId(currentUser.id);
    }
  }, [currentUser]);

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

  const activeCreator =
    profiles.find((p) => p.id === selectedCreatorId) || creatorProfiles[0];
  const creatorItems = items.filter((i) => i.creator_id === selectedCreatorId);
  const creatorOrders = orders.filter((o) => o.creator_id === selectedCreatorId);
  const creatorPayouts = payouts.filter((p) => p.creator_id === selectedCreatorId);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      creator_id: selectedCreatorId,
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
  };

  const handleWithdraw = () => {
    if (availableBalance <= 0) return;
    if (onRequestPayout && activeCreator) {
      onRequestPayout({
        id: `pay-${Date.now()}`,
        creator_id: activeCreator.id,
        creator_name: activeCreator.full_name,
        bank_info: activeCreator.bank_info || 'BCA • Rekening Terdaftar Kreator',
        amount: availableBalance,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      setPayoutNotice(
        `Permintaan penarikan dana bersih (95%) sebesar ${formatIDR(
          availableBalance
        )} berhasil dikirim ke Admin Platform!`
      );
      setTimeout(() => setPayoutNotice(''), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Bar: Studio Kreator */}
      <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
            Creator Studio & Dompet 95%
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold mt-0.5">
            Halo, {activeCreator?.full_name} (@{activeCreator?.username})
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Anda menerima <strong>95% bersih</strong> dari setiap penjualan Produk Digital maupun Booking Jasa Escrow (5% biaya layanan platform).
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-3">
          <div className="text-xs flex-1">
            <label className="block text-slate-400 mb-1">Ganti Kreator (Simulasi):</label>
            <select
              value={selectedCreatorId}
              onChange={(e) => {
                setSelectedCreatorId(e.target.value);
                setEditingItem(null);
              }}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs font-bold text-white"
            >
              {creatorProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} (@{p.username})
                </option>
              ))}
            </select>
          </div>

          {activeCreator && (
            <Link
              to={`/creator/${activeCreator.username}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
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

      {/* Ringkasan Dompet Kreator (Gross 100%, Fee 5%, Net 95%) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/40 p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800">
              SALDO BERSIH SIAP TARIK (95%)
            </span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {formatIDR(availableBalance)}
            </p>
            <p className="text-[11px] text-emerald-700/80 mt-0.5">
              {activeCreator?.bank_info || 'Rekening Kreator Terdaftar'}
            </p>
          </div>

          <button
            type="button"
            disabled={availableBalance <= 0}
            onClick={handleWithdraw}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 transition"
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Tarik Saldo ke Bank</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-semibold text-slate-500">Total Penjualan Kotor (100%)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{formatIDR(grossSales)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Dari {creatorOrders.length} transaksi lunas
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-semibold text-slate-500">
            Bagi Hasil ke Platform (Komisi 5%)
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
          <p className="text-[11px] text-slate-400 mt-1">
            {creatorItems.reduce((a, c) => a + (c.sales_or_clicks || 0), 0)} total konversi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Form Tambah / Edit Item */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                {editingItem ? 'Edit Item' : 'Tambah Produk / Jasa Baru'}
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

            {/* Pilihan Tipe Item */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                Tipe Penawaran & Alur Transaksi
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
                    <div className="text-[10px] font-normal opacity-80">Checkout & Download Instan</div>
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
                    <div className="text-[10px] font-normal opacity-80">WA 1-on-1 + Booking Escrow</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Judul Item
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

            {/* Simulasi Otomatis Potongan 5% vs 95% */}
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
                  Pengaturan Pengiriman File Instan (Produk Digital)
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    URL File Download (Dibuka otomatis setelah pembayaran)
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
                      Info Format & Ukuran File
                    </label>
                    <input
                      type="text"
                      value={form.file_info}
                      onChange={(e) => setForm({ ...form, file_info: e.target.value })}
                      placeholder="ZIP • 18 MB"
                      className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-base sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      URL Live Demo (Opsional)
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
                  Pengaturan Layanan Jasa 1-on-1 (WA: {activeCreator?.whatsapp_number})
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
                      placeholder="3 - 5 Hari Kerja"
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
                      placeholder="3x Revisi"
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

        {/* Daftar Item & Riwayat Bagi Hasil Kreator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Daftar Katalog {activeCreator?.full_name} ({creatorItems.length})
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
                            {isProd ? 'Produk (Checkout Web)' : 'Jasa (WA + Escrow)'}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {formatIDR(item.price)}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600">
                            (Terima Bersih 95%: {formatIDR(split.creatorNet)})
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
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 sm:p-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span className="sm:hidden">Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 sm:p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sm:hidden">Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Riwayat Transaksi & Rincian Bagi Hasil 95% vs 5% */}
          {creatorOrders.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Riwayat Penjualan & Potongan Komisi 5%
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {creatorOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono font-bold text-indigo-600">
                        #{ord.invoice_number}
                      </span>{' '}
                      — <span className="font-semibold text-slate-800">{ord.buyer_name}</span>
                      <p className="text-slate-600 font-medium">{ord.item_title}</p>
                      <span className="text-[11px] text-slate-400">
                        Harga: {formatIDR(ord.amount)} • Komisi Platform 5%: -
                        {formatIDR(ord.platform_fee)}
                      </span>
                    </div>
                    <div className="sm:text-right flex sm:block items-center justify-between">
                      <span className="text-sm font-extrabold text-emerald-600">
                        + {formatIDR(ord.creator_net)}
                      </span>
                      <span className="block text-[10px] font-bold text-slate-500">
                        BERSIH (95% KREATOR)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
