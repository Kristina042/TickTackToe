import { Component, EventEmitter, Output, input, SimpleChanges} from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import { getPlayerPosition, board_cell, create_board, checkWinner } from '../../utils/boardUtils/board';

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

  wasTurnEven = true
  turnCount = 0
  isX = true

  isBoardDisabled = false

  BoardItems = this.board().flat();


  ngOnInit(){
    //this.BoardItems = this.board().flat()
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

  updateCurrPlayerInfo() {
    this.wasTurnEven = !this.wasTurnEven
    this.isX = this.wasTurnEven ? true : false
  }

  updateButtonDisplay(id:number, cell_count_per_row: number){
    const player = getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board()[player.rowIndex][player.columnIndex]

    boardElement.display = this.isX ? 'O' : 'X'

    console.log('onUpDateButton:')
    console.log(this.board())
    this.updateGameState.emit(this.board())
  }

  handlePlayerTurn(ButtonId: number) {
    this.turnCount++

    this.updateCurrPlayerInfo()
    this.updateButtonDisplay(ButtonId, this.max_rows())


    const message = this.isX ? `It's X's turn` : `It's O's turn`
    this.updateStatusBar.emit(message)
  }
}
