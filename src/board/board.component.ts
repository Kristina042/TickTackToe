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
    [{ id: -1, display: '', isHighlighted: false  },{ id: -1, display: '', isHighlighted: false  },{ id: -1, display: '', isHighlighted: false },{ id: -1, display: '', isHighlighted: false },{ id: -1, display: '', isHighlighted: false }],
    [{ id: -1, display: '', isHighlighted: false  },{ id: 0, display: '', isHighlighted: false  },{ id: 1, display: '', isHighlighted: false },{ id: 2, display: '', isHighlighted: false },{ id: -1, display: '', isHighlighted: false }],
    [{ id: -1, display: '', isHighlighted: false  },{ id: 3, display: '', isHighlighted: false  },{ id: 4, display: '', isHighlighted: false },{ id: 5, display: '', isHighlighted: false },{ id: -1, display: '', isHighlighted: false }],
    [{ id: -1, display: '', isHighlighted: false  },{ id: 6, display: '', isHighlighted: false  },{ id: 7, display: '', isHighlighted: false },{ id: 8, display: '', isHighlighted: false },{ id: -1, display: '', isHighlighted: false }],
    [{ id: -1, display: '', isHighlighted: false  },{ id: -1, display: '', isHighlighted: false  },{ id: -1, display: '', isHighlighted: false },{ id: -1, display: '', isHighlighted: false },{ id: -1, display: '', isHighlighted: false}]
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

  didDiagonalWin(buttonValue: 'X'|'O', direction: '00->22'|'02->20'){
    const CELL_COUNT_PER_ROW = 3

    const currRow = this.getPlayerPosition(this.currPlayer.CurrId).rowIndex
    const currColumn = this.getPlayerPosition(this.currPlayer.CurrId).columnIndex

    const result: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0 //index for boolean array

    if (this.board[currRow][currColumn].display !== buttonValue)
      return

    let rowIndex = currRow
    let columnIndex = currColumn

    for (let i = 0; i<=currRow; i++){
      if(((direction === '00->22') && (this.board[rowIndex--][columnIndex--].display === buttonValue))||
      ((direction === '02->20') && (this.board[rowIndex--][columnIndex++].display === buttonValue))){
        result[k] = true
        k++
      }
    }

    //go down
    //reset indexes
    rowIndex = currRow
    columnIndex = currColumn

    for (let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currRow); i++){
      
      if (((direction === '00->22')&&(this.board[++rowIndex][++columnIndex].display === buttonValue))||
      ((direction === '02->20')&&(this.board[++rowIndex][--columnIndex].display === buttonValue)))
      result[k] = true
      k++
    }

    if (result.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar(`${buttonValue} is the winner!`)
      this.isBoardDisabled = true  
    }   
  }

  checkWinner(){
    this.didRowWin('X')
    this.didRowWin('O')
    
    this.didColumnWin('X')
    this.didColumnWin('O')
    
    this.didDiagonalWin('X', '00->22')
    this.didDiagonalWin('X', '02->20')
    this.didDiagonalWin('O', '00->22')
    this.didDiagonalWin('O', '02->20')
    //this.didDiagonalWin_X_2()
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
