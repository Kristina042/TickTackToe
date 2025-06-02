import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { StatusBarComponent } from "../status-bar/status-bar.component";
import { GameStatsBarComponent } from "../game-stats-bar/game-stats-bar.component";

export interface stats {
  numXwins: number;
  numOwins: number;
  numTies: number;
}

@Component({
  selector: 'app-three-by-three',
  imports: [BoardComponent, StatusBarComponent, GameStatsBarComponent],
  templateUrl: './three-by-three.component.html',
  styleUrl: './three-by-three.component.scss'
})
export class ThreeByThreeComponent {
  gameStatus:string = "It's X's turn"
  
    gameStats:stats = {
    numXwins: 0,
    numOwins: 0,
    numTies: 0
   }
  
    handleStatusChange(newStatus: string){
      this.gameStatus = newStatus
    }
  
    handleGameStatsChange(newStats: stats){
      this.gameStats = newStats
  
      console.log('from app:')
      console.log(newStats)
    }
  
    handleNewGameClick(){
      //send to child to clear board
    }
}
