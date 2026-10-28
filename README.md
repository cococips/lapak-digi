# Lapak Digi — Creator Marketplace

Marketplace produk digital instan (**In-App Checkout + Auto-Unlock File**) dan layanan jasa freelance (**1-on-1 Direct WhatsApp Consultation**) untuk kreator lokal Indonesia.

---

## ✨ Daftar Fitur & Komponen UI di Dalam Web

### 1. Identitas Visual & Navigasi Adaptif (`BrandLogo.jsx` & `Navbar.jsx`)
- **Custom Geometric Brand Logo**: Monogram vektor SVG `"L + D"` dengan gradasi *Indigo* (Produk Digital) ke *Emerald* (Jasa Freelance) dan efek *ambient glow* saat *hover*.
- **Desktop Sticky Navbar**: Dilengkapi *Real-time Search Bar* (dengan tombol hapus cepat), filter kategori instan (*Jelajahi Produk*, *Cari Jasa*), dan pintasan ke *Dashboard Kreator*.
- **Mobile Navigation System (Responsive `< 768px`)**:
  - **Expandable Mobile Search Bar**: Tombol kaca pembesar di *top bar* yang membuka input pencarian khusus layar HP tanpa membuat header penuh.
  - **Mobile Drawer Menu**: Menu *dropdown* ringkas untuk navigasi cepat.
  - **App-like Sticky Bottom Navigation Bar**: Bar navigasi bawah (*Beranda*, *Produk*, *Jasa WA*, *Dashboard*) yang nyaman dijangkau ibu jari saat dibuka di smartphone.

### 2. Halaman Beranda & Eksplorasi Katalog (`HomePage.jsx` & `ItemCard.jsx`)
- **Hero Section Interaktif**: Dilengkapi *Filter Pills* responsif untuk menyaring katalog secara *real-time* (*Semua Katalog*, *Produk Digital*, atau *Jasa Freelance*) dan kartu *Value Proposition*.
- **Dual-Identity Item Cards (`ItemCard.jsx`)**:
  - **Kartu Produk Digital (`product`)**: Menampilkan *badge* **Produk Instan** berwarna Indigo, info format/ukuran paket file (`ZIP / Figma / PDF`), jumlah akses, dan tombol **Beli Instan**.
  - **Kartu Jasa Freelance (`service`)**: Menampilkan *badge* **Jasa 1-on-1 WA** berwarna Emerald, estimasi waktu pengerjaan (*3–5 Hari*), harga *"Mulai Dari"*, dan tombol **Pesan Jasa**.

### 3. Halaman Detail Adaptif: Produk vs Jasa (`ItemDetailPage.jsx`)
Tampilan panel transaksi di sisi kanan (dan *floating bar* di layar HP) otomatis menyesuaikan jenis item yang dibuka:
- **Mode Produk Digital (`product`)**:
  - Menampilkan detail ukuran/format paket file, daftar *deliverables*, tombol **Lihat Live Demo / Preview**, dan tombol utama **Beli Sekarang (Download Instan)** (atau **Klaim & Download Gratis** jika harga `Rp 0`).
- **Mode Jasa Freelance (`service`)**:
  - Menampilkan kartu **Estimasi Pengerjaan** & **Batas Revisi**.
  - **Form Brief 1-on-1 Interaktif**: Input *Nama Klien/Brand*, *Pilihan Target Deadline*, dan *Deskripsi Kebutuhan Proyek* yang otomatis dirangkai menjadi pesan WhatsApp rapi ketika tombol **Pesan Jasa & Chat 1-on-1 di WhatsApp** ditekan.
- **Mobile Floating Quick CTA Bar**: Bar melayang di bagian bawah layar HP yang menampilkan harga beserta tombol aksi cepat (*Beli Instan* atau *Isi Brief & Chat WA*).

### 4. Modal Checkout Instan & Auto-Unlock File (`CheckoutModal.jsx`)
- **Responsive Bottom-Sheet di Mobile & Centered Modal di Desktop**: Muncul mulus dari bawah layar pada HP.
- **Pilihan Pembayaran Instan**: Mendukung simulasi pembayaran **QRIS Instan**, **GoPay / DANA**, **Virtual Account (BCA/Mandiri)**, serta klaim langsung untuk **Produk Gratis (`Freebie`)**.
- **Instant File Unlock & Invoice**: Begitu pembayaran dikonfirmasi, modal otomatis berubah menjadi halaman bukti lunas (`INV-XXXXXX`) dan membuka kunci tombol **Download File Sekarang**.

### 5. Halaman Portofolio Publik Kreator (`CreatorProfilePage.jsx`)
- **Bio-Link Ready (`/creator/:username`)**: Menampilkan foto profil, nama, *handle* `@username`, spesialisasi (*headline*), lokasi, dan jumlah karya aktif.
- **Tombol Bagikan Link Lapak**: Menyalin URL profil kreator ke *clipboard* dalam 1 klik dengan indikator status *"Link Lapak Tersalin!"*.
- **Horizontal Scrollable Portfolio Tabs**: Tab filter karya kreator (*Semua*, *Produk Digital*, *Jasa Freelance*) yang bisa digeser ke samping pada layar HP.

### 6. Workspace & CRUD Dashboard Kreator (`DashboardPage.jsx`)
- **Account Switcher Simulasi**: Memungkinkan pengujian dashboard dari sudut pandang beberapa kreator berbeda.
- **Kartu Analitik Real-time**: Menampilkan *Total Karya & Jasa Aktif*, *Total Interaksi (Download & Klik WA)*, serta *Jumlah Invoice Lunas*.
- **Form CRUD Dinamis (Tambah & Edit Item)**: Input form otomatis berubah mengikuti pilihan tipe item (*Pengaturan File Download & Demo* untuk Produk Digital, atau *Estimasi Pengerjaan & Batas Revisi* untuk Jasa Freelance).
- **Manajemen Katalog & Tabel Riwayat Order**: Edit atau hapus item secara instan (tersimpan di `localStorage`) serta pantau daftar pembeli produk digital beserta metode pembayarannya.

---

## 🚀 Cara Menjalankan Web Ini di Laptop (Lokal)

1. Buka terminal di folder proyek `d:\Workspace\web-projects\Lapak_Digi`.
2. Instal paket (hanya perlu sekali di awal):
   ```powershell
   npm install
   ```
3. Jalankan server pengembangan lokal:
   ```powershell
   npm run dev
   ```
4. Buka di browser: **http://localhost:5173/**

---

## 📱 Cara Membuka di HP (Satu Jaringan Wi-Fi)

```powershell
npm run dev -- --host
```
Buka alamat **`Network: http://192.168.x.x:5173/`** yang muncul di terminal pada browser HP kamu.

---

## 🌐 Cara Deploy & Update ke GitHub + Vercel

Setiap kali ada perubahan kode yang ingin di-*update* ke website Vercel kamu:
```powershell
git add .
git commit -m "update fitur"
git push origin main
```
Vercel akan otomatis mendeteksi *push* terbaru di GitHub dan memperbarui website publikmu dalam ~30 detik!
