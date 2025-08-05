import { Component, EventEmitter, Output, input, SimpleChanges, effect} from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import { getPlayerPosition, board_cell, checkWinner, create_board} from '../../utils/boardUtils/board';

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

  BoardItems: board_cell[] = [];
  opponentName = input('...')

  constructor() {
    effect(() => {
      this.renderStatusBar()
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['board']) {
      this.BoardItems = this.board().flat()
    }
  }

  getElementById(id: number,  cell_count_per_row: number) {
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
    const isTie = (newCount >= this.max_columns()*this.max_rows()) && (winner === '')

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
    if((this.winner() === 'X') && (this.isUserX()))
      return this.updateStatusBar.emit(`you won!`)

    if((this.winner() === 'O') && (this.isUserX()))
      return this.updateStatusBar.emit(`${this.opponentName()} won!`)

    if((this.winner() === 'X') && (!this.isUserX()))
      return this.updateStatusBar.emit(`${this.opponentName()} won!`)

    if((this.winner() === 'O') && (!this.isUserX()))
      return this.updateStatusBar.emit(`you won!`)

    if(this.winner() === 'tie')
      return this.updateStatusBar.emit(`It's a tie`)

    if (this.isUserX() && this.isBoardDisabled())
      return this.updateStatusBar.emit(`It's O's turn`)

    if (this.isUserX() && !this.isBoardDisabled())
      return this.updateStatusBar.emit(`It's X's turn (yours)`)

    if (!this.isUserX() && this.isBoardDisabled())
      return this.updateStatusBar.emit(`It's X's turn`)

    if (!this.isUserX() && !this.isBoardDisabled())
      return this.updateStatusBar.emit(`It's O's turn (yours)`)
  }
}
