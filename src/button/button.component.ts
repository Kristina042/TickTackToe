import { Component, Output, EventEmitter, computed, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})

export class ButtonComponent {
  OnDisplay = input<string>('');
  isHighlighted = input<boolean>(false)
  isGameFinished = input<boolean>()

  IsDisabled = computed<boolean>(() =>
    this.isGameFinished() || !!this.OnDisplay().length);

  @Output() onClick = new EventEmitter();

  handleClick(){
    if (this.IsDisabled()) return

    this.onClick.emit()
  }

}
