import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { StatusBarComponent } from '../../status-bar/status-bar.component';
import { MultiplayerBoardComponent } from '../multiplayer-board/multiplayer-board.component';
import { AuthService } from '../../services/auth.service';
import { RealtimeService } from '../../services/realtime-.service';
import { board_cell, create_board } from '../../utils/boardUtils/board';
import { ChangeDetectorRef } from '@angular/core';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-multiplayer-game',
  imports: [StatusBarComponent, MultiplayerBoardComponent, StatusBarComponent],
  templateUrl: './multiplayer-game.component.html',
  styleUrl: './multiplayer-game.component.scss'
})

export class MultiplayerGameComponent {
  route = inject(ActivatedRoute)
  gameService = inject(GameService)
  authService = inject(AuthService)
  router = inject(Router)
  realtimeService = inject(RealtimeService)
  changeDetector = inject(ChangeDetectorRef)

  gameType = '3x3'; gameId = 0
  boardSize = 3; stepCount = 3

  resetBoardTrigger = false;
  gameStatus: string = "It's X's turn"

  boardState: board_cell[][] = []
  isUserX: boolean = true
  isBoardDisabled = false
  winner: 'X' | 'O' | 'tie' | null = null
  count: number = 0

  opponentId = null

  opponentName = '...'

  ngOnInit(){
    this.RenderBoard()
    this.retrieveBoardState()
    this.updatePlayersInDatabase()
    this.toggleBoardAccess()
    this.subscribeToWebSocket()
  }

  retrieveBoardState(){
    this.gameService.getBoardStateByGameId(this.gameId).subscribe(res => {
      const board:board_cell[][] = res
      this.boardState = [...board]
    })
  }

  toggleBoardAccess() {
    this.gameService.getCurrGameData(this.gameId)
    .subscribe(res => {
      const currPlayerId = this.authService.currentUser?.Id

      if(res.player_x_id === currPlayerId) {
        this.isUserX = true
      }

      if (res.player_o_id === currPlayerId) {
        this.isUserX = false
      }

      if (res.history.player === 'unset') {
        if (this.isUserX)
          this.isBoardDisabled = false
        else
          this.isBoardDisabled = true

        return
      }

      if (((res.history.player === 'X') && (this.isUserX)) || ((res.history.player === 'O') && (!this.isUserX))){

        this.isBoardDisabled = true
      } else {
        this.isBoardDisabled = false
      }

      if ((res.winner === 'O') || (res.winner === 'X'))
        this.isBoardDisabled = true

      this.count = res.count

      if (this.count >= 9)
        this.isBoardDisabled = true

      this.winner = res.winner

      //get opponents name
      if (this.isUserX) {
        this.opponentId = res.player_o_id
      } else {
        this.opponentId = res.player_x_id
      }

      if (this.opponentName !== null) {
        this.authService.getNameById(this.opponentId).pipe()
        .subscribe(name  => {
          this.opponentName = name
          console.log(name)
        })
      }

      this.changeDetector.detectChanges()
    })
  }

  subscribeToWebSocket() {
    this.realtimeService.subscribeToMessages(this.gameId)
    this.realtimeService.messages$.subscribe(messages => {

      const oldBoard = this.boardState
      const newBoard = messages.board_state

      if(!this.deepEqual(oldBoard, newBoard)) {
        this.boardState = [...newBoard]
      }

      //detect is user x or not
      const currPlayerId = this.authService.currentUser?.Id

      if(messages.player_x_id === currPlayerId) {
        this.isUserX = true
      }

      if (messages.player_o_id === currPlayerId) {
        this.isUserX = false
      }

      if ((messages.history.player === 'X') && (!this.isUserX)) {
        this.isBoardDisabled = false
      }

      if ((messages.history.player === 'O') && (!this.isUserX)) {
        this.isBoardDisabled = true
      }

      if ((messages.history.player === 'X') && (this.isUserX))
        this.isBoardDisabled = true

      if ((messages.history.player === 'O') && (this.isUserX))
        this.isBoardDisabled = false

      if ((messages.winner === 'O') || (messages.winner === 'X'))
        this.isBoardDisabled = true

      this.count = messages.count

      if (this.count >= this.boardSize*this.boardSize)
        this.isBoardDisabled = true

      this.winner = messages.winner

      //get opponents name
      if (this.isUserX) {
        this.opponentId = messages.player_o_id
      } else {
        this.opponentId = messages.player_x_id
      }

      if (this.opponentName !== null) {
        this.authService.getNameById(this.opponentId).pipe()
        .subscribe(name  => {
          this.opponentName = name
          console.log(name)
        })
      }

      this.changeDetector.detectChanges()

    })
  }

  deepEqual(obj1: board_cell[][], obj2: board_cell[][]) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  RenderBoard() {
    this.gameType = this.route.snapshot.params['game_type']
    this.gameId = this.route.snapshot.params['game_id']

    if (this.gameType === '5x5') {
      this.boardSize = 5; this.stepCount = 3
      return
    } else if (this.gameType === '10x10') {
      this.boardSize = 10; this.stepCount = 4
      return
    } else if (this.gameType === '3x3') {
       this.boardSize = 3; this.stepCount = 3
       return
    }

    this.changeDetector.detectChanges()
  }

  updatePlayersInDatabase() {
    const currPlayerId = this.authService.currentUser?.Id

    this.gameService.getCurrGameData(this.gameId).subscribe(res => {

      if ((currPlayerId === res.player_x_id) || (currPlayerId === res.player_o_id))
        return

      if(res.player_x_id === null) {
        this.isUserX = true
        this.gameService.updateGame(this.gameId, { player_x_id: currPlayerId }).subscribe()
        this.changeDetector.detectChanges()
        return

      } else if (res.player_o_id === null) {
        console.log('player o is null')
        this.isUserX = false
        this.gameService.updateGame(this.gameId, { player_o_id: currPlayerId }).subscribe()
        this.changeDetector.detectChanges()
        return
      }
      else if ((res.player_x_id !== currPlayerId) && (res.player_o_id !== currPlayerId)) {
        this.router.navigate(['/'])
        return
      }
    })
  }

  updateGame(data: any) {

    const dataToUpdate = {
      board_state: data.board,
      history: data.history,
      winner: data.winner,
      count: data.count
    }

    this.gameService.updateGame(this.gameId, dataToUpdate).subscribe()

  }

  handleStatusChange(newStatus: string){
    this.gameStatus = newStatus
  }

  navigateToHome(){
    this.router.navigate(["/"])
  }

  ngOnDestroy(): void {
    this.realtimeService.unsubscribe();
  }
}
