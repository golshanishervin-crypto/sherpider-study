import { createClient } from '@supabase/supabase-js'

// آدرس پروکسی کلادفلر
const supabaseUrl = 'https://supabase-proxy.golshanishervin.workers.dev'

// کلید anon رو از داشبورد Supabase کپی کن و اینجا بذار
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwYWdrdXJhbWR4b3VhdmF2ZXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNDk0ODIsImV4cCI6MjEwOTYyNTQ4Mn0.Buy_7h0jtmD_Ajg6UUl4SNHtkT7QyrsR3hCi--LPL90'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
