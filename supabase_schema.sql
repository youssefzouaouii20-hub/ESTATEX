-- ============================================================
--  EstateEx · Supabase Database Setup
--  Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ── Users (extends Supabase auth.users) ──────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT          NOT NULL,
  email         TEXT          NOT NULL,
  profile_type  TEXT          DEFAULT 'investor' CHECK (profile_type IN ('investor','seller','renter','developer','other')),
  phone         TEXT,
  bio           TEXT,
  profile_photo TEXT,
  cash_holdings NUMERIC(12,2) DEFAULT 5000.00,
  member_since  DATE          DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- ── REITs ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reits (
  id             SERIAL PRIMARY KEY,
  name           TEXT          NOT NULL,
  type           TEXT          NOT NULL CHECK (type IN ('residential','commercial','mixed','luxury','industrial','student')),
  location       TEXT          NOT NULL,
  share_price    NUMERIC(10,2) NOT NULL,
  annual_return  NUMERIC(5,2)  NOT NULL,
  risk_level     TEXT          NOT NULL CHECK (risk_level IN ('low','medium','high')),
  description    TEXT,
  image_url      TEXT,
  created_at     TIMESTAMPTZ   DEFAULT NOW()
);

-- ── Portfolio ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portfolio (
  id           SERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reit_id      INT  NOT NULL REFERENCES public.reits(id) ON DELETE CASCADE,
  shares_owned INT  DEFAULT 0,
  buy_price    NUMERIC(10,2) NOT NULL,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','pending')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Transactions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id         SERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reit_id    INT  NOT NULL REFERENCES public.reits(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('buy','sell','dividend')),
  shares     INT  DEFAULT 0,
  amount     NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Share Orders ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.share_orders (
  id           SERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reit_id      INT  NOT NULL REFERENCES public.reits(id) ON DELETE CASCADE,
  shares       INT  NOT NULL,
  price_each   NUMERIC(10,2) NOT NULL,
  total        NUMERIC(12,2) NOT NULL,
  status       TEXT DEFAULT 'completed' CHECK (status IN ('pending','completed','cancelled')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Listings (Sell form) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.listings (
  id             SERIAL PRIMARY KEY,
  user_id        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  full_name      TEXT NOT NULL,
  id_type        TEXT NOT NULL CHECK (id_type IN ('cin','passport')),
  id_number      TEXT NOT NULL,
  property_type  TEXT,
  address        TEXT NOT NULL,
  surface_area   NUMERIC(8,2),
  asking_price   NUMERIC(12,2),
  listing_mode   TEXT DEFAULT 'one' CHECK (listing_mode IN ('one','multi')),
  num_properties INT  DEFAULT 1,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contact Messages ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  profile    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Rent Applications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rent_applications (
  id             SERIAL PRIMARY KEY,
  user_id        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  property_id    TEXT,
  property_title TEXT,
  full_name      TEXT,
  email          TEXT,
  phone          TEXT,
  message        TEXT,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Rental Properties ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rental_properties (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  city       TEXT NOT NULL,
  state      TEXT,
  type       TEXT,
  surface    INT,
  rooms      INT,
  price      NUMERIC(10,2) NOT NULL,
  image_url  TEXT,
  available  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Buy Offers (from buy.php) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.buy_offers (
  id                SERIAL PRIMARY KEY,
  user_id           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  property_title    TEXT,
  property_location TEXT,
  property_price    NUMERIC(12,2),
  offer_amount      NUMERIC(12,2) NOT NULL,
  full_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  message           TEXT,
  status            TEXT DEFAULT 'pending',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buy_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Users: can read and update own row
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolio: own rows
CREATE POLICY "Portfolio own" ON public.portfolio FOR ALL USING (auth.uid() = user_id);

-- Transactions: own rows
CREATE POLICY "Transactions own" ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Share orders: own rows
CREATE POLICY "Share orders own" ON public.share_orders FOR ALL USING (auth.uid() = user_id);

-- Listings: own rows + insert for anyone
CREATE POLICY "Listings own read" ON public.listings FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Listings insert" ON public.listings FOR INSERT WITH CHECK (true);

-- Rent applications: own rows + insert for anyone
CREATE POLICY "Rent apps own" ON public.rent_applications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Rent apps insert" ON public.rent_applications FOR INSERT WITH CHECK (true);

-- Buy offers: own rows + insert for anyone
CREATE POLICY "Buy offers insert" ON public.buy_offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Buy offers own" ON public.buy_offers FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- REITs: public read
CREATE POLICY "REITs public read" ON public.reits FOR SELECT USING (true);

-- Rental properties: public read
CREATE POLICY "Rental props public read" ON public.rental_properties FOR SELECT USING (true);

-- Contact messages: insert only
CREATE POLICY "Contact insert" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- ============================================================
--  Seed Data
-- ============================================================

INSERT INTO public.reits (name, type, location, share_price, annual_return, risk_level, description, image_url) VALUES
('Tunis Résidentiel REIT',     'residential', 'Tunis',   120.00,  7.2, 'low',    'A diversified residential portfolio across northern Tunis suburbs.',           'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'),
('Sfax Commercial REIT',       'commercial',  'Sfax',    250.00,  9.5, 'medium', 'Office buildings and retail spaces in central Sfax business district.',        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80'),
('Sousse Luxury REIT',         'luxury',      'Sousse',  500.00, 13.1, 'high',   'Premium beachfront villas and holiday apartments in Sousse.',                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'),
('Bizerte Mixed REIT',         'mixed',       'Bizerte',  80.00,  6.8, 'low',    'A mix of residential apartments and small commercial units in Bizerte.',       'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'),
('Grand Tunis Industrial REIT','commercial',  'Tunis',   180.00,  8.4, 'medium', 'Warehouses and logistics hubs on the outskirts of greater Tunis.',             'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80'),
('Sousse Student REIT',        'student',     'Sousse',   60.00,  6.2, 'low',    'Student housing near major universities in Sousse and Monastir.',              'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80')
ON CONFLICT DO NOTHING;

INSERT INTO public.rental_properties (title, city, state, type, surface, rooms, price, image_url) VALUES
('Apartment in La Marsa',   'Tunis — La Marsa',          'tunis',   'S+2',  95,  3, 1200, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'),
('Villa in Sousse',          'Sousse — Hammam Sousse',    'sousse',  'Villa',220, 5, 3500, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'),
('Studio in Sfax Centre',    'Sfax — Centre Ville',       'sfax',    'S+1',  55,  2, 600,  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80'),
('Apartment in Ariana',      'Ariana — Ariana Ville',     'ariana',  'S+3', 130,  4, 1800, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80'),
('Studio in Bizerte',        'Bizerte — Centre',          'bizerte', 'S+0',  38,  1, 450,  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80'),
('Apartment in Nabeul',      'Nabeul — Hammamet',         'nabeul',  'S+2', 100,  3, 1000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80'),
('Apartment in Monastir',    'Monastir — Skanes',         'monastir','S+1',  65,  2, 750,  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80'),
('Large Apartment in Tunis', 'Tunis — Les Berges du Lac', 'tunis',   'S+4', 180,  5, 2800, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80')
ON CONFLICT DO NOTHING;

-- ============================================================
--  Admin Policies — Run these in Supabase SQL Editor
--  to allow admin to read all data
-- ============================================================

-- Allow reading all users (for admin dashboard)
CREATE POLICY "Admin read all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE profile_type = 'admin'
    )
    OR true  -- Remove 'OR true' in production, add proper admin check
  );

-- Allow admin to read all listings
CREATE POLICY "Admin read all listings" ON public.listings
  FOR SELECT USING (true);

CREATE POLICY "Admin update listings" ON public.listings
  FOR UPDATE USING (true);

CREATE POLICY "Admin delete listings" ON public.listings
  FOR DELETE USING (true);

-- Allow admin to read all buy_offers
CREATE POLICY "Admin read buy_offers" ON public.buy_offers
  FOR SELECT USING (true);

CREATE POLICY "Admin update buy_offers" ON public.buy_offers
  FOR UPDATE USING (true);

-- Allow admin to read all rent_applications
CREATE POLICY "Admin read rent_apps" ON public.rent_applications
  FOR SELECT USING (true);

CREATE POLICY "Admin update rent_apps" ON public.rent_applications
  FOR UPDATE USING (true);

-- Allow admin to read all transactions
CREATE POLICY "Admin read transactions" ON public.transactions
  FOR SELECT USING (true);

-- Allow admin to read all portfolio
CREATE POLICY "Admin read portfolio" ON public.portfolio
  FOR SELECT USING (true);

-- Quick way to make yourself admin:
-- UPDATE public.users SET profile_type = 'admin' WHERE email = 'your@email.com';
