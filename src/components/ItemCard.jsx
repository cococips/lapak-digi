import React from 'react';
import { Link } from 'react-router-dom';
import { Download, MessageCircle, ArrowUpRight, Clock } from 'lucide-react';
import { formatIDR } from '../lib/utils';

export default function ItemCard({ item, creator }) {
  const isProduct = item.item_type === 'product';

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
      {/* Thumbnail */}
      <Link to={`/item/${item.id}`} className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={item.thumbnail_url}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur-md ${
              isProduct
                ? 'bg-indigo-600/95 text-white'
                : 'bg-emerald-600/95 text-white'
            }`}
          >
            {isProduct ? (
              <>
                <Download className="h-3 w-3" /> Produk Instan
              </>
            ) : (
              <>
                <MessageCircle className="h-3 w-3" /> Jasa 1-on-1 WA
              </>
            )}
          </span>
        </div>
        <span className="absolute bottom-3 right-3 rounded-lg bg-slate-900/75 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
          {item.category}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {creator && (
          <Link
            to={`/creator/${creator.username}`}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 mb-2"
          >
            <img
              src={creator.avatar_url}
              alt={creator.full_name}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="font-medium truncate">{creator.full_name}</span>
          </Link>
        )}

        <Link to={`/item/${item.id}`} className="block">
          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 text-base">
            {item.title}
          </h3>
        </Link>

        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 flex-1">{item.description}</p>

        {/* Info Tambahan Spesifik Tipe */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          {isProduct ? (
            <span>📦 {item.file_info || 'Akses File Instan'}</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <Clock className="h-3 w-3" /> Estimasi {item.delivery_time || '3-5 Hari'}
            </span>
          )}
          <span>{item.sales_or_clicks || 0}x diakses</span>
        </div>

        {/* Price & CTA */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              {isProduct ? 'Harga Produk' : 'Mulai Dari'}
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {formatIDR(item.price)}
            </span>
          </div>

          <Link
            to={`/item/${item.id}`}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              isProduct
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            <span>{isProduct ? 'Beli Instan' : 'Pesan Jasa'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
