import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const routeRoles: string[] = route.data['roles'];
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userObj = JSON.parse(user);
      if ((routeRoles[0] === 'admin' && userObj.userName === 'admin') ||
          (routeRoles[0] === 'user' && userObj.userName !== 'admin')) {
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
