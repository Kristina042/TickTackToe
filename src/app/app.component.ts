import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { StatusBarComponent } from "../status-bar/status-bar.component";
import { NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [BoardComponent, StatusBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'tikTackToe';

  gameStatus:string = "It's X's turn"

  handleStatusChange(newStatus: string){
    this.gameStatus = newStatus
  }
}
