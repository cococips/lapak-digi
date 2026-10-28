export const PLATFORM_FEE_PERCENT = 0.05; // 5% Komisi Developer Platform

export function formatIDR(amount) {
  if (Number(amount) === 0) return 'GRATIS';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Hitung pembagian otomatis: 5% Developer Platform vs 95% Kreator
export function calculateSplitPayment(grossAmount) {
  const gross = Number(grossAmount) || 0;
  const platformFee = Math.round(gross * PLATFORM_FEE_PERCENT);
  const creatorNet = gross - platformFee;
  return {
    grossAmount: gross,
    platformFee,
    creatorNet,
  };
}

export function sanitizeWhatsAppNumber(phone = '') {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('8')) return '62' + digits;
  return digits;
}

export function generateServiceWhatsAppUrl({
  creatorPhone,
  creatorName,
  serviceTitle,
  servicePrice,
  clientName,
  deadline,
  projectBrief,
  bookingCode,
}) {
  const cleanPhone = sanitizeWhatsAppNumber(creatorPhone);
  const priceText = formatIDR(servicePrice);

  const headerLines = bookingCode
    ? [
        `Halo Kak *${creatorName}*!`,
        `Saya sudah melakukan *Booking Escrow Resmi* di *Lapak Digi* dengan detail berikut:`,
        ``,
        `🔐 *Kode Booking Escrow:* #${bookingCode} (Dana Dijamin Platform)`,
      ]
    : [
        `Halo Kak *${creatorName}*!`,
        `Saya tertarik dengan jasa Anda di *Lapak Digi* untuk sesi konsultasi 1-on-1:`,
        ``,
      ];

  const message = [
    ...headerLines,
    `🛠️ *Jasa:* ${serviceTitle}`,
    `💰 *Paket:* ${priceText}`,
    `👤 *Nama Klien:* ${clientName || 'Calon Klien'}`,
    `📅 *Target Waktu:* ${deadline || 'Fleksibel'}`,
    `📝 *Brief Kebutuhan:*`,
    `${projectBrief || 'Ingin konsultasi detail kebutuhan proyek terlebih dahulu.'}`,
    ``,
    bookingCode
      ? `Mohon konfirmasi pengerjaan proyek ini ya Kak. Terima kasih!`
      : `Apakah slot pengerjaan saat ini tersedia? Setelah cocok saya akan lanjutkan Booking di Lapak Digi. Terima kasih!`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
