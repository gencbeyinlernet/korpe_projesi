
import { createClient } from '@supabase/supabase-js';

// Yeni Supabase Proje Bilgileri (Project ID: valmmufubkndxcygnrgk)
const supabaseUrl = 'https://valmmufubkndxcygnrgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbG1tdWZ1YmtuZHhjeWducmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDUzMDEsImV4cCI6MjA4MjkyMTMwMX0.nSYqpsNd3EFFl-F_9D5XaWMaDW-fYY3VnLbLW7udUAA';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * VERİTABANI KURULUMU (SQL)
 * Eğer 'public.users' tablosu bulunamadı hatası alıyorsanız, 
 * aşağıdaki kodu Supabase SQL Editor'da (Dashboard > SQL Editor > New Query) çalıştırın:
 * 
 * CREATE TABLE IF NOT EXISTS public.users (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   username TEXT UNIQUE NOT NULL,
 *   password TEXT NOT NULL,
 *   name TEXT,
 *   role TEXT,
 *   is_assessment_complete BOOLEAN DEFAULT false,
 *   teacher_username TEXT,
 *   parent_name TEXT,
 *   parent_contact TEXT,
 *   linked_student_username TEXT,
 *   report JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
 * );
 * 
 * -- Herkesin kayıt olabilmesi ve verileri okuyabilmesi için RLS politikaları:
 * ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Herkes okuyabilir" ON public.users FOR SELECT USING (true);
 * CREATE POLICY "Herkes ekleyebilir" ON public.users FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Herkes güncelleyebilir" ON public.users FOR UPDATE USING (true);
 */
