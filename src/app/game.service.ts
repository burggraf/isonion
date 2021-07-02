import { Injectable } from '@angular/core';
import { Session, SupabaseClient, User } from '@supabase/supabase-js';

import { SupaService } from './supa.service';
import { UserService } from './user.service';

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


    const { data, error, count } = await this.supabase
    .from('onion_game_data')
    .select('*', {count: 'exact', head: true});
    console.log('COUNT', data, error, count );
  */

    // ID,Season,EpisodeNo,Title,AirDate,Writers,Director,SEID

    /*
    https://kgzezkwudiygabyfvfjj.supabase.co/rest/v1/episodes?select=season%2Cepisodeno%2Ctitle%2Cscripts%28*%29%2Cscripts.limit%3D1&limit=1&episodeno=gt.3&order=season%2Cepisodeno.asc.nullslast
    
    https://kgzezkwudiygabyfvfjj.supabase.co/rest/v1/episodes?
    select=season,episodeno,title,scripts(*),scripts.limit=1&limit=1&episodeno=gt.3&order=season,
    episodeno.asc.nullslast
    */

    /*
    const { data, error } = await this.supabase
    .from('episodes')
    .select()
    .order('season', { ascending: false })
    .order('episodeno', { ascending: false })
    .limit(20)
    */

    /*
    const { data, error } = await this.supabase
    .from('episodes')
    .select(`
    season,
    episodeno,
    title,
    scripts(*)
    `)
    .limit(1)
    .gt('episodeno', 3)
    .order('season,episodeno')
    */

/*
    const { data, error } = await this.supabase
    .from('scripts')
    .select(`
    character,
    dialogue,
    episodes (
      season, episodeno, title
    )
    `)
    .limit(3)
    .eq('season', 1)
    .eq('episodeno', 4)
    .order('id')
*/


    // .or('season.is.null,episodeno.is.null')
    //.or('season.eq.6,season.eq.7')
    //.or('episodeno.eq.1,episodeno.eq.2')
    // GET /people?and=(grade.gte.90,student.is.true,or(age.gte.14,age.is.null)) HTTP/1.1
    // .or('total.lt.1,total.gt.15')
    // .or('billingcity.eq.Budapest,billingcity.eq.Dublin,billingcity.eq.Madison')
    
    
    //console.log(JSON.stringify(data,null,2));

  }

  private async saveResult(id: string, result: boolean) {
    // this.test_json();
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
