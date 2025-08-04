import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, filter, map, of, take } from 'rxjs';

export const authorizedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

 return authService.currentUser$.pipe(
    filter(user => user !== undefined),
    take(1),
    map(user => user ? true : router.createUrlTree(['/'])),
    catchError(() => of(router.createUrlTree(['/'])))
  )
}
