import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  TrendingUp,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Users,
  Percent,
  Trash2,
  ClipboardList,
  LayoutGrid,
} from 'lucide-react';
import { formatIDR } from '../lib/utils';

export default function AdminDashboardPage({
  orders,
  profiles,
  items,
  payouts = [],
  onApprovePayout,
  onDeleteItem,
}) {
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'ledger' | 'payouts' | 'users'

  const totalGMV = orders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
  const totalPlatformProfit = orders.reduce((acc, o) => acc + (Number(o.platform_fee) || 0), 0);
  const totalCreatorNet = orders.reduce((acc, o) => acc + (Number(o.creator_net) || 0), 0);

  const getCreatorName = (creatorId) =>
    profiles.find((p) => p.id === creatorId)?.full_name || 'Kreator';

  const creatorsList = profiles.filter((p) => p.role === 'creator');
  const buyersList = profiles.filter((p) => p.role === 'buyer');
  const pendingPayoutsCount = payouts.filter((p) => p.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header Developer / Platform Owner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-500/30 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Code2 className="h-4 w-4" />
            <span>Developer / Platform Owner Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Pusat Kendali & Komisi Platform (5%)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pantau keuntungan bersih <strong>5% Developer</strong> dari setiap transaksi Produk Digital & Jasa Escrow, setujui pencairan saldo 95% kreator, dan kelola ekosistem pengguna.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-5 py-4 text-left sm:text-right w-full lg:w-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
            Total Keuntungan Developer (5%)
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">
            {formatIDR(totalPlatformProfit)}
          </p>
          <span className="text-[11px] text-slate-300">
            Dari {orders.length} transaksi sukses
          </span>
        </div>
      </div>

      {/* Navigasi 4 Tab Developer Console */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'revenue'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Percent className="h-4 w-4" />
          <span>1. Ringkasan Keuntungan 5%</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'ledger'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>2. Buku Besar Split (95% : 5%)</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'payouts'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="h-4 w-4" />
          <span>3. Pencairan Dana Kreator ({pendingPayoutsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>4. Pengguna & Moderasi Katalog</span>
        </button>
      </div>

      {/* === TAB 1: RINGKASAN KEUNTUNGAN 5% === */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/40 p-5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>KEUNTUNGAN DEVELOPER (5%)</span>
                <Percent className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-700 mt-2">
                {formatIDR(totalPlatformProfit)}
              </p>
              <p className="text-[11px] text-emerald-700/80 mt-1">
                Kas pendapatan bersih pemilik platform
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>TOTAL PERPUTARAN UANG (GMV 100%)</span>
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{formatIDR(totalGMV)}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Produk Digital + Booking Jasa Escrow
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>ALOKASI HAK KREATOR (95%)</span>
                <Wallet className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-indigo-600 mt-2">
                {formatIDR(totalCreatorNet)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Saldo bersih milik seluruh kreator
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>EKOSISTEM PENGGUNA</span>
                <Users className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {creatorsList.length} Kreator • {buyersList.length} Pembeli
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {items.length} item katalog aktif
              </p>
            </div>
          </div>

          {/* Performa Komisi 5% per Kreator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Kontribusi Komisi 5% Berdasarkan Toko Kreator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorsList.map((cr) => {
                const crOrders = orders.filter((o) => o.creator_id === cr.id);
                const crGross = crOrders.reduce((a, o) => a + (Number(o.amount) || 0), 0);
                const crFee = crOrders.reduce((a, o) => a + (Number(o.platform_fee) || 0), 0);
                const crNet = crOrders.reduce((a, o) => a + (Number(o.creator_net) || 0), 0);

                return (
                  <div
                    key={cr.id}
                    className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={cr.avatar_url}
                        alt={cr.full_name}
                        className="h-12 w-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 truncate">
                          {cr.full_name} (@{cr.username})
                        </p>
                        <p className="text-xs text-slate-500">
                          {crOrders.length} transaksi • Omzet {formatIDR(crGross)}
                        </p>
                        <p className="text-[11px] text-indigo-600 font-semibold">
                          Hak Kreator (95%): {formatIDR(crNet)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="block text-[10px] font-bold uppercase text-slate-400">
                        Komisi 5% Kita
                      </span>
                      <span className="text-base font-extrabold text-emerald-600">
                        + {formatIDR(crFee)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* === TAB 2: BUKU BESAR SPLIT PAYMENT (95% vs 5%) === */}
      {activeTab === 'ledger' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Buku Besar Transaksi & Split Komisi Otomatis (95% vs 5%)
              </h2>
              <p className="text-xs text-slate-500">
                Setiap pesanan pelanggan tercatat otomatis beserta rincian bagi hasil antara Kreator dan Developer.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              <ShieldCheck className="h-4 w-4" /> Auto-Split Payment Aktif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                  <th className="py-3 px-3 rounded-tl-xl">Kode / Tipe</th>
                  <th className="py-3 px-3">Item & Kreator</th>
                  <th className="py-3 px-3">Pelanggan</th>
                  <th className="py-3 px-3 text-right">Harga (100%)</th>
                  <th className="py-3 px-3 text-right text-indigo-700">Hak Kreator (95%)</th>
                  <th className="py-3 px-3 text-right text-emerald-700 rounded-tr-xl">
                    Untung Developer (5%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => {
                  const isProd = ord.item_type === 'product';
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-mono font-extrabold text-slate-900 block">
                          #{ord.invoice_number}
                        </span>
                        <span
                          className={`inline-block mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isProd
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {isProd ? 'Produk Instan' : 'Jasa Escrow'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <Link
                          to={`/item/${ord.item_id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                        >
                          {ord.item_title}
                        </Link>
                        <span className="text-xs text-slate-500">
                          Kreator: {getCreatorName(ord.creator_id)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 block">{ord.buyer_name}</span>
                        <span className="text-xs text-slate-400">{ord.payment_method}</span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatIDR(ord.amount)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-indigo-600 whitespace-nowrap">
                        {formatIDR(ord.creator_net)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-extrabold text-emerald-600 whitespace-nowrap bg-emerald-50/40">
                        + {formatIDR(ord.platform_fee)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === TAB 3: PENCAIRAN DANA KREATOR (PAYOUTS) === */}
      {activeTab === 'payouts' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Permintaan Pencairan Saldo Kreator (Payout / Withdraw 95%)
            </h2>
            <p className="text-xs text-slate-500">
              Kelola pencairan saldo bersih kreator (setelah dipotong komisi 5% platform) ke rekening bank mereka.
            </p>
          </div>

          {payouts.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center text-xs text-slate-500">
              Belum ada pengajuan penarikan saldo dari kreator. Kreator dapat mengajukan penarikan dari menu <strong>Studio Kreator</strong>.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {payouts.map((pay) => (
                <div
                  key={pay.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-sm text-slate-900">{pay.creator_name}</span>
                    <p className="text-xs text-slate-500">
                      Tujuan Transfer: <strong>{pay.bank_info}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-slate-900">
                      {formatIDR(pay.amount)}
                    </span>
                    {pay.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => onApprovePayout && onApprovePayout(pay.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Setujui Transfer</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Sudah Ditransfer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === TAB 4: MANAJEMEN PENGGUNA & MODERASI KATALOG === */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Daftar Pengguna Terdaftar ({profiles.length})
            </h2>
            <div className="divide-y divide-slate-100">
              {profiles.map((user) => (
                <div key={user.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.full_name} (@{user.username})
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase flex-shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : user.role === 'creator'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Moderasi Seluruh Katalog Platform ({items.length})
            </h2>
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="h-12 w-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/item/${item.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-slate-500">
                        Oleh {getCreatorName(item.creator_id)} • {formatIDR(item.price)}
                      </p>
                    </div>
                  </div>

                  {onDeleteItem && (
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Takedown</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
