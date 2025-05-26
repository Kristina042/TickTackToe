import { Component, Input, Output, EventEmitter, computed, input } from '@angular/core';

type button = {
  id: number | any,
  isClicked: boolean
}

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})

export class ButtonComponent {
  @Input() ID: number = 0
  OnDisplay = input<'X' | 'O' | ''>('');
  IsButtonClicked = false

  isGameFinished = input<boolean>()

  IsDisabled = computed<boolean>(() => {
    if (this.isGameFinished() === true)
      return true
    else
     return(!!this.OnDisplay().length)
  });


  // board = [
  //   [1, null, 0],
  //   [null, null,1 ],
  //   [1, null, 0],
  // ]

  //let parent component know that a button was clicked
  //than parent will decide what to put on display
  @Output() ButtonEmitter = new EventEmitter<button>();

  sendButtonStateUp(){
    this.ButtonEmitter.emit({ 
      id: this.ID, 
      isClicked: this.IsButtonClicked 
    })
  }

  handleClick(){
    if (this.IsDisabled()) return
    this.IsButtonClicked = true
    this.sendButtonStateUp()
  }

}
