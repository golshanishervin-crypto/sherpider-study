import { createClient } from '@supabase/supabase-js'

// آدرس پروکسی (ورکر) که توی کلادفلر ساختی
const supabaseUrl = 'https://supabase-proxy.golshanishervin.workers.dev' 

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('خطا: متغیرهای محیطی Supabase تنظیم نشده‌اند.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)