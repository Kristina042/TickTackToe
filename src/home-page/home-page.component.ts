import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  router = inject(Router);
}
