import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../service/login.service';
import { SidebarService } from './../../service/sidebar.service';

@Component({
  selector: 'app-slidebar-ong',
  templateUrl: './slidebar-ong.component.html',
  styleUrls: ['./slidebar-ong.component.css']
})
export class SlidebarOngComponent implements OnInit {
  userName: string = '';
  expanded$;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private sidebarService: SidebarService
  ) {
    this.expanded$ = this.sidebarService.expanded$;
  }

  ngOnInit(): void {
    this.userName = this.loginService.getUserName();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
