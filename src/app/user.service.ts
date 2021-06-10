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
  public gameid: string = null;

  constructor(private supaService: SupaService) { 
    this.supabase = supaService.supabase;
    /*
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('** onAuthStateChange', event, session);
    })
    */
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

      this.setGameId();

      return { user, session, error};
    }
  }

  public async signInWithFacebook() {
    const { user, session, error } = await this.supabase.auth.signIn({
      // provider can be 'github', 'google', 'gitlab', or 'bitbucket'
      provider: 'facebook'
    });
    if (error) {
      console.error('** signInWithFacebook error', error);
      return { user, session, error};
    } else {
      this.user = user;
      this.session = session;

      this.setGameId();

      return { user, session, error};
    }
  }

  public async signInWithGoogle() {
    const { user, session, error } = await this.supabase.auth.signIn({
      // provider can be 'github', 'google', 'gitlab', or 'bitbucket'
      provider: 'google'
    });
    if (error) {
      console.error('** signInWithGoogle error', error);
      return { user, session, error};
    } else {
      this.user = user;
      this.session = session;

      this.setGameId();

      return { user, session, error};
    }
  }

  public async signInWithGithub() {
    const { user, session, error } = await this.supabase.auth.signIn({
      // provider can be 'github', 'google', 'gitlab', or 'bitbucket'
      provider: 'github'
    });
    if (error) {
      console.error('** signInWithGithub error', error);
      return { user, session, error};
    } else {
      this.user = user;
      this.session = session;

      this.setGameId();

      return { user, session, error};
    }
  }

  public async signInWithApple() {
    const { user, session, error } = await this.supabase.auth.signIn({
      // provider can be 'github', 'google', 'gitlab', or 'bitbucket'
      provider: 'apple'
    });
    if (error) {
      console.error('** signInWithApple error', error);
      return { user, session, error};
    } else {
      this.user = user;
      this.session = session;

      this.setGameId();

      return { user, session, error};
    }
  }

  public async signInWithProvider(provider) {
    const { user, session, error } = await this.supabase.auth.signIn({
      // provider can be 'github', 'google', 'gitlab', or 'bitbucket'
      provider: provider
    });
    if (error) {
      console.error('** signInWithProvider error:', provider, error);
      return { user, session, error};
    } else {
      this.user = user;
      this.session = session;

      this.setGameId();

      return { user, session, error};
    }
  }


  public async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('signOut error', error);
    } else {
      this.user = null;
      this.session = null;
      this.gameid = null;
      return { error };
    }
  }

  async setGameId() {
      // get gameid
      const { data, error } = await this.supabase
      .from('onion_game')
      .select('id');
      if (error) {
        this.gameid = null;
        console.error('error getting onion_game', error);
      } else {
        if (data.length === 0) {
          const { data, error } = await this.supabase
          .from('onion_game')
          .insert([
            { userid: this.supabase.auth.user().id }
          ]);  
          if (error) {
            this.gameid = null;
            console.error('error creating onion_game', error);
          } else {
            this.gameid = data[0].id;
          }       
        } else {
          this.gameid = data[0].id;
        }
      }
  }

  async loadUser() {
    // const user = await this.supabase.auth.user();
    this.user = this.supabase.auth.user();
    this.setGameId();
  }
  


}

