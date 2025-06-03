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

  private router = inject(Router);

  navigateTo_3x3(){
    this.router.navigate(['3x3']);
  }

  navigateTo_10x10(){
    this.router.navigate(['10x10']);
  }
}
