import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  router = inject(Router);
  authService = inject(AuthService)
  gameService = inject(GameService)

  logout() {
    this.authService.logout()
  }

  createNew3x3() {
    //1 ask database if currUser has an ongoing game

    //if yes redirect to ongoing game with game id in url

    //if not send request to server to create new game
    //in request include user id and board size

    //redirect to game page with game id that i will recieve in responce

    const emptyBoard = [
      [{"id":0,"display":"","isHighlighted":false},{"id":1,"display":"","isHighlighted":false},{"id":2,"display":"","isHighlighted":false}],
      [{"id":3,"display":"","isHighlighted":false},{"id":4,"display":"","isHighlighted":false},{"id":5,"display":"","isHighlighted":false}],
      [{"id":6,"display":"","isHighlighted":false},{"id":7,"display":"","isHighlighted":false},{"id":8,"display":"","isHighlighted":false}]
    ]

    const history = {player:"unset",cellId: 0}

    this.gameService.createNewGame('3x3', emptyBoard, history).subscribe(res => {
      if (res){
        const gameId = res.game_id
        this.router.navigate(['/multiplayer', gameId, '3x3'])
      }
    })

  }

  createNew5x5(){
    this.gameService.createNewGame('5x5').subscribe(res => {
      if (res){
        const gameId = res.game_id
        this.router.navigate(['/multiplayer', gameId, '5x5'])
      }
    })
  }

  createNew10x10(){
    this.gameService.createNewGame('10x10').subscribe(res => {
      if (res){
        const gameId = res.game_id
        this.router.navigate(['/multiplayer', gameId, '10x10'])
      }
    })
  }
}
