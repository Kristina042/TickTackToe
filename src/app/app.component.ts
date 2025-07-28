import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../types';
export interface stats {
  numXwins: number;
  numOwins: number;
  numTies: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'tikTackToe';

  authService = inject(AuthService)

  ngOnInit() {
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if (event ==='SIGNED_IN'){
        this.authService.currentUser.set({
          email: session?.user.email!,
          userName: session?.user.identities?.at(0)?.identity_data?.['username']
        })
      } else if (event ==='SIGNED_OUT') {
        this.authService.currentUser.set(null)
      }
    })
  }
}
