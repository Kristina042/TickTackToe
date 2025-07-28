import { Injectable, signal, WritableSignal} from '@angular/core';
import { AuthResponse, createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { LoginRequest, RegisterRequest } from '../types';
import { from, Observable } from 'rxjs';
import { User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY)

  currentUser: WritableSignal<User | null> = signal<User | null>(null);

  register(user: RegisterRequest): Observable<AuthResponse> {
    const promise = this.supabase.auth.signUp({
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
    const promise = this.supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password
    })

    return from(promise)
  }




}
