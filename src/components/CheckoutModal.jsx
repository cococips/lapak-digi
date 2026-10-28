import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  Download,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Lock,
} from 'lucide-react';
import {
  formatIDR,
  calculateSplitPayment,
  generateServiceWhatsAppUrl,
} from '../lib/utils';

export default function CheckoutModal({
  item,
  creator,
  currentUser,
  initialBrief = '',
  initialDeadline = 'Minggu Ini (3-5 Hari)',
  isOpen,
  onClose,
  onOrderSuccess,
}) {
  const isProduct = item?.item_type === 'product';
  const isFree = Number(item?.price) === 0;

  const [buyerName, setBuyerName] = useState(currentUser?.full_name || '');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [projectBrief, setProjectBrief] = useState(initialBrief);
  const [deadline, setDeadline] = useState(initialDeadline);
  const [paymentMethod, setPaymentMethod] = useState(isFree ? 'free' : 'qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.full_name || '');
      setBuyerEmail(currentUser.email || '');
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    setProjectBrief(initialBrief || '');
    setDeadline(initialDeadline || 'Minggu Ini (3-5 Hari)');
  }, [initialBrief, initialDeadline, isOpen]);

  if (!isOpen || !item) return null;

  const { grossAmount, platformFee, creatorNet } = calculateSplitPayment(item.price);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const codePrefix = isProduct ? 'INV' : 'ESC';
      const codeDigits = Date.now().toString().slice(-6);
      const invoiceNumber = `${codePrefix}-${codeDigits}`;

      const newOrder = {
        id: `ord-${Date.now()}`,
        invoice_number: invoiceNumber,
        order_type: isProduct ? 'product_instant' : 'service_escrow',
        item_id: item.id,
        item_title: item.title,
        item_type: item.item_type,
        download_url: item.download_url || '',
        creator_id: item.creator_id,
        buyer_id: currentUser?.id || 'guest-buyer',
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        project_brief: isProduct ? '' : projectBrief,
        deadline: isProduct ? '' : deadline,
        amount: grossAmount,
        platform_fee: platformFee, // 5% untuk Developer Platform
        creator_net: creatorNet, // 95% untuk Kreator
        payment_method: isFree ? 'FREEBIE' : paymentMethod.toUpperCase(),
        status: 'paid',
        escrow_status: isProduct ? 'completed' : 'in_progress',
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

  const handleSendBookingToWA = () => {
    if (!completedOrder || !creator) return;
    const waUrl = generateServiceWhatsAppUrl({
      creatorPhone: creator.whatsapp_number,
      creatorName: creator.full_name,
      serviceTitle: item.title,
      servicePrice: item.price,
      clientName: completedOrder.buyer_name,
      deadline: completedOrder.deadline,
      projectBrief: completedOrder.project_brief,
      bookingCode: completedOrder.invoice_number,
    });
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl border border-slate-100">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur">
          <div>
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isProduct ? 'text-indigo-600' : 'text-emerald-600'
              }`}
            >
              {completedOrder
                ? 'Transaksi Terverifikasi'
                : isProduct
                ? 'In-App Instant Checkout'
                : 'Lapak Digi Escrow Protection'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {completedOrder
                ? `Kode Resmi #${completedOrder.invoice_number}`
                : isProduct
                ? 'Beli & Akses Produk Instan'
                : 'Booking & Bayar Jasa Aman (Escrow)'}
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
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-1 ${
                    isProduct
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-emerald-700 bg-emerald-50'
                  }`}
                >
                  {isProduct ? 'Produk Digital • Auto-Unlock' : 'Jasa Freelance • Garansi Escrow'}
                </span>
                <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                  {item.title}
                </h4>
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
                  Nama Lengkap Pembeli / Klien
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
                  Email Penerima Invoice & Bukti Akses
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

              {!isProduct && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Catatan / Brief Singkat Proyek untuk Kreator
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Pembuatan landing page produk skincare + integrasi WA..."
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-base sm:text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              )}
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
                          <span className="block text-xs font-bold text-slate-800">
                            {method.label}
                          </span>
                          <span className="block text-[11px] text-slate-500">{method.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info Transparansi Keamanan & Proteksi Platform */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Harga Item / Paket</span>
                <span className="font-bold text-slate-900">{formatIDR(grossAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <Lock className="h-3 w-3 text-indigo-600" /> Proteksi Platform & Escrow (Sudah Termasuk 5%)
                </span>
                <span className="font-medium text-emerald-700">Bebas Biaya Tambahan</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>
                {isProduct
                  ? 'File produk digital langsung terbuka otomatis detik ini juga setelah pembayaran!'
                  : 'Dana Anda ditahan aman oleh Escrow Lapak Digi & baru diteruskan ke kreator setelah proyek beres.'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-60 transition ${
                isProduct
                  ? 'bg-indigo-600 shadow-indigo-600/25 hover:bg-indigo-700'
                  : 'bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-700'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {isProcessing
                ? 'Memverifikasi Pembayaran...'
                : isFree
                ? 'Klaim & Download Gratis Sekarang'
                : isProduct
                ? `Bayar ${formatIDR(item.price)} & Buka File`
                : `Bayar Booking Escrow ${formatIDR(item.price)}`}
            </button>
          </form>
        ) : (
          <div className="p-5 sm:p-6 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                {isProduct
                  ? 'File Produk Siap Diunduh! 🎉'
                  : 'Booking Escrow Berhasil Dijamin! 🔐'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Terima kasih <strong>{completedOrder.buyer_name}</strong>, transaksi juga tersimpan di menu{' '}
                <strong>Library Pembeli</strong> untuk <span className="underline">{completedOrder.buyer_email}</span>.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 gap-2">
                <span>Item</span>
                <span className="font-semibold text-slate-800 truncate">{item.title}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 gap-2">
                <span>Total Dibayar</span>
                <span className="font-bold text-slate-900">{formatIDR(completedOrder.amount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 gap-2">
                <span>Alokasi Dana Escrow</span>
                <span className="font-medium text-slate-700">
                  95% Kreator ({formatIDR(completedOrder.creator_net)}) • 5% Platform ({formatIDR(completedOrder.platform_fee)})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 gap-2">
                <span>Status</span>
                <span className="font-bold text-emerald-600">
                  {isProduct ? 'TERBUKA (INSTANT ACCESS)' : 'DANA DIJAMIN ESCROW'}
                </span>
              </div>
            </div>

            {isProduct ? (
              <a
                href={item.download_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
              >
                <Download className="h-4 w-4" />
                Download File Sekarang
              </a>
            ) : (
              <button
                type="button"
                onClick={handleSendBookingToWA}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
              >
                <MessageCircle className="h-4 w-4" />
                Kirim Tiket Booking #{completedOrder.invoice_number} ke WA Kreator
              </button>
            )}

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
