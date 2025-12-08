import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/service/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  isExpanded: boolean = true;
  private subscription: Subscription = new Subscription();

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.subscription = this.sidebarService.expanded$.subscribe(
      (state: boolean) => this.isExpanded = state
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
