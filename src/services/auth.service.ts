import { Injectable } from '@angular/core';
import { AuthResponse } from '@supabase/supabase-js';
import { LoginRequest, RegisterRequest } from '../types';
import { BehaviorSubject, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../types';
import { SupaBaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private supabaseService: SupaBaseService) {}
  private _currentUser = new BehaviorSubject<User | null | undefined>(undefined);
  public currentUser$ = this._currentUser.asObservable()

  private isUserSignedIn$$ = new BehaviorSubject<boolean | null>(null)
  public isUserSignedIn$ = this.isUserSignedIn$$.asObservable()

  initialized = false

register(user: RegisterRequest): Observable<AuthResponse> {
  return from(
    this.supabaseService.client.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
        },
      },
    })
  ).pipe(
    switchMap(({ data, error }) => {
      if (error || !data.user) {
        return throwError(() => error || new Error('User registration failed'));
      }

      const insertPromise = this.supabaseService.client
        .from('profiles')
        .insert({
          id: data.user.id,
          name: user.name,
        });

      return from(insertPromise).pipe(
        switchMap(({ error: insertError }) => {
          if (insertError) {
            return throwError(() => insertError);
          }

          return of({ data, error: null });
        })
      );
    })
  );
}

  authInit() {

    if (this.initialized) return;
    this.initialized = true;

    // 1. Immediately check session
    this.supabaseService.client.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session) {
        this.isUserSignedIn$$.next(true);
        this._currentUser.next({
          email: session.user.email!,
          userName: session.user.user_metadata?.['name'] ?? null,
          Id: session.user.id
        });
      } else {
        this.isUserSignedIn$$.next(false);
        this._currentUser.next(null);
      }
    });

    // 2. Listen for future auth events
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.isUserSignedIn$$.next(true);
        this._currentUser.next({
          email: session?.user.email!,
          userName: session?.user.user_metadata?.['name'] ?? null,
          Id: session?.user.id
        });
      } else if (event === 'SIGNED_OUT') {
        this.isUserSignedIn$$.next(false);
        this._currentUser.next(null);
      }
    });
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

  getNameById(id: string | null): Observable<string> {
    const promise = this.supabaseService.client
      .from('profiles')
      .select('name')
      .eq('id', id)
      .single()

    return from(promise).pipe(map(res => res.data?.name))
  }

  get currentUser(): User | null | undefined {
    return this._currentUser.value;
  }


}
