import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SupaBaseService } from '../services/supabase.service';

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

  supaBaseService = inject(SupaBaseService)

  ngOnInit() {
    this.authService.authInit()

  }
}
