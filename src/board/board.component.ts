import { Component, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type stats = {
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

  @Output() BoardEmitter = new EventEmitter()
  @Output() StatsEmitter = new EventEmitter<stats>() 

  //first turn is X - odd
  //X - goes on odd turns
  //O - goes on even turns 
 wasTurnEven = true
 turnCount = 0

 gameStats:stats = {
  numXwins: 0,
  numOwins: 0,
  numTies: 0
 }

 isBoardDisabled = false
 
  board = [
    [{ id: 0, display: '', isHighlighted: false  },{ id: 1, display: '', isHighlighted: false },{ id: 2, display: '', isHighlighted: false }],
    [{ id: 3, display: '', isHighlighted: false  },{ id: 4, display: '', isHighlighted: false },{ id: 5, display: '', isHighlighted: false }],
    [{ id: 6, display: '', isHighlighted: false  },{ id: 7, display: '', isHighlighted: false },{ id: 8, display: '', isHighlighted: false }]
  ]

  flattenedBoard = this.board.flat();

  currPlayer = {
    isX: true,
    CurrId: 0
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
  
  getPlayerPosition(id:number){
    const CELL_COUNT_PER_ROW = 3

    const rowIndex = Math.floor(id / CELL_COUNT_PER_ROW)
    const columnIndex = Math.floor(id - rowIndex * CELL_COUNT_PER_ROW)

    return{rowIndex, columnIndex}
  }

  GetValueById(id: number){ 
    const player = this.getPlayerPosition(id)
    const boardElement = this.board[player.rowIndex][player.columnIndex]
    return boardElement.display
  }

  getButtonColor(id: number){
    const player = this.getPlayerPosition(id)
    const boardElement = this.board[player.rowIndex][player.columnIndex]
    return boardElement.isHighlighted
  }

  updateCurrPlayerInfo(){
     this.wasTurnEven = !this.wasTurnEven

    if (this.wasTurnEven)
        this.currPlayer.isX = false
    else
      this.currPlayer.isX = true
  }

  updateButtonDisplay(){
    const player = this.getPlayerPosition(this.currPlayer.CurrId)
    const boardElement = this.board[player.rowIndex][player.columnIndex]

    if(this.currPlayer.isX)
      boardElement.display = 'X'
    else
      boardElement.display = 'O'
  }
  
  didRowWin(buttonValue: 'X'|'O'){
    const CELL_COUNT_PER_ROW = 3
    const player = this.getPlayerPosition(this.currPlayer.CurrId)

    const currRow = player.rowIndex
    const currColumn = player.columnIndex

    const result: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    const WinningIds: number[] = new Array(CELL_COUNT_PER_ROW)
    let k = 0

    if (this.board[currRow][currColumn].display !== buttonValue) 
      return false

    let columnIndex = currColumn

    const checkLeftCells = () => {
      for (let i = 0; i <= currColumn; i++){
        if (this.board[currRow][columnIndex--].display === buttonValue){
          result[k] = true 
          k++
        }
      } 
    }

    const checkRightCells = () => {
      columnIndex = currColumn
      for (let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currColumn); i++){
        if (this.board[currRow][++columnIndex].display === buttonValue){
          result[k] = true
          k++
        }
      }
    }

    const checkResult = () => {
      if (result.every((el) =>{ return (el === true) })){
        this.sendMessageToStatusBar(`${buttonValue} is the winner!`)
        this.isBoardDisabled = true  

        for (let i = 0; i < CELL_COUNT_PER_ROW; i++)
          this.board[currRow][i].isHighlighted = true

        this.updateGameStats(buttonValue)
        return true
      }
      return false
    }

    checkLeftCells()
    checkRightCells()

    if (checkResult()){ 
      return true
    }

    return false
  }   

  didColumnWin(buttonValue: 'X'|'O'){
    const CELL_COUNT_PER_ROW = 3

    const currRow = this.getPlayerPosition(this.currPlayer.CurrId).rowIndex
    const currColumn = this.getPlayerPosition(this.currPlayer.CurrId).columnIndex

    const result: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0 //index for boolean array

    //check if there is any point in checking for x
    if (this.board[currRow][currColumn].display !== buttonValue)
      return false

    const checkCellsUp = () => {
      let rowIndex = currRow
      for (let i  = 0; i <= currRow; i++){
        if (this.board[rowIndex][currColumn].display === buttonValue){
          result[k] = true
          k++
        }
        --rowIndex     
      }
    }

    const checkCellsDown = () =>{
      let rowIndex = currRow
      //go (CELL_COUNT_PER_ROW - 1 - currRow times down (index + 3))
      for (let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currRow); i++){
        rowIndex++
        if(this.board[rowIndex][currColumn].display === buttonValue){
          result[k] = true
          k++
        }
      }
    }

    const checkResult = () => {
      if (result.every((el) =>{ return (el === true) })){
        this.sendMessageToStatusBar(`${buttonValue} is the winner!`)
        this.isBoardDisabled = true  

        //highlight the column
        for (let i = 0; i < CELL_COUNT_PER_ROW; i++){
            this.board[i][currColumn].isHighlighted = true
        }

        this.updateGameStats(buttonValue)
        return true
      }  
      return false 
    }

    checkCellsUp()
    checkCellsDown()
    if (checkResult())
      return true

    return false
  }

  didDiagWin = (currentIdx: number, value: 'X' | 'O', direction: 'bottomLeft->rightUp'|'leftUp->bottomRight') => {
    const currRow = this.getPlayerPosition(currentIdx).rowIndex
    const currColumn = this.getPlayerPosition(currentIdx).columnIndex

    if (this.board[currRow][currColumn].display !== value)
      return false

    const idMatrix: number[][] = this.board.map((row) => row.map((cell) => cell.id))

    const STEP_COUNT = 3
    const CELL_COUNT = 3

    const idsToCheck: number[] = []

    idsToCheck.push(currentIdx)

    const checkCellsUp = () => {
      let row = currRow
      let column  = currColumn
      for (let i = 0; i < (STEP_COUNT - 1); i++){

        if (direction === 'bottomLeft->rightUp')
        { 
          row = row - 1
          column = column + 1

          if ((row >= 0) && (column <= (CELL_COUNT - 1)))
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
      for (let i = 0; i < (STEP_COUNT - 1); i++){

        if (direction === 'bottomLeft->rightUp')
        {
          row = row + 1
          column = column - 1

          if ((row <= (CELL_COUNT - 1)) && (column >= 0))
            idsToCheck.push(idMatrix[row][column])
        }
        else{
          row = row + 1
          column = column + 1

          if ((row <= (CELL_COUNT - 1)) && (column<= (CELL_COUNT - 1)))
          idsToCheck.push(idMatrix[row][column])
        }
      }
    }

    checkCellsUp()
    checkCellsDown()

    //check that ids to check lengh is at least STEP count
    if (idsToCheck.length < STEP_COUNT)
      return

    idsToCheck.sort((a, b) => a - b);
  
    const result: boolean[] = new Array(idsToCheck.length).fill(false)
    let k = 0

    //will be used in case of a win
    const winningIds: number[] = new Array(STEP_COUNT)

    const checkIdArray = () => {
      for (let i = 0; i < (idsToCheck.length); i++){
        let id = idsToCheck[i]  
        let row = this.getPlayerPosition(id).rowIndex
        let column = this.getPlayerPosition(id).columnIndex

        if (this.board[row][column].display === value){
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

          if (count === (STEP_COUNT))
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
      //highlight winning ids
      winningIds.forEach((id) => {
        let row = this.getPlayerPosition(id).rowIndex
        let column = this.getPlayerPosition(id).columnIndex

        this.board[row][column].isHighlighted = true
      })

      this.isBoardDisabled = true
      this.sendMessageToStatusBar(`${value} is the winner!`)
      this.updateGameStats(value)
      return true
    }
    return false
  }

  checkWinner(){

    if (!this.didRowWin('X') && !this.didRowWin('O') &&
      !this.didColumnWin('X') && !this.didColumnWin('O') &&
      !this.didDiagWin(this.currPlayer.CurrId, 'X', 'bottomLeft->rightUp') &&
      !this.didDiagWin(this.currPlayer.CurrId, 'O', 'bottomLeft->rightUp') &&
      !this.didDiagWin(this.currPlayer.CurrId, 'X', 'leftUp->bottomRight')&&
      !this.didDiagWin(this.currPlayer.CurrId, 'O', 'leftUp->bottomRight')){

      if (this.turnCount === (9)){
        this.sendMessageToStatusBar(`It's a tie!`)
        this.updateGameStats('tie')
        this.isBoardDisabled = true

        return true
      }
      else{
        if (this.currPlayer.isX)
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
  getButtonInfo (info: number) {
    this.currPlayer.CurrId = info
    this.turnCount++

    this.updateCurrPlayerInfo()
    this.updateButtonDisplay()

    //update stats bar on every game over
    if (this.checkWinner()){
      console.log('GAME OVER')
      this.sendMessageToGameStatsBar(this.gameStats)
    }
    
  }

  //send Message on every click
  sendMessageToStatusBar(message: string){
    this.BoardEmitter.emit(message)
  }

  //send after every game over
  sendMessageToGameStatsBar(gameStats: stats){
    this.StatsEmitter.emit(gameStats)
  }
}
