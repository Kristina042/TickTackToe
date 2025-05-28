import { Component, Input, Output, EventEmitter, computed, input } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  Id = input<number>()
  OnDisplay = input<string>('');
  isHighlighted = input<boolean>(false)

  IsButtonClicked = false

  isGameFinished = input<boolean>()

  IsDisabled = computed<boolean>(() => {
    if (this.isGameFinished() === true)
      return true
    else
     return(!!this.OnDisplay().length)
  });

  //let parent component know that a button was clicked
  //than parent will decide what to put on display
  @Output() ButtonEmitter = new EventEmitter<button>();

  sendButtonStateUp(){
    this.ButtonEmitter.emit({ 
      id: this.Id(), 
      isClicked: this.IsButtonClicked 
    })
  }

  handleClick(){
    if (this.IsDisabled()) return
    this.IsButtonClicked = true
    this.sendButtonStateUp()
  }

}
