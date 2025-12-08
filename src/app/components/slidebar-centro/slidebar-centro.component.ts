import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { SidebarService } from '../../service/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-slidebar-centro',
  templateUrl: './slidebar-centro.component.html',
  styleUrls: ['./slidebar-centro.component.css'],
})
export class SlidebarCentroComponent implements OnInit {
  userName: string = '';
  expanded$: Observable<boolean>;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private sidebarService: SidebarService
  ) {
    this.expanded$ = this.sidebarService.expanded$;
  }

  ngOnInit(): void {
    const user = this.loginService.getUser();
    this.userName = user?.nombre || user?.username || 'Usuario';
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
