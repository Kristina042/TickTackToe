import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { StatusBarComponent } from '../../status-bar/status-bar.component';
import { MultiplayerBoardComponent } from '../multiplayer-board/multiplayer-board.component';
import { skip } from 'rxjs';

@Component({
  selector: 'app-multiplayer-game',
  imports: [StatusBarComponent, MultiplayerBoardComponent, StatusBarComponent],
  templateUrl: './multiplayer-game.component.html',
  styleUrl: './multiplayer-game.component.scss'
})
export class MultiplayerGameComponent {
  route = inject(ActivatedRoute)
  gameService = inject(GameService)
  router = inject(Router)

  gameType = '3x3'; gameId = 0
  boardSize = 3; stepCount = 3

  resetBoardTrigger = false;
  gameStatus:string = "It's X's turn"

  boardState = []

  ngOnInit(){
    this.RenderBoard()
    this.retrieveBoardState()
  }

  retrieveBoardState(){
    this.gameService.getBoardStateByGameId(this.gameId).subscribe(res => {
      const board = JSON.parse(res)
      //console.log(board)
      this.boardState = board

    })
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

  updateGame(board: []) {
    console.log('board on clientside before update')
    console.log(board)

    const dataToUpdate = {
      board_state: board,
      history: {}
    }

    this.gameService.updateGame(this.gameId, dataToUpdate).subscribe(res => {
        console.log('board in supabase after update')
        console.log(res.data.board_state)
      }
    )
  }

  handleNewGameClick(){
    this.resetBoardTrigger = true;

    // Reset back to false to allow future resets
    setTimeout(() => this.resetBoardTrigger = false);
  }

  handleStatusChange(newStatus: string){
    this.gameStatus = newStatus
  }

  navigateToHome(){
    this.router.navigate(["/"])
  }
}
