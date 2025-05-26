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
  //first turn is 1 - odd
  //in first implementation X - goes on odd turns
  //O - goes on even turns 
 wasTurnEven = true

 turnCount = 0

 isBoardDisabled = false

  //control what to display on button
  ButtonDisplay_1: 'X'|'O'|'' = ''
  ButtonDisplay_2: 'X'|'O'|'' = ''
  ButtonDisplay_3: 'X'|'O'|'' = ''
  ButtonDisplay_4: 'X'|'O'|'' = ''
  ButtonDisplay_5: 'X'|'O'|'' = ''
  ButtonDisplay_6: 'X'|'O'|'' = ''
  ButtonDisplay_7: 'X'|'O'|'' = ''
  ButtonDisplay_8: 'X'|'O'|'' = ''
  ButtonDisplay_9: 'X'|'O'|'' = ''

  isButtonDisabled = false

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

  //get info from child
  //called on every button click
  //so we can also use is to know if round is

  updateCurrPlayerInfo(){
     this.wasTurnEven = !this.wasTurnEven

    if (this.wasTurnEven)
        this.currPlayer.isX = false
    else
      this.currPlayer.isX = true
  }

  updateButtonDisplay(){
      if((this.currPlayer.CurrId === 1)){
         if (this.currPlayer.isX)
            this.ButtonDisplay_1 = 'X'
          else
            this.ButtonDisplay_1 = 'O'
      }

      if((this.currPlayer.CurrId === 2)){
         if (this.currPlayer.isX)
            this.ButtonDisplay_2 = 'X'
          else
            this.ButtonDisplay_2 = 'O'

      }

      if((this.currPlayer.CurrId === 3) ){
         if (this.currPlayer.isX)
            this.ButtonDisplay_3 = 'X'
          else
            this.ButtonDisplay_3 = 'O'

      }

      if((this.currPlayer.CurrId === 4) ){
         if (this.currPlayer.isX)
            this.ButtonDisplay_4 = 'X'
          else
            this.ButtonDisplay_4 = 'O'

      }

      if((this.currPlayer.CurrId === 5) ){
         if (this.currPlayer.isX)
            this.ButtonDisplay_5 = 'X'
          else
            this.ButtonDisplay_5 = 'O'

      }

      if((this.currPlayer.CurrId === 6) ){
         if (this.currPlayer.isX)
            this.ButtonDisplay_6 = 'X'
          else
            this.ButtonDisplay_6 = 'O'

      }

      if((this.currPlayer.CurrId === 7)){
         if (this.currPlayer.isX)
            this.ButtonDisplay_7 = 'X'
          else
            this.ButtonDisplay_7 = 'O'

      }

      if((this.currPlayer.CurrId === 8) ){
         if (this.currPlayer.isX)
            this.ButtonDisplay_8 = 'X'
          else
            this.ButtonDisplay_8 = 'O'

      }

      if((this.currPlayer.CurrId === 9) ){
         if (this.currPlayer.isX)
            this.ButtonDisplay_9 = 'X'
          else
            this.ButtonDisplay_9 = 'O'
      }
      
  }
  checkWinner(){

    if (((this.ButtonDisplay_1 === 'O')&&(this.ButtonDisplay_2 === 'O') && (this.ButtonDisplay_3 === 'O'))||
        ((this.ButtonDisplay_4 === 'O')&&(this.ButtonDisplay_5 === 'O') && (this.ButtonDisplay_6 === 'O')) ||
        ((this.ButtonDisplay_7 === 'O')&&(this.ButtonDisplay_8 === 'O') && (this.ButtonDisplay_9 === 'O')) ||
        ((this.ButtonDisplay_1 === 'O')&&(this.ButtonDisplay_4 === 'O') && (this.ButtonDisplay_7 === 'O')) ||
        ((this.ButtonDisplay_2 === 'O')&&(this.ButtonDisplay_5 === 'O') && (this.ButtonDisplay_8 === 'O')) ||
        ((this.ButtonDisplay_3 === 'O')&&(this.ButtonDisplay_6 === 'O') && (this.ButtonDisplay_9 === 'O')) ||
        ((this.ButtonDisplay_1 === 'O')&&(this.ButtonDisplay_5 === 'O') && (this.ButtonDisplay_9 === 'O')) ||
        ((this.ButtonDisplay_7 === 'O')&&(this.ButtonDisplay_5 === 'O') && (this.ButtonDisplay_3 === 'O'))){
       this.sendMessageToStatusBar('O is the winner')
       this.isBoardDisabled = true
      }
    else if (((this.ButtonDisplay_1 === 'X')&&(this.ButtonDisplay_2 === 'X') && (this.ButtonDisplay_3 === 'X'))||
        ((this.ButtonDisplay_4 === 'X')&&(this.ButtonDisplay_5 === 'X') && (this.ButtonDisplay_6 === 'X')) ||
        ((this.ButtonDisplay_7 === 'X')&&(this.ButtonDisplay_8 === 'X') && (this.ButtonDisplay_9 === 'X')) ||
        ((this.ButtonDisplay_1 === 'X')&&(this.ButtonDisplay_4 === 'X') && (this.ButtonDisplay_7 === 'X')) ||
        ((this.ButtonDisplay_2 === 'X')&&(this.ButtonDisplay_5 === 'X') && (this.ButtonDisplay_8 === 'X')) ||
        ((this.ButtonDisplay_3 === 'X')&&(this.ButtonDisplay_6 === 'X') && (this.ButtonDisplay_9 === 'X')) ||
        ((this.ButtonDisplay_1 === 'X')&&(this.ButtonDisplay_5 === 'X') && (this.ButtonDisplay_9 === 'X')) ||
        ((this.ButtonDisplay_7 === 'X')&&(this.ButtonDisplay_5 === 'X') && (this.ButtonDisplay_3 === 'X'))){
         this.sendMessageToStatusBar('X is the winner')
         this.isBoardDisabled = true
      }
    else if (this.turnCount === 8){
      this.sendMessageToStatusBar('Its a tie!')
      this.isBoardDisabled = true
    }
    else if (this.currPlayer.isX === false)
      this.sendMessageToStatusBar("It's X's turn")
    else 
      this.sendMessageToStatusBar("It's O's turn")
  }

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
