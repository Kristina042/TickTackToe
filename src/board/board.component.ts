import { Component, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { input } from '@angular/core';

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

  @Output() StatusEmitter = new EventEmitter()
  @Output() StatsEmitter = new EventEmitter<stats>() 

  max_rows = input<number>(0) 
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
 
  board: any[][] = new Array()

  create_board(board_width: any, board_heigth: any){
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

  updateGameStats(valToIncrement: 'X'|'O'|'tie'){
    if (valToIncrement === 'X')
      this.gameStats.numXwins++
    else if(valToIncrement === 'O')
      this.gameStats.numOwins ++
    else
      this.gameStats.numTies++

      console.log('from updateGameStats')
      console.log(this.gameStats)
  }
  
  getPlayerPosition(id:number, cell_count_per_row: number){
    const rowIndex = Math.floor(id / cell_count_per_row)
    const columnIndex = Math.floor(id - rowIndex * cell_count_per_row)

    return{rowIndex, columnIndex}
  }

  GetValueById(id: number,  cell_count_per_row: number){ 
    const player = this.getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board[player.rowIndex][player.columnIndex]
    return boardElement.display
  }

  getButtonColor(id: number, cell_count_per_row: number){
    const player = this.getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board[player.rowIndex][player.columnIndex]
    return boardElement.isHighlighted
  }

  updateCurrPlayerInfo(){
     this.wasTurnEven = !this.wasTurnEven

    if (this.wasTurnEven)
        this.isX = false
    else
      this.isX = true
  }

  updateButtonDisplay(id:number, cell_count_per_row: number){
    const player = this.getPlayerPosition(id, cell_count_per_row)
    const boardElement = this.board[player.rowIndex][player.columnIndex]

    if(this.isX)
      boardElement.display = 'X'
    else
      boardElement.display = 'O'
  }
  
  //true - win
  //false - loss
  checkIdsForWin(idArr: number[], buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number){
    console.log (`idArr`)
    console.log(idArr)

    //check that ids to check lengh is at least STEP count
    if (idArr.length < step_count)
      return false

    idArr.sort((a, b) => a - b)

    const result: boolean[] = new Array(idArr.length).fill(false)
    let k = 0

    //will be used in case of a win
    const winningIds: number[] = new Array()

    const checkIdArray = () => {
      for (let i = 0; i < (idArr.length); i++){
        let id = idArr[i]  
        let row = this.getPlayerPosition(id, cell_count_per_row).rowIndex
        let column = this.getPlayerPosition(id, cell_count_per_row).columnIndex

        if (this.board[row][column].display === buttonValue){
          result[k] = true
          k++

          winningIds.push(id)
        }
      }
    }

    //check if array has 3 true values in a row
    const isWinner = () => {
      let count = 0

      for (let i = 0; i < result.length; i++){
        if (result[i] === true){
          count++

          if (count === (step_count))
              return true
        }
        else{
          count = 0
        }
      }
      return false
    }

    checkIdArray()

    if (isWinner() === true)
    {
      console.log('winning ids')
      console.log(winningIds)

      //highlight winning ids
      winningIds.forEach((id) => {
        let row = this.getPlayerPosition(id, cell_count_per_row).rowIndex
        let column = this.getPlayerPosition(id, cell_count_per_row).columnIndex

        this.board[row][column].isHighlighted = true
      })

      this.isBoardDisabled = true
      this.sendMessageToStatusBar(`${buttonValue} is the winner!`)
      this.updateGameStats(buttonValue)
      return true
    }
    return false
  }

  didRowWin(currentIdx:number, buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number){
    const player = this.getPlayerPosition(currentIdx, cell_count_per_row)

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
        column = column + 1
        id = id + 1

        if (column <= (cell_count_per_row - 1))
          idsToCheck.push(id)
      }
    }

    const checkCellsLeft = () => {
      let column = currColumn
      let id = currentIdx
      
      for (let i = 0; i < (step_count - 1); i++){
        column = column - 1
        id = id - 1

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
    const player = this.getPlayerPosition(currentIdx, cell_count_per_row)

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
        row = row - 1
        id = id - cell_count_per_row

        if (row >= 0)
          idsToCheck.push(id)
      }
    }

    const checkCellsDown = () =>{
      let row = currRow
      let id = currentIdx

      for (let i = 0; i < (step_count - 1); i++){
        row = row + 1
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

  didDiagWin = (currentIdx: number, value: 'X' | 'O', direction: 'bottomLeft->rightUp'|'leftUp->bottomRight',
     cell_count_per_row: number, step_count: number) => {
    const currRow = this.getPlayerPosition(currentIdx, cell_count_per_row).rowIndex
    const currColumn = this.getPlayerPosition(currentIdx, cell_count_per_row).columnIndex

    if (this.board[currRow][currColumn].display !== value)
      return false

    const idMatrix: number[][] = this.board.map((row) => row.map((cell:board_cell) => cell.id))

    const idsToCheck: number[] = []

    idsToCheck.push(currentIdx)

    const checkCellsUp = () => {
      let row = currRow
      let column  = currColumn
      for (let i = 0; i < (step_count - 1); i++){

        if (direction === 'bottomLeft->rightUp')
        { 
          row = row - 1
          column = column + 1

          if ((row >= 0) && (column <= (cell_count_per_row - 1)))
            idsToCheck.push(idMatrix[row][column])
        }
        else{
          row = row - 1 
          column = column - 1

          if ((row >= 0) && (column >= 0))
            idsToCheck.push(idMatrix[row][column])
        }
      }
    }
    
    const checkCellsDown = () => {
     let row = currRow
     let column = currColumn
      for (let i = 0; i < (step_count - 1); i++){

        if (direction === 'bottomLeft->rightUp')
        {
          row = row + 1
          column = column - 1

          if ((row <= (cell_count_per_row - 1)) && (column >= 0))
            idsToCheck.push(idMatrix[row][column])
        }
        else{
          row = row + 1
          column = column + 1

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
    if (!this.didRowWin(id, 'X', this.max_rows(), this.step_count()) && !this.didRowWin(id, 'O', this.max_rows(), this.step_count()) &&
      !this.didColumnWin(id, 'X', this.max_rows(), this.step_count()) && !this.didColumnWin(id, 'O', this.max_rows(), this.step_count()) &&
      !this.didDiagWin(id, 'X', 'bottomLeft->rightUp', this.max_rows(), this.step_count()) &&
      !this.didDiagWin(id, 'O', 'bottomLeft->rightUp', this.max_rows(), this.step_count()) &&
      !this.didDiagWin(id, 'X', 'leftUp->bottomRight', this.max_rows(), this.step_count())&&
      !this.didDiagWin(id, 'O', 'leftUp->bottomRight', this.max_rows(), this.step_count())){

      if (this.turnCount === (this.max_columns()*this.max_rows())){
        this.sendMessageToStatusBar(`It's a tie!`)
        this.updateGameStats('tie')
        this.isBoardDisabled = true

        return true
      }
      else{
        if (this.isX)
          this.sendMessageToStatusBar(`It's O's turn`)
        else
          this.sendMessageToStatusBar(`It's X's turn`)

        return false
      }
    }

    return true
  }

  //get info from child
  //called on every button click
  //so we can also use is to know if round is even
  getButtonInfo (id: number) {
    this.turnCount++

    this.updateCurrPlayerInfo()
    this.updateButtonDisplay(id, this.max_rows())

    //update stats bar on every game over
    if (this.checkWinner(id)){
      console.log('GAME OVER')
      this.sendMessageToGameStatsBar(this.gameStats)
    }
  }

  //send Message on every click
  sendMessageToStatusBar(message: string){
    this.StatusEmitter.emit(message)
  }

  //send after every game over
  sendMessageToGameStatsBar(gameStats: stats){
    this.StatsEmitter.emit(gameStats)
  }
}
