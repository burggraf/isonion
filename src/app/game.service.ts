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
  private currentGameID: string = null;

  constructor(private supaService: SupaService, private userService: UserService) { 
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

  async submitAnswer(answer) {
    let retval;
    if (this.currentGameID !== this.userService.gameid) {
      // reset scores
      await this.reset_rounds();
      await this.reset_wins();
      this.currentGameID = this.userService.gameid;
    }
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

  private async reset_rounds() {
    this.rounds = 0;
    const { data, error, count } = await this.supabase
      .from('onion_game_data')
      .select('correct', {count: 'exact', head: true});
    if (error) {
      console.error('error getting onion_game_count total rounds', error);
    } else {
      this.rounds = count;
    }
  }

  private async reset_wins() {
    this.wins = 0;
    const { data, error, count } = await this.supabase
      .from('onion_game_data')
      .select('correct', {count: 'exact', head: true})
      .eq('correct', 1);
    if (error) {
      console.error('error getting onion_game_count total wins', error);
    } else {
      this.wins = count;
    }
  }


  private async saveResult(id: string, result: boolean) {
    if (!this.userService.gameid) {
      // not logged in
      console.log('not logged in, cannot save result');
      return;
    }

    const { data, error } = await this.supabase
    .from('onion_game_data')
    .insert([
      { gameid: this.userService.gameid, itemid: id, correct:(result?1:0) }
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
