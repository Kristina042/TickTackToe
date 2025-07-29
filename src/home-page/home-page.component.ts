import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  router = inject(Router);
  authService = inject(AuthService)

  logout() {
    this.authService.logout()
  }

  createNew3x3() {
    //1 ask database if currUser has an ongoing game

    //if yes redirect to ongoing game with game id in url

    //if not send request to server to create new game
    //in request include user id and board size

    //redirect to game page with game id that i will recieve in responce
  }
}
