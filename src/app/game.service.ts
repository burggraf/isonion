import { Injectable } from '@angular/core';
import { SupaService } from './supa.service';
import { UserService } from './user.service';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';

export interface Question {
  id: string;
  text: string;
  label: number;
  result: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private supabase: SupabaseClient;
  public user: User;
  public session: Session;
  public question: Question = null;
  public wins: number = 0;
  public rounds: number = 0;
  public gameid: string = null;

  constructor(private supaService: SupaService) { 
    this.supabase = supaService.supabase;
    this.loadUser();
  }

  public async getQuestion() {
    const { data, error } = await this.supabase
    .from('onion')
    .select('id, text, label')
    .order('id', { ascending: true })
    .filter('id', 'gte', this.uuid() /* random uuid */)
    .limit(1);
    if (!error && data.length > 0) {
      this.question = {
        id: data[0].id,
        text: data[0].text,
        label: data[0].label,
        result: null
      }
    } else {
      console.error('getQuestion() error', error);
    }
  }

  submitAnswer(answer) {
    let retval;
    if (this.question.label === answer) { // correct!
      retval = true;
      this.wins++;
      this.question.result = true;
    } else { // incorrect!
      retval = false;
      this.question.result = false;
    }
    this.rounds++;
    this.saveResult(this.question.id, this.question.result);
    return retval;
  }

  private async saveResult(id: string, result: boolean) {
    if (!this.supabase.auth.user()) {
      // not logged in
      return;
    }
    if (!this.gameid) {
      const { data, error } = await this.supabase
      .from('onion_game')
      .select('id');
      if (error) {
        console.error('error getting onion_game', error);
      } else {
        if (data.length === 0) {
          const { data, error } = await this.supabase
          .from('onion_game')
          .insert([
            { userid: this.supabase.auth.user().id }
          ]);  
          if (error) {
            console.error('error creating onion_game', error);
          } else {
            this.gameid = data[0].id;
          }       
        } else {
          this.gameid = data[0].id;
        }
      }
    }
    console.log('gameid is', this.gameid);
    const { data, error } = await this.supabase
    .from('onion_game_data')
    .insert([
      { gameid: this.gameid, itemid: id, correct:(result?1:0) }
    ]);  
    if (error) {
      console.error('error on insert of onion_game_data',error);
    }
  }

  async loadUser() {
    this.user = this.supabase.auth.user();
  }

  public uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      let random = Math.random() * 16 | 0;
      let value = char === "x" ? random : (random % 4 + 8);
      return value.toString(16);     
    });
  }



}
