import { createClient } from '@supabase/supabase-js';

// Configuration for the Supabase Client
const supabaseUrl = 'https://zbvdrcjlozqayuslqtht.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidmRyY2psb3pxYXl1c2xxdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTgxMzgsImV4cCI6MjA4MDc5NDEzOH0.pSFVVsoxMsep3JfCEMMoa-eOE164bo_guhakzKOJ_m0';

export const supabase = createClient(supabaseUrl, supabaseKey);

/* 
  IMPORTANT: SQL TO RUN IN SUPABASE EDITOR
  
  create table users (
    id uuid default gen_random_uuid() primary key,
    username text unique not null,
    password text not null,
    name text,
    role text,
    is_assessment_complete boolean default false,
    teacher_username text,
    parent_name text,
    parent_contact text,
    linked_student_username text,
    report jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Enable RLS
  alter table users enable row level security;

  -- Create generic policies (for prototype/demo purposes)
  create policy "Enable read access for all users" on users for select using (true);
  create policy "Enable insert access for all users" on users for insert with check (true);
  create policy "Enable update access for all users" on users for update using (true);
*/