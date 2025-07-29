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

  // createGame(playerXId: string, boardType: string): Observable<any> {
  //   const insertPromise = this.supabaseService.client
  //     .from('Games')
  //     .insert([
  //       {
  //         player_x_id: playerXId,
  //         board_type: boardType,
  //         board_state: {}, // Optional: empty board object
  //         history: []      // Optional: empty move history
  //       }
  //     ])
  //     .select()
  //     .single();

  //   return from(insertPromise);
  // }

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

    //select('*') means it will craete a new row and respond with all its fields
    const promise = this.supabaseService.client
      .from('Games')
      .insert(gameToCreate)
      .select('*')
      .single()

    return from(promise).pipe(
      map(result => result.data)
    )
  }




}
