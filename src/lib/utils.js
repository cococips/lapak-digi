export function formatIDR(amount) {
  if (Number(amount) === 0) return 'GRATIS';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
}) {
  const cleanPhone = sanitizeWhatsAppNumber(creatorPhone);
  const priceText = formatIDR(servicePrice);

  const message = [
    `Halo Kak *${creatorName}*!`,
    `Saya tertarik memesan jasa Anda di *Lapak Digi* untuk sesi diskusi 1-on-1:`,
    ``,
    `*Jasa:* ${serviceTitle}`,
    `*Paket Mulai:* ${priceText}`,
    `*Nama Klien:* ${clientName || 'Calon Klien'}`,
    `*Target Waktu:* ${deadline || 'Fleksibel'}`,
    `*Brief Kebutuhan:*`,
    `${projectBrief || 'Ingin konsultasi detail kebutuhan proyek terlebih dahulu.'}`,
    ``,
    `Apakah slot pengerjaan saat ini tersedia? Terima kasih!`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
