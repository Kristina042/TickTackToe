import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { Database } from '../types/supabase';

@Injectable({
  providedIn: 'root'
})
export class SupaBaseService {
   private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient<Database>(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}