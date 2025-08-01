import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { create_board } from '../utils/boardUtils/board';

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
    const emptyBoard = create_board(3, 3)

    const history = { player:"unset",cellId: 0 }

    this.gameService.createNewGame('3x3', emptyBoard, history, 0).subscribe(res => {
      if (res){
        const gameId = res.game_id
        this.router.navigate(['/multiplayer', gameId, '3x3'])
      }
    })

  }

  createNew5x5(){
    const emptyBoard = create_board(5, 5)
    const history = { player:"unset",cellId: 0 }

    this.gameService.createNewGame('5x5', emptyBoard, history, 0).subscribe(res => {
      if (res){
        const gameId = res.game_id
        this.router.navigate(['/multiplayer', gameId, '5x5'])
      }
    })
  }

  createNew10x10(){
    const emptyBoard = create_board(10, 10)
    const history = { player:"unset",cellId: 0 }

    this.gameService.createNewGame('10x10', emptyBoard, history, 0).subscribe(res => {
      if (res){
        const gameId = res.game_id
        this.router.navigate(['/multiplayer', gameId, '10x10'])
      }
    })
  }
}
