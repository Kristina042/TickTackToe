import { inject, Injectable } from '@angular/core';
import { SupaBaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  supabaseService = inject(SupaBaseService)


  //sends userId
  //Expects: false
  //or true + gameId + other playerId(null if not connected yet)
  isGameRunning(userId: string){

  }
}
