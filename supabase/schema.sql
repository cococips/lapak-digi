-- ============================================================================
-- LAPAK DIGI DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Sistem Transaksi Hibrida:
-- 1. Produk Digital ('product') -> In-App Instant Checkout + Auto-Unlock File
-- 2. Jasa Freelance ('service') -> 1-on-1 WhatsApp Consultation & Brief Redirect
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  headline TEXT DEFAULT 'Kreator Digital & Freelancer',
  whatsapp_number TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT DEFAULT 'Indonesia',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.digital_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  item_type TEXT NOT NULL CHECK (item_type IN ('product', 'service')),
  category TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  -- Khusus Produk Digital
  demo_url TEXT,
  download_url TEXT,
  file_info TEXT,
  -- Khusus Jasa Freelance
  delivery_time TEXT,
  revision_limit TEXT,
  -- Statistik
  sales_or_clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  item_id UUID NOT NULL REFERENCES public.digital_items(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
