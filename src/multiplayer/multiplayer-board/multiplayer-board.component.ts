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
  count = input<number>(0)

  BoardItems = this.board().flat();

  constructor() {
    effect(() => {
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

    const winner = this.checkForWinner(ButtonId)

    const newCount = this.count() + 1
    const isTie = (newCount >= 9) && (winner === '')

    const currentMove = { player: this.isUserX() ? 'X' : 'O', cellId: ButtonId}
    this.updateGameState.emit({board: this.board(), history: currentMove, winner: isTie ? 'tie' : winner, count: newCount})
  }

  checkForWinner(ButtonId: number) {
    const result = checkWinner(ButtonId, this.max_rows(), this.step_count(), this.board())

    this.highlightIdArray(result.winningIds, this.max_rows())
    return result.winner
  }

  highlightIdArray(ids:number[], cell_count_per_row: number){
    ids.forEach((id) => {
      const {rowIndex, columnIndex} = getPlayerPosition(id, cell_count_per_row)
      this.board()[rowIndex][columnIndex].isHighlighted = true
    })
  }

  renderStatusBar() {
    let message = ''

    if(this.winner() === 'X')
      message = `X won!`

    if(this.winner() === 'O')
      message = `O won!`

    if(this.winner() === 'tie')
      message = `It's a tie`

    if (this.isUserX() && this.isBoardDisabled())
      message = `It's O's turn`

    if (this.isUserX() && !this.isBoardDisabled())
      message = `It's X's turn`

    if (!this.isUserX() && this.isBoardDisabled())
      message = `It's X's turn`

    if (!this.isUserX() && !this.isBoardDisabled())
      message = `It's O's turn`

    this.updateStatusBar.emit(message)
  }
}
