import { Component, inject } from '@angular/core';
import { StatsService } from '../services/stats.service';
import { CommonModule } from '@angular/common';
import { filter, forkJoin, map, mergeMap, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-stats-page',
  imports: [CommonModule],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.scss'
})
export class StatsPageComponent {

statsService = inject(StatsService)
authService = inject(AuthService)
currentUserId = this.authService.currentUser?.Id;


stats$ = this.statsService.getAllStats().pipe(
  map(stats => stats?.filter(stat => !!stat.winner) ?? []),  // Always return array
  switchMap(filteredStats => {
    if (filteredStats.length === 0) {
      return of([]); // ⛑ return an observable of an empty array if no stats
    }

    const enrichedStats$ = filteredStats.map(stat =>
      forkJoin({
        player_x_name: this.authService.getNameById(stat.player_x_id),
        player_o_name: this.authService.getNameById(stat.player_o_id),
      }).pipe(
        map(names => ({
          ...stat,
          ...names
        }))
      )
    );

    return forkJoin(enrichedStats$);  // ✅ array version of forkJoin
  }),
   map(stats =>
    stats.filter(stat =>
      stat.player_x_id === this.currentUserId || stat.player_o_id === this.currentUserId
    )
  )
);


}
