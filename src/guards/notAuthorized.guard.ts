import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotAuthorizedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

    canActivate(): Observable<boolean | UrlTree> {
    this.authService.authInit()
    return this.authService.isUserSignedIn$.pipe(
     filter(val => val !== null),
      map((isAuth) => {
        console.log('Guard check, user:', isAuth)
        return !!isAuth ? this.router.createUrlTree(['/']) : true
      })
    )
  }
}