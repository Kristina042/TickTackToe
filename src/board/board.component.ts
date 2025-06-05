import { Component, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { input } from '@angular/core';
import { getPlayerPosition } from '../utils/board';

type stats = {
  numXwins: number,
  numOwins: number,
  numTies: number
}

export interface board_cell {
  id:  number,
  display: 'X'|'O'|'',
  isHighlighted: boolean,
}

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

  // TODO: make it more clean, try to use new Array(new Array)
  create_board(board_width: number, board_heigth: number){
    const board = new Array
    let count = 0

    for (let i = 0; i < board_heigth; i++){
      const row = new Array

      for (let j = 0; j < board_width; j++){

        const cell: board_cell = {id: (j + count*board_width), display: '', isHighlighted: false}

        row.push(cell)
      }
      count++

      board.push(row)
    }
    return board
  }

  flattenedBoard = this.board.flat();

  ngOnInit(){
    this.board = this.create_board(this.max_rows(), this.max_columns())
    this.flattenedBoard = this.board.flat()
  }

  // what about 3x ifs with return statement?
  updateGameStats(valToIncrement: 'X'|'O'|'tie'){
    if (valToIncrement === 'X') return this.gameStats.numXwins++

    if(valToIncrement === 'O') return this.gameStats.numOwins ++
    
    if (valToIncrement === 'tie') return this.gameStats.numTies++

    return
  }
  
  // getPlayerPosition(id:number, cell_count_per_row: number){
  //   const rowIndex = Math.floor(id / cell_count_per_row)
  //   const columnIndex = Math.floor(id - rowIndex * cell_count_per_row)

  //   return{rowIndex, columnIndex}
  // }

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
  
  checkIdsForWin(idArr: number[], buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number){
    //check that ids to check lengh is at least STEP count
    if (idArr.length < step_count)
      return false

    idArr.sort((a, b) => a - b)

    console.log(`sorted ids to check: ${idArr}`)

    const result: boolean[] = new Array(idArr.length).fill(false)
    let result_index = 0

    //will be used in case of a win
    const winningIds: number[] = new Array()

    const checkIdArray = () => {
      idArr.forEach((id) => {
        let row = getPlayerPosition(id, cell_count_per_row).rowIndex
        let column = getPlayerPosition(id, cell_count_per_row).columnIndex

        if (this.board[row][column].display !== buttonValue){
          result[result_index] = false
          result_index++
          return
        }

        result[result_index] = true
        result_index++

        winningIds.push(id)
      })
    }

    
    const isWinner = () => {
      let count = 0

      for (let i = 0; i < result.length; i++){
        if (result[i] !== true){ 
          count = 0
          continue
        }

        count++
        if (count === (step_count))  return true
      }

      return false
    }

    checkIdArray()

    console.log(`bool of sorted ids: ${result}`)
    console.log('--------------------------------------------------------------------')

    if (isWinner() !== true)
      return false
    
    //highlight winning ids
    winningIds.forEach((id) => {
      let row = getPlayerPosition(id, cell_count_per_row).rowIndex
      let column = getPlayerPosition(id, cell_count_per_row).columnIndex
      this.board[row][column].isHighlighted = true
    })

    this.isBoardDisabled = true
    this.sendMessageToStatusBar(`${buttonValue} is the winner!`)
    this.updateGameStats(buttonValue)
    
    return true
  }

  didRowWin(currentIdx:number, buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number){
    const player = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = player.rowIndex
    const currColumn = player.columnIndex

    if (this.board[currRow][currColumn].display !==  buttonValue)
      return false

    const idsToCheck: number[] = []
    idsToCheck.push(currentIdx)

    const checkCellsRight = () => {
      let column = currColumn
      let id = currentIdx

      for(let i = 0; i < (step_count - 1); i++){
        column++; id++;

        if (column <= (cell_count_per_row - 1))
          idsToCheck.push(id)
      }
    }

    const checkCellsLeft = () => {
      let column = currColumn
      let id = currentIdx
      
      for (let i = 0; i < (step_count - 1); i++){
        column--; id--;

        if (column >= 0)
          idsToCheck.push(id)
      }
    }

    checkCellsRight()
    checkCellsLeft()
    
    if (this.checkIdsForWin(idsToCheck, buttonValue, cell_count_per_row, step_count))
      return true

    return false
  }   

  didColumnWin(currentIdx: number, buttonValue: 'X'|'O', cell_count_per_row: number, step_count: number){
    const player = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = player.rowIndex
    const currColumn = player.columnIndex

    if (this.board[currRow][currColumn].display !==  buttonValue)
      return false

    const idsToCheck: number[] = []
    idsToCheck.push(currentIdx)

    const checkCellsUp = () => {
      let row = currRow
      let id = currentIdx

      for (let i = 0; i < (step_count - 1); i++){
        row--
        id = id - cell_count_per_row

        if (row >= 0)
          idsToCheck.push(id)
      }
    }

    const checkCellsDown = () =>{
      let row = currRow
      let id = currentIdx

      for (let i = 0; i < (step_count - 1); i++){
        row++
        id = id + cell_count_per_row

        if (row <= (cell_count_per_row - 1))
          idsToCheck.push(id)
      }
    }

    checkCellsUp()
    checkCellsDown()

    if (this.checkIdsForWin(idsToCheck, buttonValue, cell_count_per_row, step_count))
    {
      console.log('column won!')
      return true
    }

    return false
  }


  // didDiagWin(id, 'X', 'bottomLeft->rightUp', this.max_rows(), this.step_count()

  didDiagWin(
    currentIdx: number,
    value: 'X' | 'O',
    direction: 'bottomLeft->rightUp'|'leftUp->bottomRight',
    cell_count_per_row: number,
    step_count: number
  ) {

    const currRow = getPlayerPosition(currentIdx, cell_count_per_row).rowIndex
    const currColumn = getPlayerPosition(currentIdx, cell_count_per_row).columnIndex

    if (this.board[currRow][currColumn].display !== value)
      return false

    const idMatrix: number[][] = this.board.map((row) => row.map((cell:board_cell) => cell.id))

    const idsToCheck: number[] = []

    idsToCheck.push(currentIdx)

    const checkCellsUp = () => {
      let row = currRow
      let column  = currColumn
        for (let i = 0; i < (step_count - 1); i++){

          if (direction === 'bottomLeft->rightUp') { 
            row--; column++

            if ((row >= 0) && (column <= (cell_count_per_row - 1)))
              idsToCheck.push(idMatrix[row][column])
          }
          else{
            row --; column --

            if ((row >= 0) && (column >= 0))
              idsToCheck.push(idMatrix[row][column])
          }
        }
      }
    
  
    
    const checkCellsDown = () => {
     let row = currRow
     let column = currColumn
      for (let i = 0; i < (step_count - 1); i++){

        // TODO here also too much nesting
        if (direction === 'bottomLeft->rightUp'){
          row++; column--

          if ((row <= (cell_count_per_row - 1)) && (column >= 0))
            idsToCheck.push(idMatrix[row][column])
        }
        else{
          row++; column++

          if ((row <= (cell_count_per_row - 1)) && (column<= (cell_count_per_row - 1)))
          idsToCheck.push(idMatrix[row][column])
        }
      }
    }
  

    checkCellsUp()
    checkCellsDown()

   if (this.checkIdsForWin(idsToCheck, value, cell_count_per_row, step_count))
    return true

   return false
  }

  checkWinner(id: number){
    // TODO uuu my fav, reduce compleixity of this huge if
    // TODO procedular strategy instead of this if
    if (!this.didRowWin(id, 'X', this.max_rows(), this.step_count()) && !this.didRowWin(id, 'O', this.max_rows(), this.step_count()) &&
      !this.didColumnWin(id, 'X', this.max_rows(), this.step_count()) && !this.didColumnWin(id, 'O', this.max_rows(), this.step_count()) &&
      !this.didDiagWin(id, 'X', 'bottomLeft->rightUp', this.max_rows(), this.step_count()) &&
      !this.didDiagWin(id, 'O', 'bottomLeft->rightUp', this.max_rows(), this.step_count()) &&
      !this.didDiagWin(id, 'X', 'leftUp->bottomRight', this.max_rows(), this.step_count())&&
      !this.didDiagWin(id, 'O', 'leftUp->bottomRight', this.max_rows(), this.step_count())){

        // TODO too much nesting
      if (this.turnCount === (this.max_columns()*this.max_rows())){
        this.sendMessageToStatusBar(`It's a tie!`)
        this.updateGameStats('tie')
        this.isBoardDisabled = true

        return true
      }
      else{
        if (this.isX)
          this.sendMessageToStatusBar(`It's X's turn`)
        else
          this.sendMessageToStatusBar(`It's O's turn`)

        return false
      }
    }

    return true
  }

  // TODO change name to better one -> we dont need 3 lines of comments
  getButtonInfo (id: number) {
    this.turnCount++

    this.updateCurrPlayerInfo()
    this.updateButtonDisplay(id, this.max_rows())

    if (!this.checkWinner(id)) return

    this.sendMessageToGameStatsBar(this.gameStats)
  }
  
  sendMessageToStatusBar(message: string){
    this.StatusEmitter.emit(message)
  }

  sendMessageToGameStatsBar(gameStats: stats){
    this.StatsEmitter.emit(gameStats)
  }
}
