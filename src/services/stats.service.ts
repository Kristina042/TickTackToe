import { inject, Injectable } from '@angular/core';
import { SupaBaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  supabaseService = inject(SupaBaseService)
  authService = inject(AuthService)

  getAllStats() {
    const GamesPromise = this.supabaseService.client
      .from('Games')
      .select('*')

    const Games$ = from(GamesPromise).pipe(map(res => res.data))

    return Games$
  }

}
