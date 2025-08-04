import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-bar',
  imports: [],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.scss'
})

export class StatusBarComponent {
  status = input<string>()
}
