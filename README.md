# Lapak Digi — Creator Marketplace (95% Kreator : 5% Platform)

Marketplace hibrida untuk kreator lokal Indonesia yang memadukan **Produk Digital Instan (Auto-Unlock File)** dan **Jasa Freelance 1-on-1 (Konsultasi WhatsApp + Booking Escrow Aman)** dengan sistem bagi hasil otomatis **95% untuk Kreator** dan **5% untuk Developer Pemilik Platform**.

---

## 👥 Arsitektur 3 Peran Pengguna (3-Role Ecosystem)

1. **Pelanggan / Customer (`/library` — Library Pembeli & Escrow)**
   - Membeli produk digital dan mengunduh ulang file kapan saja dari halaman **Library Pembeli**.
   - Melakukan konsultasi 1-on-1 via WhatsApp dengan kreator dan membayar jasa melalui **Booking Escrow Lapak Digi** (dana dijamin aman dan baru cair ke kreator setelah pembeli menekan tombol *Konfirmasi Jasa Selesai*).
2. **Kreator / Freelancer (`/dashboard` — Studio Kreator & Dompet 95%)**
   - Membuka lapak gratis tanpa biaya bulanan, menambah/mengedit/menghapus **Produk Digital** maupun **Jasa Freelance**.
   - Memantau **Saldo Bersih Siap Tarik (95%)**, rincian potongan komisi platform 5%, serta mengajukan **Penarikan Saldo (Withdraw/Payout)** ke rekening bank.
3. **Developer / Pemilik Platform (`/admin` — Revenue Center Komisi 5%)**
   - Halaman khusus pengelola platform untuk memantau **Total Keuntungan Developer (Komisi 5%)**, **Total Perputaran Uang (GMV 100%)**, **Alokasi Hak Kreator (95%)**, buku besar *Auto-Split Payment*, dan menyetujui pencairan dana kreator (*Approve Payouts*).

---

## ✨ Daftar Fitur & Komponen UI Lengkap

### 1. Identitas Visual & Navigasi 3-Role (`BrandLogo.jsx` & `Navbar.jsx`)
- **Custom Geometric Brand Logo**: Monogram vektor SVG `"L + D"` dengan gradasi *Indigo* (Produk Digital) ke *Emerald* (Jasa Freelance).
- **Role-Aware Desktop & Mobile Navigation**: Pintasan langsung ke **Library Pembeli (`/library`)**, **Studio Kreator (`/dashboard`)**, **Developer 5% (`/admin`)**, dan halaman **Masuk / Daftar (`/auth`)**.
- **Mobile Bottom Navigation Bar**: 5 tab ibu jari di bagian bawah layar HP (*Katalog*, *Pembeli*, *Kreator*, *Dev 5%*, *Akun*).

### 2. Halaman Beranda Konversi Tinggi (`HomePage.jsx`)
- **Hero Section + Statistik Kepercayaan**: Menampilkan nilai utama (*100% Instan*, *Bagi Hasil 95%:5%*, *Garansi Escrow*).
- **Katalog Langsung di Atas**: Pengunjung langsung disambut oleh **Produk Digital Populer** dan **Jasa Freelance Terbaik** beserta filter pencarian *real-time*.
- **Edukasi Cara Kerja & Proteksi Escrow**: Penjelasan 3 langkah transaksi aman bagi Pembeli dan Kreator.
- **Kalkulator Interaktif Pendapatan Kreator (95% vs 5%)**: Slider simulasi omzet bulanan yang menghitung otomatis potongan komisi 5% platform dan 95% pendapatan bersih kreator.
- **Testimoni Pengguna & Kreator Lokal**: Bukti sosial (*social proof*) dari pembeli dan freelancer.

### 3. Halaman Pendaftaran & Simulasi 3 Role (`AuthPage.jsx`)
- **Pilihan Pendaftaran Peran**: Pengguna baru dapat mendaftar secara spesifik sebagai **Pembeli / Customer** atau **Kreator / Freelancer**.
- **1-Klik Demo Role Switcher**: Fitur masuk instan sebagai *Akun Pembeli*, *Akun Kreator (95%)*, atau *Akun Developer Platform (5%)* untuk menguji seluruh alur aplikasi dengan mudah.

### 4. Halaman Detail & Transaksi Hibrida (`ItemDetailPage.jsx` & `CheckoutModal.jsx`)
- **Untuk Produk Digital (`product`)**: Pembayaran instan via QRIS/GoPay/Virtual Account yang langsung membuka kunci tombol **Download File** dan membagi 95% ke Kreator & 5% ke Developer.
- **Untuk Jasa Freelance (`service`)**:
  - **Form Brief 1-on-1**: Input nama klien, target deadline, dan deskripsi proyek.
  - **Tombol Booking & Bayar Jasa Aman (Garansi Escrow)**: Membayar jasa di dalam web (potong 5% otomatis untuk Developer & 95% ditahan untuk Kreator) serta menghasilkan **Kode Booking Resmi (`#ESC-XXXXXX`)** yang bisa langsung dikirim ke WhatsApp kreator.
  - **Tombol Tanya / Konsultasi 1-on-1 Dulu di WhatsApp**: Mengarahkan klien untuk berdiskusi langsung di WhatsApp sebelum atau sesudah booking.

---

## 🚀 Cara Menjalankan & Mengupdate Proyek

### Menjalankan di Laptop (Lokal)
```powershell
npm run dev
```
Buka **http://localhost:5173/** di browser.

### Mengirim Update ke GitHub & Vercel
```powershell
git add .
git commit -m "update fitur"
git push origin main
```
