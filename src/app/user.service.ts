import { Injectable } from '@angular/core';
import { SupaService } from './supa.service';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;
  public user: User;
  public session: Session;

  constructor(private supaService: SupaService) { 
    this.supabase = supaService.supabase;
    this.loadUser();
  }

  public async register(email: string, pw: string) {    
    const { user, session, error } = await this.supabase.auth.signUp({
      email: email,
      password: pw,
    });
    if (error) {
      console.error('** registration error', error);
      return { user, session, error};
    } else {
      this.user = user;
      this.session = session;
      return { user, session, error};
    }
  }

  public async signIn(email: string, pw: string) {
    const { user, session, error } = await this.supabase.auth.signIn({
      email: email,
      password: pw,
    });
    if (error) {
      console.error('** signIn error', error);
      return { user, session, error};
    } else {
      this.user = user;
      this.session = session;
      return { user, session, error};
    }
  }

  public async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('signOut error', error);
    } else {
      return { error };
    }
  }

  
  async loadUser() {
    // const user = await this.supabase.auth.user();
    this.user = this.supabase.auth.user();
  }
  


}

