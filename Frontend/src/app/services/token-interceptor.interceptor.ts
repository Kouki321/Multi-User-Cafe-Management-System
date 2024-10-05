import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // If token exists, clone the request and add the Authorization header
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // Handle the request and catch errors
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // Check if error is a HttpErrorResponse and handle 401/403 errors
        if (err instanceof HttpErrorResponse) {
          console.error(`Error Status: ${err.status} - Error URL: ${err.url}`);
          
          if (err.status === 401 || err.status === 403) {
            // Clear token and navigate to login if not already on the login page
            if (this.router.url !== '/') {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        }

        // Re-throw the error to propagate it to the rest of the app
        return throwError(() => err?.message);
      })
    );
  }
}
