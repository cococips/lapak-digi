# Lapak Digi — Architecture & Technical Specification (v2.0 Hybrid Checkout)

## 1. Visi Produk & Perubahan Strategis
**Lapak Digi** adalah *All-in-One Digital Marketplace* untuk kreator lokal dan freelancer di Indonesia. Berdasarkan hasil analisa dan pematangan konsep, sistem transaksi kini dipisahkan secara cerdas sesuai karakteristik penawarannya:

1. **Produk Digital (`item_type = 'product'`) $\rightarrow$ In-App Instant Checkout + Auto-Unlock File**
   - Produk digital (Source Code, UI Kit Figma, Template Notion, E-Book) adalah barang jadi yang membutuhkan **akses instan 24/7** tanpa harus menunggu balasan chat kreator.
   - Pembeli melakukan checkout langsung di dalam aplikasi (mendukung **QRIS Instan, GoPay/DANA, Virtual Account**, maupun **Produk Gratis / Freebie `Rp 0`**).
   - Begitu pembayaran terverifikasi (`status = 'paid'`), tombol **Download File (`download_url`)** langsung terbuka otomatis di layar beserta nomor Invoice.

2. **Jasa Freelance (`item_type = 'service'`) $\rightarrow$ 1-on-1 Direct WhatsApp Brief & Consultation**
   - Jasa memerlukan diskusi *scope* proyek, negosiasi, dan kustomisasi.
   - Sebelum diarahkan ke WhatsApp kreator (`https://wa.me/<creator_phone>?text=<brief>`), klien mengisi **Form Brief Singkat 1-on-1** (Nama Klien, Target Deadline, dan Deskripsi Kebutuhan Proyek).

---

## 2. Tech Stack
- **Frontend Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Backend & Database**: Supabase (PostgreSQL) dengan dukungan fallback otomatis ke `localStorage` & Mock Data
- **Icons**: Lucide React

---

## 3. Skema Database Supabase (`supabase/schema.sql`)

### A. Tabel `profiles`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key (`references auth.users.id`) |
| `full_name` | `text` | Nama lengkap kreator |
| `username` | `text` | Handle unik untuk URL profil (`/creator/:username`) |
| `headline` | `text` | Spesialisasi singkat kreator |
| `whatsapp_number` | `text` | Nomor WhatsApp format internasional (`62812...`) |
| `avatar_url` | `text` | URL foto profil |
| `bio` | `text` | Deskripsi singkat kreator |
| `location` | `text` | Kota/Lokasi kreator |

### B. Tabel `digital_items`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `creator_id` | `uuid` | Foreign Key (`references profiles.id`) |
| `title` | `text` | Nama produk atau jasa |
| `description` | `text` | Deskripsi lengkap |
| `price` | `numeric` | Harga dalam IDR (`0` untuk produk gratis) |
| `item_type` | `text` | `'product'` (Checkout Instan) atau `'service'` (WA 1-on-1) |
| `category` | `text` | Sub-kategori (*Source Code, UI/UX Kit, Web Development*, dll) |
| `thumbnail_url` | `text` | URL gambar preview |
| `features` | `text[]` | Daftar poin *deliverables* / fitur |
| `demo_url` | `text` | *(Khusus Produk)* URL Live Demo / Preview |
| `download_url` | `text` | *(Khusus Produk)* URL file utama yang terbuka setelah lunas |
| `file_info` | `text` | *(Khusus Produk)* Format & ukuran file (misal: `ZIP • 14 MB`) |
| `delivery_time` | `text` | *(Khusus Jasa)* Estimasi pengerjaan (misal: `3 - 5 Hari Kerja`) |
| `revision_limit` | `text` | *(Khusus Jasa)* Batas revisi (misal: `3x Revisi Mayor`) |
| `sales_or_clicks` | `int4` | Metrik jumlah terjual / klik konsultasi WA |

### C. Tabel `orders` (Khusus Transaksi Produk Digital)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `invoice_number` | `text` | Nomor invoice unik (`INV-XXXXXX`) |
| `item_id` | `uuid` | Foreign Key (`references digital_items.id`) |
| `creator_id` | `uuid` | Foreign Key (`references profiles.id`) |
| `buyer_name` | `text` | Nama pembeli |
| `buyer_email` | `text` | Email penerima lisensi/file |
| `amount` | `numeric` | Nominal pembayaran (IDR) |
| `payment_method` | `text` | Metode pembayaran (`QRIS`, `GOPAY`, `VA_BCA`, `FREEBIE`) |
| `status` | `text` | Status pembayaran (`paid`) |
| `created_at` | `timestamptz` | Waktu transaksi |

