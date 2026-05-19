import { createClient } from '@supabase/supabase-js'

// Admin client uses service role key — bypasses RLS completely
// Only used in Admin.jsx — never expose this key to regular users
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Fallback to anon key if service key not set
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceKey || import.meta.env.VITE_SUPABASE_ANON_KEY
)
