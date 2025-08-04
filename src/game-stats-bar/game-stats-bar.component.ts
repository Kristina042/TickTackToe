import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';

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
