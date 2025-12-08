import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'recicla_upao';
  showNavbar: boolean = true;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // Verificar estado inicial
    this.updateNavbarVisibility(this.router.url);

    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateNavbarVisibility(event.url);
      });
  }

  private updateNavbarVisibility(url: string) {
    // Mostrar navbar solo en login, signup y home cuando NO hay sesión activa
    const publicRoutes = ['/login', '/signup', '/', '/welcome'];
    const isPublicRoute = publicRoutes.some(route => url === route || url.startsWith(route + '?'));
    const isLoggedIn = this.loginService.isLoggedIn();

    // Solo mostrar navbar si es ruta pública Y NO hay sesión activa
    this.showNavbar = isPublicRoute && !isLoggedIn;
  }
}
