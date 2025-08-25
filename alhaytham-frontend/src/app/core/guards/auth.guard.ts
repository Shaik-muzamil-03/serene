import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../domain/auth/services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isLoggedIn().pipe(
    map(loggedIn => loggedIn ? true : router.createUrlTree(['/login']))
  );
};

