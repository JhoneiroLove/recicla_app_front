import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root',
})
export class CentroAcopioGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      this.loginService.isLoggedIn() &&
      this.loginService.getUserRole() === 'CENTRO_ACOPIO'
    ) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
