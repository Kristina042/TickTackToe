import { Component, EventEmitter, Output, input, SimpleChanges, effect} from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import { getPlayerPosition, board_cell, checkWinner} from '../../utils/boardUtils/board';

export type stats = {
  numXwins: number,
  numOwins: number,
  numTies: number
}

@Component({
  selector: 'app-multiplayer-board',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './multiplayer-board.component.html',
  styleUrl: './multiplayer-board.component.scss'
})
export class MultiplayerBoardComponent {
  @Output() updateStatusBar = new EventEmitter()
  @Output() updateGameState = new EventEmitter()


  max_rows = input(0)
  max_columns = input<number>(0)
  step_count = input<number>(0)
  resetBoard = input<boolean>(false)
  board = input<board_cell[][]>([])
  isUserX = input<boolean>()
  isBoardDisabled = input<boolean>()
  winner = input<'X' | 'O' | 'tie' | null>(null)

  BoardItems = this.board().flat();

  constructor() {
    effect(() => {
     // const value = this.isUserX()
      this.renderStatusBar()
    })
  }

  ngOnInit(){
    console.log('is User X: ', this.isUserX())
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['board']) {
      this.BoardItems = this.board().flat()
    }
  }

  getElementById(id: number,  cell_count_per_row: number){
    const player = getPlayerPosition(id, cell_count_per_row)
    return this.board()[player.rowIndex][player.columnIndex]
  }

  updateButtonDisplay(id:number, cell_count_per_row: number){
    const player = getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board()[player.rowIndex][player.columnIndex]

    boardElement.display = this.isUserX() ? 'X' : 'O'

  }

  handlePlayerTurn(ButtonId: number) {
    this.updateButtonDisplay(ButtonId, this.max_rows())

    //should return 'x' | 'o' | 'tie' |null
    const winner = this.checkForWinner(ButtonId)



    const currentMove = { player: this.isUserX() ? 'X' : 'O', cellId: ButtonId}
    this.updateGameState.emit({board: this.board(), history: currentMove, winner: winner})
  }

  checkForWinner(ButtonId: number) {
    const result = checkWinner(ButtonId, this.max_rows(), this.step_count(), this.board())
    console.log(result)

    this.highlightIdArray(result.winningIds, this.max_rows())
    return result.winner

    //const isGameOver = (winner:'X'|'O'|'') => {
      // const GameIsNotOver = (winner === '') && (this.turnCount < this.max_columns()*this.max_rows())
      // if (GameIsNotOver) return false

      //const message = (winner === '') ? `It's a tie!` : `${winner} is the winner!`

      //this.updateStatusBar.emit(message)
      //this.highlightIdArray(result.winningIds, this.max_rows())

      //return true
    //}

    //if (isGameOver(result.winner as '' | 'X' | 'O'))
      //return
  }

  highlightIdArray(ids:number[], cell_count_per_row: number){
    ids.forEach((id) => {
      const {rowIndex, columnIndex} = getPlayerPosition(id, cell_count_per_row)
      this.board()[rowIndex][columnIndex].isHighlighted = true
    })
  }

  renderStatusBar() {
    let message = ''

    if (this.isUserX() && this.isBoardDisabled())
      message = `It's O's turn`

    if (this.isUserX() && !this.isBoardDisabled())
      message = `It's X's turn`

    if (!this.isUserX() && this.isBoardDisabled())
      message = `It's X's turn`

    if (!this.isUserX() && !this.isBoardDisabled())
      message = `It's O's turn`

    if(this.winner() === 'X')
      message = `X won!`

    if(this.winner() === 'O')
      message = `O won!`

    this.updateStatusBar.emit(message)
  }
}
