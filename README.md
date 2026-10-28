# Lapak Digi — Creator Marketplace

Marketplace produk digital instan (**In-App Checkout + Auto-Unlock File**) dan layanan jasa freelance (**1-on-1 Direct WhatsApp Consultation**) untuk kreator lokal Indonesia.

---

## 1. Cara Menjalankan Web Ini di Laptop (Lokal)

Setiap kali kamu membuka ulang laptop/editor dan ingin melihat web ini:

1. Buka terminal di folder proyek `d:\Workspace\web-projects\Lapak_Digi`.
2. Jalankan perintah berikut (hanya perlu `npm install` jika baru pertama kali / pindah komputer):
   ```powershell
   npm install
   ```
3. Nyalakan server lokal:
   ```powershell
   npm run dev
   ```
4. Buka link yang muncul di browser: **http://localhost:5173/**

---

## 2. Cara Membuka di HP / Laptop Lain (Satu Jaringan Wi-Fi)

Jika ingin mengetes tampilan di HP kamu atau memperlihatkan ke teman yang berada di satu Wi-Fi/Hotspot yang sama:

```powershell
npm run dev -- --host
```
Terminal akan memunculkan baris **`Network: http://192.168.x.x:5173/`**. Buka alamat tersebut di browser HP kamu!

---

## 3. Cara Share ke Orang Lain via Link Online Gratis (Tanpa Install)

Agar orang lain di mana saja bisa langsung membuka web ini lewat link (misal: `https://lapak-digi.vercel.app`):

### Opsi A: Drag & Drop Cepat via Netlify Drop (Tanpa GitHub - 1 Menit)
1. Jalankan perintah build di terminal:
   ```powershell
   npm run build
   ```
2. Perintah di atas akan menghasilkan folder bernama **`dist`** di dalam proyekmu.
3. Buka **[app.netlify.com/drop](https://app.netlify.com/drop)** di browser, lalu **tarik (drag & drop) folder `dist`** tersebut ke halaman web Netlify.
4. Selesai! Kamu langsung mendapatkan link publik HTTPS yang bisa dibagikan ke siapa saja.

### Opsi B: Deploy via GitHub + Vercel (Otomatis Update Setiap Edit Kode)
1. Upload proyek ini ke repository GitHub kamu.
2. Login ke **[vercel.com](https://vercel.com)** menggunakan akun GitHub, klik **Add New Project**, lalu pilih repository `Lapak_Digi` dan klik **Deploy**.
3. File konfigurasi [`vercel.json`](./vercel.json) dan [`public/_redirects`](./public/_redirects) sudah disiapkan agar semua halaman (`/item/:id`, `/creator/:username`, `/dashboard`) berjalan lancar tanpa error 404.

