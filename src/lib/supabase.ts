import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://jhhjeilyrgydnmamklbf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoaGplaWx5cmd5ZG5tYW1rbGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODY0NzIsImV4cCI6MjA0NzI2MjQ3Mn0.SbO1w3FgChOMnAmIFQJb9CRv_T2H6YlvQ1ulkp9WajM';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});
