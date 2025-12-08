import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-slidebar-centro',
  templateUrl: './slidebar-centro.component.html',
  styleUrls: ['./slidebar-centro.component.css'],
})
export class SlidebarCentroComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
