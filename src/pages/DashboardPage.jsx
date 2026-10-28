import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit3,
  ShoppingBag,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { formatIDR } from '../lib/utils';

export default function DashboardPage({ items, profiles, orders, onSaveItem, onDeleteItem }) {
  const [selectedCreatorId, setSelectedCreatorId] = useState(profiles[0]?.id || 'creator-1');
  const [editingItem, setEditingItem] = useState(null);

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

  const activeCreator = profiles.find((p) => p.id === selectedCreatorId);
  const creatorItems = items.filter((i) => i.creator_id === selectedCreatorId);
  const creatorOrders = orders.filter((o) => o.creator_id === selectedCreatorId);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Bar: Pilih Simulasi Akun Kreator */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Creator Workspace (CRUD Dashboard)
          </span>
          <h1 className="text-2xl font-extrabold mt-0.5">Kelola Produk Digital & Jasa Anda</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs">
            <label className="block text-slate-400 mb-1">Kreator Aktif:</label>
            <select
              value={selectedCreatorId}
              onChange={(e) => {
                setSelectedCreatorId(e.target.value);
                setEditingItem(null);
              }}
              className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-bold text-white"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} (@{p.username})
                </option>
              ))}
            </select>
          </div>

          {activeCreator && (
            <Link
              to={`/creator/${activeCreator.username}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
            >
              <span>Lihat Lapak Publik</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-semibold text-slate-500">Total Karya & Jasa Aktif</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{creatorItems.length} Item</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-semibold text-slate-500">Total Interaksi (Download & Klik WA)</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1 flex items-center gap-1.5">
            <TrendingUp className="h-5 w-5" />
            {creatorItems.reduce((acc, cur) => acc + (cur.sales_or_clicks || 0), 0)} Konversi
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-semibold text-slate-500">Transaksi In-App Produk Digital</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5" />
            {creatorOrders.length} Invoice Lunas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Tambah / Edit Item */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">
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
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, item_type: 'product' })}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    form.item_type === 'product'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <div className="text-left">
                    <div>Produk Digital</div>
                    <div className="text-[10px] font-normal opacity-80">Checkout & Download Instan</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, item_type: 'service' })}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    form.item_type === 'service'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <div className="text-left">
                    <div>Jasa Freelance</div>
                    <div className="text-[10px] font-normal opacity-80">1-on-1 Chat via WhatsApp</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Judul Item</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Template SaaS Next.js / Jasa Buat Website"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Harga (IDR / 0 = Gratis)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Kategori</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Source Code / Web Dev"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
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
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            {/* Field Dinamis Berdasarkan Produk vs Jasa */}
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
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Info Format & Ukuran File
                    </label>
                    <input
                      type="text"
                      value={form.file_info}
                      onChange={(e) => setForm({ ...form, file_info: e.target.value })}
                      placeholder="ZIP • 18 MB"
                      className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs"
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
                      className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3.5 space-y-3">
                <p className="text-xs font-bold text-emerald-800">
                  Pengaturan Layanan Jasa 1-on-1 (Redirect ke WA: {activeCreator?.whatsapp_number})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Estimasi Pengerjaan
                    </label>
                    <input
                      type="text"
                      value={form.delivery_time}
                      onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
                      placeholder="3 - 5 Hari Kerja"
                      className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs"
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
                      className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs"
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
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
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
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-md"
            >
              <Plus className="h-4 w-4" />
              {editingItem ? 'Simpan Perubahan' : 'Terbitkan ke Katalog'}
            </button>
          </form>
        </div>

        {/* Daftar Item Milik Kreator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              Daftar Katalog {activeCreator?.full_name} ({creatorItems.length})
            </h2>

            <div className="divide-y divide-slate-100">
              {creatorItems.map((item) => {
                const isProd = item.item_type === 'product';
                return (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-14 w-16 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                              isProd
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isProd ? 'Produk (Checkout Web)' : 'Jasa (WA 1-on-1)'}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {formatIDR(item.price)}
                          </span>
                        </div>
                        <Link
                          to={`/item/${item.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600 truncate block mt-0.5"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-slate-400">
                          {item.sales_or_clicks || 0}x {isProd ? 'pembelian instan' : 'klik konsultasi WA'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Riwayat Pembelian Produk Digital */}
          {creatorOrders.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Riwayat Checkout Produk Digital Terbaru
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {creatorOrders.map((ord) => (
                  <div key={ord.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-600">{ord.invoice_number}</span> —{' '}
                      <span className="font-semibold text-slate-800">{ord.buyer_name}</span> (
                      {ord.buyer_email})
                      <p className="text-slate-500">{ord.item_title}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatIDR(ord.amount)}</span>
                      <span className="block text-[10px] font-bold text-emerald-600">
                        LUNAS ({ord.payment_method})
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
