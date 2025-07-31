import { Injectable, signal, WritableSignal} from '@angular/core';
import { AuthResponse, createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { LoginRequest, RegisterRequest } from '../types';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { User } from '../types';
import { SupaBaseService } from './supabase.service';
import { isInteropObservable } from 'rxjs/internal/util/isInteropObservable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private supabaseService: SupaBaseService) {}

  //currentUser: WritableSignal<User | null> = signal<User | null>(null);

  private _currentUser = new BehaviorSubject<User | null | undefined>(undefined);
  public currentUser$ = this._currentUser.asObservable()

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

  authInit() {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (event ==='SIGNED_IN'){
        this._currentUser.next({
          email: session?.user.email!,
          userName: session?.user.user_metadata?.['name'] ?? null,
          Id: session?.user.id
        })
      } else if (event ==='SIGNED_OUT') {
        this._currentUser.next(null)
      }
    })
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

  get currentUser(): User | null | undefined {
    return this._currentUser.value;
  }

}
