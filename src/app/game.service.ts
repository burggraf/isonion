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
  /*
  INSERT into game_log (game_date, home_team, visiting_team, game_data)
values (
'2021-06-02',
'Chicago Cubs',
'San Diego Padres',
'{"winning_pitcher": "Alzolay", 
  "losing_pitcher": "Johnson", 
  "final_score": {
    "visitors": {"runs": 1, "hits": 5, "errors": 2}, 
    "home": {"runs": 6, "hits": 9, "errors": 0}
  }, 
  "innings": {
    "visitors": [0,0,0,1,0,0,0,0,0], 
    "home": [0,0,0,1,2,0,3,0]}
  }'
);
  */
  private async test_json() {
    /*
    const { data, error } = await this.supabase
    .from('game_log')
    .insert([{ 
      game_date: '2021-06-02',
      home_team: 'Chicago Cubs',
      visiting_team: 'San Diego Padres',
      game_data: {
        "winning_pitcher": "Alzolay", 
        "losing_pitcher": "Johnson", 
        "final_score": {
          "visitors": {"runs": 1, "hits": 5, "errors": 2}, 
          "home": {"runs": 6, "hits": 9, "errors": 0}
        }, 
        "innings": {
          "visitors": [0,0,0,1,0,0,0,0,0], 
          "home": [0,0,0,1,2,0,3,0]
        }
      }        
    }]);  
    console.log('insert game_log', data, error);

    SELECT 
      visiting_team, 
      game_data -> 'final_score' -> 'visitors' -> 'runs' as visitors_runs,
      home_team, 
      game_data -> 'final_score' -> 'home' -> 'runs' as home_runs
    FROM game_log;

    SELECT home_team, 
    game_data -> 'innings' -> 'home' -> 6 as seventh_inning
    FROM game_log;

    
    const { data, error } = await this.supabase
    .from('game_log')
    .select('home_team, seventh_inning_runs:game_data->innings->home->6');
    console.log(JSON.stringify(data,null,2));

    // SELECT textarray[1], array_length(textarray, 1) FROM arraytest;
    const { data, error } = await this.supabase
    .from('game_log')
    .select('json_result:game_data->winning_pitcher, text_result:game_data->>winning_pitcher');
    console.log(JSON.stringify(data,null,2));
  */
    
  }

  private async saveResult(id: string, result: boolean) {
    this.test_json();
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
