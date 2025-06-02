import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { StatusBarComponent } from "../status-bar/status-bar.component";
import { GameStatsBarComponent } from "../game-stats-bar/game-stats-bar.component";
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

export interface stats {
  numXwins: number;
  numOwins: number;
  numTies: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'tikTackToe';
  // gameStatus:string = "It's X's turn"

  // gameStats:stats = {
  // numXwins: 0,
  // numOwins: 0,
  // numTies: 0
 //}

  // handleStatusChange(newStatus: string){
  //   this.gameStatus = newStatus
  // }

  // handleGameStatsChange(newStats: stats){
  //   this.gameStats = newStats

  //   console.log('from app:')
  //   console.log(newStats)
  // }

  // handleNewGameClick(){
  //   //send to child to clear board
  // }
}
