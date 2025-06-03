import { Component, input } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { StatusBarComponent } from '../status-bar/status-bar.component';
import { GameStatsBarComponent } from '../game-stats-bar/game-stats-bar.component';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export interface stats {
  numXwins: number;
  numOwins: number;
  numTies: number;
}

@Component({
  selector: 'app-num-by-num',
  imports: [BoardComponent, StatusBarComponent, GameStatsBarComponent],
  templateUrl: './num-by-num.component.html',
  styleUrl: './num-by-num.component.scss'
})
export class NumByNumComponent {

  num_rows = input<number>()
  num_columns = input<number>()

  private router = inject(Router);

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

  navigateToHome(){
     this.router.navigate(["/"])
  }
}
