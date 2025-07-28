import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface stats {
  numXwins: number;
  numOwins: number;
  numTies: number;
}

@Component({
  selector: 'app-game-stats-bar',
  imports: [CommonModule],
  templateUrl: './game-stats-bar.component.html',
  styleUrl: './game-stats-bar.component.scss'
})

export class GameStatsBarComponent {
  stats = input<stats>()
}
