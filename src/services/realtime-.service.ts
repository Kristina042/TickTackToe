import { inject, Injectable } from '@angular/core';
import { SupaBaseService } from './supabase.service';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private messagesSubject = new BehaviorSubject<any>(null);
  public messages$ = this.messagesSubject.asObservable();
  private channel!: RealtimeChannel;

  constructor(private supabaseService: SupaBaseService) {}

  subscribeToMessages(gameId: number): void {
    this.channel = this.supabaseService.client
      .channel('realtime:messages')
      // CR instead of using PSQL event you could create own "Message type" -> https://supabase.com/docs/guides/realtime/broadcast
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Games' }, (payload) => {
        const newMessage = payload.new

        if (newMessage['game_id'] == gameId) {
          this.messagesSubject.next(newMessage)
        }
      })
      .subscribe()
  }

  unsubscribe(): void {
    if (this.channel) {
      this.supabaseService.client.removeChannel(this.channel);
    }
  }
}
