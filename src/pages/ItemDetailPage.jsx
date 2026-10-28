import React, { useState } from 'react';
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
} from 'lucide-react';
import { formatIDR, generateServiceWhatsAppUrl } from '../lib/utils';
import CheckoutModal from '../components/CheckoutModal';

export default function ItemDetailPage({ items, profiles, onRecordOrder, onIncrementMetric }) {
  const { id } = useParams();
  const item = items.find((i) => i.id === id);
  const creator = profiles.find((p) => p.id === item?.creator_id);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [deadline, setDeadline] = useState('Minggu Ini (3-5 Hari)');
  const [projectBrief, setProjectBrief] = useState('');

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Detail Kiri */}
        <div className="lg:col-span-7 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img src={item.thumbnail_url} alt={item.title} className="w-full h-80 sm:h-96 object-cover" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  isProduct ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isProduct ? '📦 Produk Digital (Download Instan)' : '🤝 Jasa Freelance (1-on-1 via WA)'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {item.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{item.title}</h1>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{item.description}</p>

            {item.features?.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                  {isProduct ? 'Apa Saja yang Anda Dapatkan:' : 'Cakupan Layanan Jasa:'}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-0.5 rounded-full bg-indigo-50 p-1 text-indigo-600">
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
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">
                  {isProduct ? 'Harga Lisensi Produk' : 'Estimasi Paket Jasa Mulai'}
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
                  {formatIDR(item.price)}
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {item.sales_or_clicks || 0}x {isProduct ? 'Terjual' : 'Konsultasi WA'}
              </span>
            </div>

            {isProduct ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 flex items-center gap-3">
                  <FileArchive className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Paket File Siap Unduh</p>
                    <p className="text-slate-500">{item.file_info || 'ZIP Digital Package'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {Number(item.price) === 0 ? 'Klaim & Download Gratis' : 'Beli Sekarang (Download Instan)'}
                </button>

                {item.demo_url && (
                  <a
                    href={item.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Lihat Live Demo / Preview
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleServiceWhatsAppOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="text-slate-400">Estimasi</p>
                      <p className="font-bold text-slate-800">{item.delivery_time || '3-5 Hari'}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex items-center gap-2.5">
                    <RefreshCw className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="text-slate-400">Revisi</p>
                      <p className="font-bold text-slate-800">{item.revision_limit || '3x Revisi'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Sparkles className="h-4 w-4" />
                    <span>Form Brief 1-on-1 (Otomatis Terkirim ke WA Kreator)</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Nama Anda / Brand"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                  />

                  <select
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
                >
                  <MessageCircle className="h-5 w-5" />
                  Pesan Jasa & Chat 1-on-1 di WhatsApp
                </button>
              </form>
            )}

            {/* Info Kreator */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={creator.avatar_url}
                  alt={creator.full_name}
                  className="h-11 w-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{creator.full_name}</p>
                  <p className="text-xs text-slate-500">{creator.headline}</p>
                </div>
              </div>
              <Link
                to={`/creator/${creator.username}`}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Lihat Lapak
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        item={item}
        creator={creator}
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
