import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public selectedAnswer = null;

  constructor(public gameService: GameService) {}

  start() {
    console.log('** start game');
    this.gameService.getQuestion();
  }

  submitAnswer(answer) {
    this.selectedAnswer = answer;
    const result = this.gameService.submitAnswer(answer);
    if (result) {

    } else {

    }
  }
  next() {
    this.selectedAnswer = null;
    this.gameService.getQuestion();
  }

}
