import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Server Error: ${error.status} - ${error.message}`;

        // Handle specific status codes
        switch (error.status) {
          case 401:
            // Unauthorized - redirect to login
            authService.signOut();
            errorMessage = 'Session expired. Please login again.';
            break;
          case 403:
            errorMessage = 'Access denied.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
        }
      }

      // Log error (only in development)
      if (!environment.production) {
        console.error('HTTP Error:', error);
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};

// You'll need to import environment
import { environment } from '../../../environments/environment';
