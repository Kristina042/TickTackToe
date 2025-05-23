import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

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

  //isEvenRound = false
  
  //control what to display on button
  ButtonDisplay: 'X'|'O'|'' = ''

   //get info from child
    getButtonInfo (info: any) {
    console.log(`im button num ${info.id}`)
    console.log(`am i clicked: ${info.isClicked}`)
  }
}
