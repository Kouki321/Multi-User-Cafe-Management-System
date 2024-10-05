import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstants } from '../shared/globa-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.handleUnauthenticatedAccess();
      return false;
    }

    let tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token);
    } catch (error) {
      this.handleInvalidToken();
      return false;
    }

    const expectedRoleArray = route.data?.expectedRole;
    // Check if expectedRoleArray is an array and not undefined
    if (!Array.isArray(expectedRoleArray)) {
      console.error('RouteGuardService: expectedRoleArray is undefined or not an array.');
      this.handleUnauthorizedAccess();
      return false;
    }

    // Check if the role matches one of the expected roles
    const userRole = tokenPayload?.role;
    if (expectedRoleArray.includes(userRole)) {
      if (this.auth.isAuthenticated()) {
        return true;  // Allow access
      } else {
        this.handleUnauthorizedAccess();
        return false;
      }
    }

    // Handle mismatched roles
    this.handleUnauthorizedAccess();
    return false;
  }

  private handleUnauthenticatedAccess() {
    console.error('RouteGuardService: No token found, redirecting to login.');
    this.snackbarService.openSnackBar(GlobalConstants.unauthroized, GlobalConstants.error);
    this.router.navigate(['/']);
  }

  private handleInvalidToken() {
    console.error('RouteGuardService: Invalid token, clearing localStorage and redirecting.');
    localStorage.clear();
    this.router.navigate(['/']);
  }

  private handleUnauthorizedAccess() {
    console.error('RouteGuardService: User is not authorized to access this route.');
    this.snackbarService.openSnackBar(GlobalConstants.unauthroized, GlobalConstants.error);
    this.router.navigate(['/cafe/dashboard']);
  }
}
