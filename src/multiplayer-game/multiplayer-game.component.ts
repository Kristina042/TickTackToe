import { Component, inject } from '@angular/core';
import { NumByNumComponent } from '../num-by-num/num-by-num.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-multiplayer-game',
  imports: [NumByNumComponent],
  templateUrl: './multiplayer-game.component.html',
  styleUrl: './multiplayer-game.component.scss'
})
export class MultiplayerGameComponent {
  route = inject(ActivatedRoute)

  gameType = '3x3'; gameId = ''
  boardSize = 3; stepCount = 3

  ngOnInit(){
    this.RenderBoard()
  }

  RenderBoard() {
    this.gameType = this.route.snapshot.params['game_type']
    this.gameId = this.route.snapshot.params['game_id']

    if (this.gameType === '5x5') {
      this.boardSize = 5; this.stepCount = 3
    } else if (this.gameType === '10x10') {
      this.boardSize = 10; this.stepCount = 4
    }
  }
}
