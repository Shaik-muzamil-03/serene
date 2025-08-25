import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Public URL's
  const PUBLIC_URLS = ['/auth/login', '/auth/register', '/auth/user-details', '/auth/recover-password', '/auth/reset-password/']
  const isPublicURL = PUBLIC_URLS.some(p => req.url.includes(p));

  // Clone the request with withCredentials: true
  req = req.clone({ withCredentials: true });

  return next(req).pipe(
    catchError(err => {
      // Handle global auth errors
      if (!isPublicURL && (err.status === 401 || err.status === 403)) {
        router.navigate(['/login']);
      }

      throw err;
    })
  );
};
