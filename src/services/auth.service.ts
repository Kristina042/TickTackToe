import { Injectable, signal, WritableSignal} from '@angular/core';
import { AuthResponse, createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { LoginRequest, RegisterRequest } from '../types';
import { from, Observable } from 'rxjs';
import { User } from '../types';
import { SupaBaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private supabaseService: SupaBaseService) {}

  currentUser: WritableSignal<User | null> = signal<User | null>(null);

  register(user: RegisterRequest): Observable<AuthResponse> {
    const promise = this.supabaseService.client.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
        },
      },
    })

    return from(promise)
  }

  login(user: LoginRequest): Observable<AuthResponse> {
    const promise =  this.supabaseService.client.auth.signInWithPassword({
      email: user.email,
      password: user.password
    })

    return from(promise)
  }

  logout() {
     this.supabaseService.client.auth.signOut()
  }


}
