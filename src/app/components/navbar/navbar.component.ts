import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './../../service/login.service';
import { ThemeService } from './../../service/theme.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName: string = '';
  userRole: string = '';
  isDarkMode = false;
  showLoginMenu = false;
  private themeSubscription?: Subscription;

  constructor(
    private loginService: LoginService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    // Suscribirse al estado del tema
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  ngDoCheck(): void {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    this.isLoggedIn = this.loginService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.loginService.getUserName();
      this.userRole = this.loginService.getUserRole();
    }
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  toggleLoginMenu() {
    this.showLoginMenu = !this.showLoginMenu;
  }

  redirectHome(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  navigateToDashboard(): void {
    if (this.isLoggedIn && this.userRole === 'PARTICIPANTE') {
      this.router.navigate(['/user/ver-estadistica']);
    }
  }

  public logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
