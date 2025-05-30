import { Component, input } from '@angular/core';

export interface stats {
  numXwins: number;
  numOwins: number;
  numTies: number;
}

@Component({
  selector: 'app-game-stats-bar',
  imports: [],
  templateUrl: './game-stats-bar.component.html',
  styleUrl: './game-stats-bar.component.scss'
})
export class GameStatsBarComponent {
  stats = input<stats>()
}
