import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Share2, Check, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function CreatorProfilePage({ items, profiles }) {
  const { username } = useParams();
  const [tab, setTab] = useState('all');
  const [copied, setCopied] = useState(false);

  const creator = profiles.find((p) => p.username === username);
  if (!creator) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Kreator tidak ditemukan</h2>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const creatorItems = items.filter((i) => i.creator_id === creator.id);
  const filtered = creatorItems.filter((i) => tab === 'all' || i.item_type === tab);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Profil Kreator */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={creator.avatar_url}
            alt={creator.full_name}
            className="h-24 w-24 rounded-2xl object-cover border-2 border-indigo-100 shadow"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{creator.full_name}</h1>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                @{creator.username}
              </span>
            </div>
            <p className="text-sm font-semibold text-indigo-600">{creator.headline}</p>
            <p className="text-sm text-slate-600 max-w-2xl">{creator.bio}</p>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {creator.location || 'Indonesia'}
              </span>
              <span>•</span>
              <span>{creatorItems.length} Karya & Layanan Aktif</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex-shrink-0"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          <span>{copied ? 'Link Lapak Tersalin!' : 'Bagikan Link Lapak'}</span>
        </button>
      </div>

      {/* Filter Tab Portofolio */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setTab('all')}
          className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            tab === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua ({creatorItems.length})
        </button>
        <button
          onClick={() => setTab('product')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            tab === 'product' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Produk Digital ({creatorItems.filter((i) => i.item_type === 'product').length})
        </button>
        <button
          onClick={() => setTab('service')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            tab === 'service' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          Jasa Freelance ({creatorItems.filter((i) => i.item_type === 'service').length})
        </button>
      </div>

      {/* Grid Item Kreator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <ItemCard key={item.id} item={item} creator={creator} />
        ))}
      </div>
    </div>
  );
}
