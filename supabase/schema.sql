-- ============================================================================
-- LAPAK DIGI DATABASE SCHEMA v3.0 (SUPABASE POSTGRESQL)
-- Ekosistem 3 Role (Buyer, Creator, Admin/Developer) & Split Komisi 95% : 5%
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'creator', 'admin')),
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  headline TEXT DEFAULT 'Member Lapak Digi',
  whatsapp_number TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT DEFAULT 'Indonesia',
  bank_info TEXT,
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
  demo_url TEXT,
  download_url TEXT,
  file_info TEXT,
  delivery_time TEXT,
  revision_limit TEXT,
  sales_or_clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('product_instant', 'service_escrow')),
  item_id UUID NOT NULL REFERENCES public.digital_items(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  project_brief TEXT,
  deadline TEXT,
  amount NUMERIC NOT NULL,          -- 100% Harga Kotor
  platform_fee NUMERIC NOT NULL,    -- 5% Keuntungan Developer Platform
  creator_net NUMERIC NOT NULL,     -- 95% Pendapatan Bersih Kreator
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  escrow_status TEXT DEFAULT 'in_progress' CHECK (escrow_status IN ('in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  bank_info TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
