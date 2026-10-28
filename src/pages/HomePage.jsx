import React from 'react';
import { Sparkles, ShoppingBag, MessageCircle, Zap, ShieldCheck, Users } from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function HomePage({ items, profiles, searchQuery, activeFilter, setActiveFilter }) {
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

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 text-xs font-semibold text-indigo-200 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Platform Hibrida #1 untuk Kreator & Freelancer Lokal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Beli <span className="text-indigo-400">Produk Digital Instan</span> atau Sewa{' '}
            <span className="text-emerald-400">Jasa Freelancer 1-on-1</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Unduh source code, UI kit, dan template secara instan di dalam web — atau konsultasikan proyek kustom Anda secara 1-on-1 langsung ke WhatsApp kreator terbaik.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Semua Katalog ({items.length})
            </button>
            <button
              onClick={() => setActiveFilter('product')}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                activeFilter === 'product'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Produk Digital (Download Instan)
            </button>
            <button
              onClick={() => setActiveFilter('service')}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                activeFilter === 'service'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              Jasa Freelance (1-on-1 WhatsApp)
            </button>
          </div>

          {/* Value Props */}
          <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs text-slate-300">
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3">
              <Zap className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <span><strong>Produk Digital:</strong> Bayar via QRIS/VA & langsung unduh file detik itu juga.</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3">
              <MessageCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span><strong>Jasa Kustom:</strong> Isi brief singkat & diskusi 1-on-1 langsung di WhatsApp kreator.</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3">
              <Users className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <span><strong>Kreator Lokal:</strong> Mendukung penuh developer, desainer, & penulis tanah air.</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* Section 1: Produk Digital Populer */}
        {(activeFilter === 'all' || activeFilter === 'product') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
                  <ShoppingBag className="h-4 w-4" /> In-App Instant Checkout
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Produk Digital Populer
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Bayar instan di web & langsung buka link download file tanpa menunggu chat.
              </p>
            </div>

            {popularProducts.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                Tidak ada produk digital yang cocok dengan pencarian Anda.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularProducts.map((item) => (
                  <ItemCard key={item.id} item={item} creator={getCreator(item.creator_id)} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Section 2: Jasa Freelance Terbaik */}
        {(activeFilter === 'all' || activeFilter === 'service') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  <MessageCircle className="h-4 w-4" /> 1-on-1 Direct WhatsApp Consultation
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Jasa Freelance Terbaik
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Kirim brief proyek & negosiasi langsung 1-on-1 melalui WhatsApp kreator.
              </p>
            </div>

            {bestServices.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                Tidak ada layanan jasa yang cocok dengan pencarian Anda.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bestServices.map((item) => (
                  <ItemCard key={item.id} item={item} creator={getCreator(item.creator_id)} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
