import { Injectable } from '@angular/core';
import { AuthResponse } from '@supabase/supabase-js';
import { LoginRequest, RegisterRequest } from '../types';
import { BehaviorSubject, from, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../types';
import { SupaBaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private supabaseService: SupaBaseService) {}
  private _currentUser = new BehaviorSubject<User | null | undefined>(undefined);
  public currentUser$ = this._currentUser.asObservable()

register(user: RegisterRequest): Observable<AuthResponse> {
  return from(
    this.supabaseService.client.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name, // stored in user_metadata (optional)
        },
      },
    })
  ).pipe(
    switchMap(({ data, error }) => {
      if (error || !data.user) {
        return throwError(() => error || new Error('User registration failed'));
      }

      // Insert into profiles table
      const insertPromise = this.supabaseService.client
        .from('profiles')
        .insert({
          id: data.user.id,     // match auth.users.id
          name: user.name,
        });

      return from(insertPromise).pipe(
        switchMap(({ error: insertError }) => {
          if (insertError) {
            return throwError(() => insertError);
          }

          // Registration + profile insert succeeded
          return of({ data, error: null });
        })
      );
    })
  );
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

  getNameById(id: string | null) {
    const promise = this.supabaseService.client
      .from('profiles')
      .select('name')
      .eq('id', id)
      .single()

    return from(promise)
  }

  get currentUser(): User | null | undefined {
    return this._currentUser.value;
  }


}
