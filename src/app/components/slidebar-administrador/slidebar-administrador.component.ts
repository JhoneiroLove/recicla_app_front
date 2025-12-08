import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../service/login.service';
import { SidebarService } from './../../service/sidebar.service';

@Component({
  selector: 'app-slidebar-administrador',
  templateUrl: './slidebar-administrador.component.html',
  styleUrls: ['./slidebar-administrador.component.css']
})
export class SlidebarAdministradorComponent implements OnInit {
  userName: string = '';
  isExpanded: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.userName = this.loginService.getUserName();
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
    this.sidebarService.setExpanded(this.isExpanded);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
