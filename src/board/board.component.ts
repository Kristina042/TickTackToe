import { Component, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Output } from '@angular/core';

type button = {
  id: number,
  isClicked: boolean
}

@Component({
  selector: 'app-board',
  imports: [ ButtonComponent ],
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

  damianGetValue(id: number) {
    const CELL_COUNT_PER_ROW = 3

    const rowIndex = Math.floor(id / CELL_COUNT_PER_ROW)
    const columnIndex = Math.floor(id - rowIndex * CELL_COUNT_PER_ROW)
    const boardElement = this.board[rowIndex][columnIndex]

    return boardElement.display
  }

  getButtonColor(id: number){
    const CELL_COUNT_PER_ROW = 3

    const rowIndex = Math.floor(id / CELL_COUNT_PER_ROW)
    const columnIndex = Math.floor(id - rowIndex * CELL_COUNT_PER_ROW)
    const boardElement = this.board[rowIndex][columnIndex]

    return boardElement.isHighlighted
  }

  //returns true(disabled) or false(disabled)
  getButtonStatus(ButtonDisplay: string){
      if (ButtonDisplay === '')
        return false
      else
       return true
  }
 
  currPlayer = {
    isX: true,
    CurrId: 0
  }

  updateCurrPlayerInfo(){
     this.wasTurnEven = !this.wasTurnEven

    if (this.wasTurnEven)
        this.currPlayer.isX = false
    else
      this.currPlayer.isX = true
  }

  updateButtonDisplay(){
    //getButtonValueById()
    const CELL_COUNT_PER_ROW = 3

    const rowIndex = Math.floor(this.currPlayer.CurrId / CELL_COUNT_PER_ROW)
    const columnIndex = Math.floor(this.currPlayer.CurrId - rowIndex * CELL_COUNT_PER_ROW)
    const boardElement = this.board[rowIndex][columnIndex]

   if(this.currPlayer.isX)
      boardElement.display = 'X'
    else
      boardElement.display = 'O'
  }

  // didRowWin(){
  //   const CELL_COUNT_PER_ROW = 3
  //   const currRow = Math.floor(this.currPlayer.CurrId/CELL_COUNT_PER_ROW)

  //   let fullRow_X = this.board[currRow].every((el) => {
  //      return (el.display === 'X')
  //   })

  //   let fullRow_O = this.board[currRow].every((el) => {
  //      return (el.display === 'O')
  //   })

  //   if (fullRow_X === true)
  //   {
  //     this.board[currRow].forEach((el) => {el.isHighlighted = true})
  //     this.sendMessageToStatusBar('X is the winner!')
  //     this.isBoardDisabled = true
  //   }

  //   if (fullRow_O === true)
  //   {
  //     this.board[currRow].forEach((el) => {el.isHighlighted = true})
  //     this.sendMessageToStatusBar('O is the winner!')
  //     this.isBoardDisabled = true
  //   }
  // } 
  
  didRowWin_X(){
    const CELL_COUNT_PER_ROW = 3
    const currRow = Math.floor(this.currPlayer.CurrId/CELL_COUNT_PER_ROW)
    const currColumn = Math.floor(this.currPlayer.CurrId - currRow * CELL_COUNT_PER_ROW)

    const isRow_X: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0

    if (this.board[currRow][currColumn].display !== 'X')
      return

    let columnIndex = currColumn

    //go left
    for (let i = 0; i <= currColumn; i++){
      if (this.board[currRow][columnIndex].display === 'X'){
        isRow_X[k] = true
        k++
      }
      columnIndex = columnIndex - 1
    }

    //go right
    columnIndex = currColumn
    for (let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currColumn); i++){
      columnIndex = columnIndex + 1

      if (this.board[currRow][columnIndex].display === 'X'){
        isRow_X[k] = true
        k++
      }
    }

    if (isRow_X.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar('X is the winner!')
      this.isBoardDisabled = true  
    }
  }  

   didRowWin_O(){
    const CELL_COUNT_PER_ROW = 3
    const currRow = Math.floor(this.currPlayer.CurrId/CELL_COUNT_PER_ROW)
    const currColumn = Math.floor(this.currPlayer.CurrId - currRow * CELL_COUNT_PER_ROW)

    const isRow_O: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0

    if (this.board[currRow][currColumn].display !== 'O')
      return

    let columnIndex = currColumn

    //go left
    for (let i = 0; i <= currColumn; i++){
      if (this.board[currRow][columnIndex].display === 'O'){
        isRow_O[k] = true
        k++
      }
      columnIndex = columnIndex - 1
    }

    //go right
    columnIndex = currColumn
    for (let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currColumn); i++){
      columnIndex = columnIndex + 1

      if (this.board[currRow][columnIndex].display === 'O'){
        isRow_O[k] = true
        k++
      }
    }

    if (isRow_O.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar('O is the winner!')
      this.isBoardDisabled = true  
    }
  }  

  didColumnWin_X(){
    const CELL_COUNT_PER_ROW = 3

    const currRow = Math.floor(this.currPlayer.CurrId / CELL_COUNT_PER_ROW)
    const currColumn = Math.floor(this.currPlayer.CurrId - currRow * CELL_COUNT_PER_ROW)

    const isColumn_X: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0 //index for boolean array

    //check if there is any point in checking for x
    if (this.board[currRow][currColumn].display !== 'X')
      return

    //check curr position then check (currRow) times up
    let rowIndex = currRow
    for (let i  = 0; i <= currRow; i++){
      if (this.board[rowIndex][currColumn].display === 'X'){
        isColumn_X[k] = true
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
      if(this.board[rowIndex][currColumn].display === 'X'){
        isColumn_X[k] = true
        k++
      }
    }

    if (isColumn_X.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar('X is the winner!')
      this.isBoardDisabled = true  

      //highlight the column
      for (let i = 0; i < CELL_COUNT_PER_ROW; i++){
          this.board[i][currColumn].isHighlighted = true
      }
    }   
  }

  didColumnWin_O(){
    const CELL_COUNT_PER_ROW = 3

    const currRow = Math.floor(this.currPlayer.CurrId / CELL_COUNT_PER_ROW)
    const currColumn = Math.floor(this.currPlayer.CurrId - currRow * CELL_COUNT_PER_ROW)

    const isColumn_O: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0 //index for boolean array

    //check if there is any point in checking for x
    if (this.board[currRow][currColumn].display !== 'O')
      return

    //check curr position then check (currRow) times up
    let rowIndex = currRow
    for (let i  = 0; i <= currRow; i++){
      if (this.board[rowIndex][currColumn].display === 'O'){
        isColumn_O[k] = true
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
      if(this.board[rowIndex][currColumn].display === 'O'){
        isColumn_O[k] = true
        k++
      }
    }

    if (isColumn_O.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar('O is the winner!')
      this.isBoardDisabled = true  
      
      //highlight the column
      for (let i = 0; i < CELL_COUNT_PER_ROW; i++){
          this.board[i][currColumn].isHighlighted = true
      }
    }   
  }

  didDiagonalWin_X_1(){
    const CELL_COUNT_PER_ROW = 3

    const currRow = Math.floor(this.currPlayer.CurrId / CELL_COUNT_PER_ROW)
    const currColumn = Math.floor(this.currPlayer.CurrId - currRow * CELL_COUNT_PER_ROW)

    const isDiagonal_X: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0 //index for boolean array

    if (this.board[currRow][currColumn].display === 'O')
      return

    let rowIndex = currRow
    let columnIndex = currColumn

    //go up
    for (let i = 0; i <= currRow; i++){
      if(this.board[rowIndex--][columnIndex--].display === 'X'){
        isDiagonal_X[k] = true
        k++
      }
    }

    //go down
    //reset indexes
    rowIndex = currRow
    columnIndex = currColumn
    for(let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currRow); i++){
      if (this.board[++rowIndex][++columnIndex].display === 'X'){
        isDiagonal_X[k] = true
        k++
      }
    }

    if (isDiagonal_X.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar('X is the winner!')
      this.isBoardDisabled = true  
    }   
  }

  didDiagonalWin_X_2(){
    const CELL_COUNT_PER_ROW = 3

    const currRow = Math.floor(this.currPlayer.CurrId / CELL_COUNT_PER_ROW)
    const currColumn = Math.floor(this.currPlayer.CurrId - currRow * CELL_COUNT_PER_ROW)

    const isDiagonal_X: boolean[] = new Array(CELL_COUNT_PER_ROW).fill(false);
    let k = 0 //index for boolean array

    if (this.board[currRow][currColumn].display === 'O')
      return

    let rowIndex = currRow
    let columnIndex = currColumn

    //go up
    for (let i = 0; i <= currRow; i++){
      if(this.board[rowIndex][columnIndex].display === 'X'){
        isDiagonal_X[k] = true
        console.log(isDiagonal_X)
        k++
      }
      rowIndex = rowIndex-1
      columnIndex = columnIndex+1
    }

    //go down
    //reset indexes
    rowIndex = currRow
    columnIndex = currColumn
    for(let i = 0; i < (CELL_COUNT_PER_ROW - 1 - currRow); i++){
      rowIndex = rowIndex + 1
      columnIndex = columnIndex - 1
      if (this.board[rowIndex][columnIndex].display === 'X'){
        isDiagonal_X[k] = true
        console.log(isDiagonal_X)
        k++
      }
    }

    if (isDiagonal_X.every((el) =>{ return (el === true) })){
      this.sendMessageToStatusBar('X is the winner!')
      this.isBoardDisabled = true  
    }   
  }

  checkWinner(){
   // this.didRowWin()
    this.didRowWin_X()
    this.didRowWin_O()
    this.didColumnWin_X()
    this.didColumnWin_O()
    
    this.didDiagonalWin_X_1()
    this.didDiagonalWin_X_2()
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
