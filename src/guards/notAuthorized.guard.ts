import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotAuthorizedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}


  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map((isAuth) => isAuth ? true : this.router.createUrlTree(['/']))
    )
  }
}