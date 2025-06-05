import { Component, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { input } from '@angular/core';

import { stats} from '../utils/boardUtils/statusBars';
import { getPlayerPosition, board_cell, create_board } from '../utils/boardUtils/board';
import { checkWinner } from '../utils/boardUtils/board';

@Component({
  selector: 'app-board',
  imports: [ ButtonComponent, CommonModule ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent {
  // TODO in this file I want to see only realted functions not definitions of them
  // Move functions to other folder like idk, modules, utils, came out with 
  // this file should have +/- 200 lines not 440 so reduce it by has max is 
  @Output() StatusEmitter = new EventEmitter()
  @Output() StatsEmitter = new EventEmitter<stats>() 

  max_rows = input(0) 
  max_columns = input<number>(0)
  step_count = input<number>(0)

  //first turn is X - odd
  //X - goes on odd turns
  //O - goes on even turns 
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

  flattenedBoard = this.board.flat();

  ngOnInit(){
    this.board = create_board(this.max_rows(), this.max_columns())
    this.flattenedBoard = this.board.flat()
  }

  // what about 3x ifs with return statement?
  updateGameStats(valToIncrement: 'X'|'O'|'tie'){
    if (valToIncrement === 'X') return this.gameStats.numXwins++

    if(valToIncrement === 'O') return this.gameStats.numOwins ++
    
    if (valToIncrement === 'tie') return this.gameStats.numTies++

    return
  }

  GetValueById(id: number,  cell_count_per_row: number){ 
    const player = getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board[player.rowIndex][player.columnIndex]
    return boardElement.display
  }

  getButtonColor(id: number, cell_count_per_row: number){
    const player = getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board[player.rowIndex][player.columnIndex]
    return boardElement.isHighlighted
  }

  updateCurrPlayerInfo(){
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
      let row = getPlayerPosition(id, cell_count_per_row).rowIndex
      let column = getPlayerPosition(id, cell_count_per_row).columnIndex
      this.board[row][column].isHighlighted = true
    })
  }

   sendMessageToStatusBar(message: string){
    this.StatusEmitter.emit(message)
  }

  sendMessageToGameStatsBar(gameStats: stats){
    this.StatsEmitter.emit(gameStats)
  }

  handleButtonClick (id: number) {
    this.turnCount++

    this.updateCurrPlayerInfo()
    this.updateButtonDisplay(id, this.max_rows())

    const Result = checkWinner(id, this.max_rows(), this.step_count(), this.board)

    if (Result.winner === 'X'){
      this.highlightIdArray(Result.winningIds, this.max_rows())
      this.updateGameStats('X')
      this.sendMessageToGameStatsBar(this.gameStats)
      this.sendMessageToStatusBar(`X is the winner!`)
      this.isBoardDisabled = true
      return
    }

    if (Result.winner === 'O'){
      this.highlightIdArray(Result.winningIds, this.max_rows())
      this.updateGameStats('O')
      this.sendMessageToGameStatsBar(this.gameStats)
      this.sendMessageToStatusBar(`O is the winner!`)
      this.isBoardDisabled = true
      return
    }

    if ((Result.winner === '') && (this.turnCount === this.max_columns()*this.max_rows())){
      this.sendMessageToStatusBar(`it's a tie!`)
      this.updateGameStats('tie')
      this.sendMessageToGameStatsBar(this.gameStats)
      this.isBoardDisabled = true
      return
    }

    if (this.isX)
      this.sendMessageToStatusBar(`It's X's turn`)
    else
      this.sendMessageToStatusBar(`It's O's turn`)
  }
}