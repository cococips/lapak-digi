import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  MessageCircle,
  CheckCircle2,
  Clock,
  ShoppingBag,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { formatIDR, generateServiceWhatsAppUrl } from '../lib/utils';

export default function BuyerDashboardPage({
  currentUser,
  orders,
  items,
  profiles,
  onCompleteEscrowOrder,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'product' | 'service'

  // Ambil transaksi milik pembeli yang sedang login (atau tampilkan semua di mode demo jika email cocok)
  const myOrders = orders.filter(
    (o) =>
      o.buyer_id === currentUser?.id ||
      o.buyer_email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
      currentUser?.role === 'buyer'
  );

  const filteredOrders = myOrders.filter((o) => {
    if (activeTab === 'product') return o.item_type === 'product';
    if (activeTab === 'service') return o.item_type === 'service';
    return true;
  });

  const getCreator = (creatorId) => profiles.find((p) => p.id === creatorId);
  const getItem = (itemId) => items.find((i) => i.id === itemId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header Pelanggan */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser?.avatar_url ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
            }
            alt={currentUser?.full_name || 'Pembeli'}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-400/40"
          />
          <div>
            <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-0.5 text-[11px] font-bold text-indigo-300">
              Akun Pembeli / Customer
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
              Halo, {currentUser?.full_name || 'Dimas Anggara'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Unduh ulang produk digital Anda kapan saja & pantau garansi pengerjaan jasa Escrow.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-indigo-50 transition"
        >
          <ShoppingBag className="h-4 w-4 text-indigo-600" />
          <span>Eksplorasi Katalog Lainnya</span>
        </Link>
      </div>

      {/* Ringkasan Pembeli */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <span className="text-xs font-semibold text-slate-500">Produk Digital Dimiliki</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            {myOrders.filter((o) => o.item_type === 'product').length} File Siap Unduh
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <span className="text-xs font-semibold text-slate-500">Booking Jasa (Garansi Escrow)</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {myOrders.filter((o) => o.item_type === 'service').length} Proyek Jasa
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <span className="text-xs font-semibold text-slate-500">Status Proteksi Pembeli</span>
          <p className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>100% Dijamin Escrow Lapak Digi</span>
          </p>
        </div>
      </div>

      {/* Filter Tab */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua Transaksi ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('product')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'product'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="h-4 w-4" />
          <span>Library Produk Digital ({myOrders.filter((o) => o.item_type === 'product').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
            activeTab === 'service'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Booking Jasa Escrow ({myOrders.filter((o) => o.item_type === 'service').length})</span>
        </button>
      </div>

      {/* Daftar Library & Pesanan */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <p className="text-base font-bold text-slate-800">Belum ada riwayat pesanan di kategori ini</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white"
          >
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
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

                {/* Tombol Aksi Sesuai Tipe */}
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
                          onClick={() => onCompleteEscrowOrder && onCompleteEscrowOrder(ord.id)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Konfirmasi Jasa Selesai (Cairkan Dana)</span>
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
    </div>
  );
}
