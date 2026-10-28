import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  Clock,
  RefreshCw,
  FileArchive,
  Sparkles,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { formatIDR, generateServiceWhatsAppUrl } from '../lib/utils';
import CheckoutModal from '../components/CheckoutModal';

export default function ItemDetailPage({
  items,
  profiles,
  currentUser,
  onRecordOrder,
  onIncrementMetric,
}) {
  const { id } = useParams();
  const item = items.find((i) => i.id === id);
  const creator = profiles.find((p) => p.id === item?.creator_id);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientName, setClientName] = useState(currentUser?.full_name || '');
  const [deadline, setDeadline] = useState('Minggu Ini (3-5 Hari)');
  const [projectBrief, setProjectBrief] = useState('');
  const actionPanelRef = useRef(null);

  if (!item || !creator) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Item tidak ditemukan</h2>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isProduct = item.item_type === 'product';

  const handleServiceWhatsAppOrder = (e) => {
    e.preventDefault();
    if (onIncrementMetric) onIncrementMetric(item.id);

    const waUrl = generateServiceWhatsAppUrl({
      creatorPhone: creator.whatsapp_number,
      creatorName: creator.full_name,
      serviceTitle: item.title,
      servicePrice: item.price,
      clientName,
      deadline,
      projectBrief,
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToActionPanel = () => {
    actionPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 mb-4 sm:mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Detail Kiri */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-56 sm:h-96 object-cover"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wide ${
                  isProduct ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isProduct
                  ? '📦 Produk Digital (Download Instan)'
                  : '🤝 Jasa Freelance (WA 1-on-1 + Garansi Escrow)'}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-slate-100 text-slate-700">
                {item.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {item.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>

            {item.features?.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                  {isProduct ? 'Apa Saja yang Anda Dapatkan:' : 'Cakupan Layanan Jasa:'}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <span className="mt-0.5 rounded-full bg-indigo-50 p-1 text-indigo-600 flex-shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Panel Transaksi Kanan */}
        <div ref={actionPanelRef} className="lg:col-span-5 space-y-6">
          <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-lg shadow-slate-200/40 space-y-5 sm:space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] sm:text-xs font-semibold uppercase text-slate-400">
                  {isProduct ? 'Harga Lisensi Produk' : 'Estimasi Paket Jasa Mulai'}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  {formatIDR(item.price)}
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {item.sales_or_clicks || 0}x {isProduct ? 'Terjual' : 'Transaksi'}
              </span>
            </div>

            {isProduct ? (
              <div className="space-y-3.5 sm:space-y-4">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 flex items-center gap-3">
                  <FileArchive className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Paket File Siap Unduh</p>
                    <p className="text-slate-500">{item.file_info || 'ZIP Digital Package'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {Number(item.price) === 0 ? 'Klaim & Download Gratis' : 'Beli Sekarang (Download Instan)'}
                </button>

                {item.demo_url && (
                  <a
                    href={item.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Lihat Live Demo / Preview
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs min-w-0">
                      <p className="text-slate-400">Estimasi</p>
                      <p className="font-bold text-slate-800 truncate">{item.delivery_time || '3-5 Hari'}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex items-center gap-2.5">
                    <RefreshCw className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs min-w-0">
                      <p className="text-slate-400">Revisi</p>
                      <p className="font-bold text-slate-800 truncate">{item.revision_limit || '3x Revisi'}</p>
                    </div>
                  </div>
                </div>

                {/* Form Brief 1-on-1 */}
                <form onSubmit={handleServiceWhatsAppOrder} className="space-y-3">
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <Sparkles className="h-4 w-4 flex-shrink-0" />
                      <span>Isi Brief Proyek (Untuk Diskusi WA & Booking Escrow)</span>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Nama Anda / Brand"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-base sm:text-xs focus:border-emerald-600 focus:outline-none"
                    />

                    <select
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-base sm:text-xs focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Segera / Urgent (1-3 Hari)">Target: Segera / Urgent (1-3 Hari)</option>
                      <option value="Minggu Ini (3-5 Hari)">Target: Minggu Ini (3-5 Hari)</option>
                      <option value="Bulan Ini / Fleksibel">Target: Bulan Ini / Fleksibel</option>
                    </select>

                    <textarea
                      rows={3}
                      required
                      placeholder="Tuliskan kebutuhan proyek yang ingin didiskusikan..."
                      value={projectBrief}
                      onChange={(e) => setProjectBrief(e.target.value)}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-base sm:text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  {/* Tombol 1: Booking Escrow di Web (Potong 5% otomatis & dana dijamin) */}
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span>Booking & Bayar Jasa Aman (Garansi Escrow)</span>
                  </button>

                  {/* Tombol 2: Diskusi 1-on-1 dulu di WhatsApp */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Tanya / Konsultasi 1-on-1 Dulu di WhatsApp</span>
                  </button>
                </form>
              </div>
            )}

            {/* Info Kreator */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={creator.avatar_url}
                  alt={creator.full_name}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{creator.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{creator.headline}</p>
                </div>
              </div>
              <Link
                to={`/creator/${creator.username}`}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition flex-shrink-0"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Lihat Lapak</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Quick CTA Bar */}
      <div className="lg:hidden fixed bottom-[56px] inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="block text-[10px] font-semibold uppercase text-slate-400">
            {isProduct ? 'Harga Produk' : 'Mulai Dari'}
          </span>
          <span className="text-base font-extrabold text-slate-900">{formatIDR(item.price)}</span>
        </div>

        {isProduct ? (
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{Number(item.price) === 0 ? 'Download Gratis' : 'Beli & Download Instan'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToActionPanel}
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-600 bg-white px-3 py-2.5 text-xs font-bold text-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat WA</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Booking Escrow</span>
            </button>
          </div>
        )}
      </div>

      <CheckoutModal
        item={item}
        creator={creator}
        currentUser={currentUser}
        initialBrief={projectBrief}
        initialDeadline={deadline}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => {
          if (onRecordOrder) onRecordOrder(order);
          if (onIncrementMetric) onIncrementMetric(item.id);
        }}
      />
    </div>
  );
}
