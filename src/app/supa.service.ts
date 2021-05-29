import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
export const key = {
  SUPABASE_URL: "https://kgzezkwudiygabyfvfjj.supabase.co",
  // this is the anon key
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTI3MzE1OSwiZXhwIjoxOTM0ODQ5MTU5fQ.5CFoqR4D43KV4cdiFPTXJ-TvOncs2eXQDWx9BMrFuac',
};

@Injectable({
  providedIn: 'root'
})
export class SupaService {
  public supabase: SupabaseClient;

  constructor() { 
    this.supabase = createClient(key.SUPABASE_URL, key.SUPABASE_KEY);
  }
}
