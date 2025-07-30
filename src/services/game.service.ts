import { inject, Injectable } from '@angular/core';
import { SupaBaseService } from './supabase.service';
import { from, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { StatusBarComponent } from '../status-bar/status-bar.component';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  supabaseService = inject(SupaBaseService)
  authService = inject(AuthService)

  createNewGame(gameType: string): Observable<any> {
    const playerXId = this.authService.currentUser()?.Id

    const gameToCreate = {
      board_state: null,
      board_type: gameType,
      history: null,
      player_o_id: null,
      player_x_id: playerXId,
      winner: null,
    }

    const promise = this.supabaseService.client
      .from('Games')
      .insert(gameToCreate)
      .select('*')
      .single()

    return from(promise).pipe(map(result => result.data))
  }

  updateGame(gameId: number, dataToUpdate: {board_state: {}, history: {}}): Observable<any> {
    const promise = this.supabaseService.client
      .from('Games')
      .update(dataToUpdate)
      .match({game_id: gameId})

    return from(promise)
  }

  getBoardStateByGameId(gameId: number): Observable<any> {
    const promise = this.supabaseService.client
      .from('Games')
      .select('board_state')
      .eq('game_id', gameId)
      .single()

  return from(promise).pipe(map(result => result.data?.board_state));
}



}
