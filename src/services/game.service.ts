import { inject, Injectable } from '@angular/core';
import { SupaBaseService } from './supabase.service';
import { from, map, Observable } from 'rxjs';
import { Database } from '../types/supabase';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  supabaseService = inject(SupaBaseService)
  authService = inject(AuthService)

  createNewGame(gameType: string): Observable<any> {
    const playerXId = this.authService.currentUser()?.Id
    const boardState = {"board":[["","X",""],["","0",""],["","",""]]}

    const gameToCreate = {
      board_state: boardState,
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

  updateGame(gameId: number, dataToUpdate: {state: {}, history: {}}): Observable<any> {
    const promise = this.supabaseService.client
      .from('Games')
      .update(dataToUpdate)
      .match({id: gameId})
      .select('*')
      .single()

    return from(promise).pipe(map(result => result.data))
  }



}
