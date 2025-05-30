import { Component, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type button = {
  id: number,
  isClicked: boolean
}

@Component({
  selector: 'app-board',
  imports: [ ButtonComponent, CommonModule ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  @Output() BoardEmitter = new EventEmitter<string>()

  //first turn is X - odd
  //X - goes on odd turns
  //O - goes on even turns 
 wasTurnEven = true
 turnCount = 0
 isBoardDisabled = false
 
  board = [
    [{ id: 0, display: '', isHighlighted: false  },{ id: 1, display: '', isHighlighted: false },{ id: 2, display: '', isHighlighted: false }],
    [{ id: 3, display: '', isHighlighted: false  },{ id: 4, display: '', isHighlighted: false },{ id: 5, display: '', isHighlighted: false }],
    [{ id: 6, display: '', isHighlighted: false  },{ id: 7, display: '', isHighlighted: false },{ id: 8, display: '', isHighlighted: false }]
  ]

  currPlayer = {
    isX: true,
    CurrId: 0
  }
  
  getPlayerPosition(id:number){
    const CELL_COUNT_PER_ROW = 3

    const rowIndex = Math.floor(id / CELL_COUNT_PER_ROW)
    const columnIndex = Math.floor(id - rowIndex * CELL_COUNT_PER_ROW)

    return{rowIndex, columnIndex}
  }

  damianGetValue(id: number){ 
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
  
  didRowWin(buttonValue: string){
    const CELL_COUNT_PER_ROW = 3
    const player = this.getPlayerPosition(this.currPlayer.CurrId)

    const currRow = player.rowIndex
    const currColumn = player.columnIndex

    const result: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    const WinningIds: number[] = new Array(CELL_COUNT_PER_ROW)
    let k = 0

    if (this.board[currRow][currColumn].display !== buttonValue) return

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
      }
    }

    checkLeftCells()
    checkRightCells()
    checkResult()
  }   

  didColumnWin(buttonValue: string){
    const CELL_COUNT_PER_ROW = 3

    const currRow = this.getPlayerPosition(this.currPlayer.CurrId).rowIndex
    const currColumn = this.getPlayerPosition(this.currPlayer.CurrId).columnIndex

    const result: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0 //index for boolean array

    //check if there is any point in checking for x
    if (this.board[currRow][currColumn].display !== buttonValue)
      return

    //check curr position then check (currRow) times up
    let rowIndex = currRow
    for (let i  = 0; i <= currRow; i++){
      if (this.board[rowIndex][currColumn].display === buttonValue){
        result[k] = true
        k++
      }
      //make sure next check is a row up
      --rowIndex     
    }

    //reset row index
    rowIndex = currRow
    //go (CELL_COUNT_PER_ROW - 1 - currRow times down (index + 3))
    for (let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currRow); i++){
      rowIndex++
      if(this.board[rowIndex][currColumn].display === buttonValue){
        result[k] = true
        k++
      }
    }

    if (result.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar(`${buttonValue} is the winner!`)
      this.isBoardDisabled = true  

      //highlight the column
      for (let i = 0; i < CELL_COUNT_PER_ROW; i++){
          this.board[i][currColumn].isHighlighted = true
      }
    }   
  }

  didDiagWin_1 = (currentIdx: number, value: 'X' | 'O') => {

    //generate matrix from my ids
    const idMatrix: number[][] = this.board.map((row) => row.map((cell) => cell.id))

    //console.log(arr)
    const currRow = this.getPlayerPosition(currentIdx).rowIndex
    const currColumn = this.getPlayerPosition(currentIdx).columnIndex

    const STEP_COUNT = 3
    const CELL_COUNT = 3

    let idsToCheck = []

    idsToCheck.push(currentIdx)

    const checkCellsUp = () => {
      let row = currRow
      let column  = currColumn
      for (let i = 0; i < (STEP_COUNT - 1); i++){
        row = row - 1
        column = column + 1

        if ((row >= 0) && (column <= (CELL_COUNT - 1)))
          idsToCheck.push(idMatrix[row][column])
      }
    }
    
    const checkCellsDown = () => {
     let row = currRow
     let column = currColumn
      for (let i = 0; i < (STEP_COUNT - 1); i++){
        row = row + 1
        column = column - 1

        if ((row <= (CELL_COUNT - 1)) && (column >= 0))
          idsToCheck.push(idMatrix[row][column])
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
    }
  }


  checkWinner(){
    this.didRowWin('X')
    this.didRowWin('O')
    
    this.didColumnWin('X')
    this.didColumnWin('O')

    this.didDiagWin_1(this.currPlayer.CurrId, 'X')
    this.didDiagWin_1(this.currPlayer.CurrId, 'O')
  }

  //get info from child
  //called on every button click
  //so we can also use is to know if round is even
  getButtonInfo (info: button) {
    this.currPlayer.CurrId = info.id

    this.updateCurrPlayerInfo()
    this.updateButtonDisplay()
    this.checkWinner()

    this.turnCount++
  }

  //send Message on every click
  sendMessageToStatusBar(message: string){
    this.BoardEmitter.emit(message)
  }
}
