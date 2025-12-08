import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OngGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      this.loginService.isLoggedIn() &&
      this.loginService.getUserRole() === 'ONG'
    ) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
