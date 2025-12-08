import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/service/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ong-dashboard',
  templateUrl: './ong-dashboard.component.html',
  styleUrls: ['./ong-dashboard.component.css'],
})
export class OngDashboardComponent implements OnInit {
  sidebarExpanded$: Observable<boolean>;

  constructor(private sidebarService: SidebarService) {
    this.sidebarExpanded$ = this.sidebarService.expanded$;
  }

  ngOnInit(): void {}
}
