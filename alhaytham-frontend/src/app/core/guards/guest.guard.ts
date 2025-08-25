import { inject } from '@angular/core';
import { CanActivateFn, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../domain/auth/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

export const GuestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoginPage = state.url.startsWith('/login');

  // Verify isLoggedIn only in login route
  if (isLoginPage) {
    return authService.isLoggedIn().pipe(
      map(loggedIn => loggedIn ? router.createUrlTree(['/dashboard']) : true)
    );
  }

  // For other routes just allow the access
  return of(true);
};
