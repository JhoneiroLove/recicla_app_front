import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/service/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slidebar',
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.css']
})
export class SlidebarComponent implements OnInit, OnDestroy {
  isExpanded: boolean = true;
  userName: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private sidebarService: SidebarService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.sidebarService.expanded$.subscribe(
      (state: boolean) => this.isExpanded = state
    );

    const user = this.loginService.getUser();
    this.userName = user?.username || 'Usuario';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
