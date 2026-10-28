import React, { useState } from 'react';
import {
  X,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  Download,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { formatIDR } from '../lib/utils';

export default function CheckoutModal({ item, creator, isOpen, onClose, onOrderSuccess }) {
  const isFree = Number(item?.price) === 0;
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(isFree ? 'free' : 'qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen || !item) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = {
        id: `ord-${Date.now()}`,
        invoice_number: `INV-${Date.now().toString().slice(-6)}`,
        item_id: item.id,
        item_title: item.title,
        creator_id: item.creator_id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        amount: Number(item.price),
        payment_method: isFree ? 'FREEBIE' : paymentMethod.toUpperCase(),
        status: 'paid',
        created_at: new Date().toISOString(),
      };

      setIsProcessing(false);
      setCompletedOrder(newOrder);
      if (onOrderSuccess) onOrderSuccess(newOrder);
    }, 800);
  };

  const resetAndClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl border border-slate-100">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
              {completedOrder ? 'Transaksi Berhasil' : 'In-App Instant Checkout'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {completedOrder ? `Invoice #${completedOrder.invoice_number}` : 'Beli & Akses Produk Instan'}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!completedOrder ? (
          <form onSubmit={handleCheckout} className="p-5 sm:p-6 space-y-4 sm:space-y-5">
            {/* Ringkasan Item */}
            <div className="flex items-center gap-3.5 rounded-xl bg-slate-50 p-3 border border-slate-200/70">
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="h-14 w-16 sm:h-16 sm:w-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-1">
                  Produk Digital • Auto-Unlock
                </span>
                <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{item.title}</h4>
                <p className="text-xs text-slate-500 truncate">Kreator: {creator?.full_name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm sm:text-base font-extrabold text-slate-900">
                  {formatIDR(item.price)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Nama Lengkap Pembeli
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Email Penerima File & Lisensi
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {!isFree && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
                  Pilih Metode Pembayaran Instan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'qris', label: 'QRIS Instan', icon: QrCode, desc: 'Semua E-Wallet/Bank' },
                    { id: 'gopay', label: 'GoPay / DANA', icon: Wallet, desc: 'Auto-Verifikasi' },
                    { id: 'va_bca', label: 'Virtual Account', icon: Building2, desc: 'BCA / Mandiri' },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 rounded-xl border p-3 text-left transition ${
                          active
                            ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 sm:mb-1.5 flex-shrink-0 ${
                            active ? 'text-indigo-600' : 'text-slate-500'
                          }`}
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">{method.label}</span>
                          <span className="block text-[11px] text-slate-500">{method.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>
                Berbeda dengan Jasa (via WA), Produk Digital langsung membuka link download detik ini juga setelah bayar!
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              <Sparkles className="h-4 w-4" />
              {isProcessing
                ? 'Memverifikasi Pembayaran...'
                : isFree
                ? 'Klaim & Download Gratis Sekarang'
                : `Bayar ${formatIDR(item.price)} & Buka File`}
            </button>
          </form>
        ) : (
          <div className="p-5 sm:p-6 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                File Produk Siap Diunduh! 🎉
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Terima kasih <strong>{completedOrder.buyer_name}</strong>, bukti pembelian telah dicatat untuk{' '}
                <span className="underline">{completedOrder.buyer_email}</span>.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                <span>Nama Produk</span>
                <span className="font-semibold text-slate-800 truncate">{item.title}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                <span>Paket File</span>
                <span className="font-medium text-slate-700">{item.file_info || 'ZIP Digital Package'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                <span>Status Lisensi</span>
                <span className="font-bold text-emerald-600">TERBUKA (INSTANT ACCESS)</span>
              </div>
            </div>

            <a
              href={item.download_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
            >
              <Download className="h-4 w-4" />
              Download File Sekarang
            </a>

            <button
              type="button"
              onClick={resetAndClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Tutup Jendela Ini
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
