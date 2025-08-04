import { Component, EventEmitter, Output, input, SimpleChanges} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { getPlayerPosition, board_cell, create_board, checkWinner } from '../utils/boardUtils/board';

export type stats = {
  numXwins: number,
  numOwins: number,
  numTies: number
}

@Component({
  selector: 'app-board',
  imports: [ ButtonComponent, CommonModule ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent {
  @Output() updateStatusBar = new EventEmitter()
  @Output() updateGameScore = new EventEmitter<stats>()
  @Output() sendClickUp = new EventEmitter()

  max_rows = input(0)
  max_columns = input<number>(0)
  step_count = input<number>(0)
  resetBoard = input<boolean>(false)

  wasTurnEven = true
  turnCount = 0
  isX = true

  gameStats:stats = {
    numXwins: 0,
    numOwins: 0,
    numTies: 0
  }

  isBoardDisabled = false
  board: board_cell[][] = new Array()

  BoardItems = this.board.flat();

  ngOnInit(){
    this.board = create_board(this.max_rows(), this.max_columns())
    this.BoardItems = this.board.flat()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetBoard']?.currentValue === true) {
      this.resetGameBoard();
    }
  }

  resetGameBoard() {
    this.isBoardDisabled = false
    this.turnCount = 0
    this.updateStatusBar.emit(`Its X's turn`)
    this.board = create_board(this.max_rows(), this.max_columns())
  }

  updateGameStats(valToIncrement: 'X'|'O'|''){
    if (valToIncrement === 'X') return this.gameStats.numXwins++

    if(valToIncrement === 'O') return this.gameStats.numOwins ++

    if (valToIncrement === '') return this.gameStats.numTies++

    return
  }

  getElementById(id: number,  cell_count_per_row: number){
    const player = getPlayerPosition(id, cell_count_per_row)
    return this.board[player.rowIndex][player.columnIndex]
  }

  updateCurrPlayerInfo() {
    this.wasTurnEven = !this.wasTurnEven
    this.isX = this.wasTurnEven ? true : false
  }

  updateButtonDisplay(id:number, cell_count_per_row: number){
    const player = getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board[player.rowIndex][player.columnIndex]

    boardElement.display = this.isX ? 'O' : 'X'
  }

  highlightIdArray(ids:number[], cell_count_per_row: number){
    ids.forEach((id) => {
      const {rowIndex, columnIndex} = getPlayerPosition(id, cell_count_per_row)
      this.board[rowIndex][columnIndex].isHighlighted = true
    })
  }

  handlePlayerTurn(id: number) {
    this.sendClickUp.emit(id)

    this.turnCount++

    this.updateCurrPlayerInfo()
    this.updateButtonDisplay(id, this.max_rows())

    const result = checkWinner(id, this.max_rows(), this.step_count(), this.board)

    const isGameOver = (winner:'X'|'O'|'') =>{
      const GameIsNotOver = (winner === '') && (this.turnCount < this.max_columns()*this.max_rows())
      if (GameIsNotOver) return false

      const message = (winner === '') ? `It's a tie!` : `${winner} is the winner!`

      this.updateGameStats(winner)
      this.updateStatusBar.emit(message)
      this.updateGameScore.emit(this.gameStats)
      this.highlightIdArray(result.winningIds, this.max_rows())
      this.isBoardDisabled = true

      return true
    }

    if (isGameOver(result.winner as '' | 'X' | 'O'))
      return

    const message = this.isX ? `It's X's turn` : `It's O's turn`
    this.updateStatusBar.emit(message)
  }
}