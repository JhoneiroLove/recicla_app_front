import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/service/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-centro-dashboard',
  templateUrl: './centro-dashboard.component.html',
  styleUrls: ['./centro-dashboard.component.css'],
})
export class CentroDashboardComponent implements OnInit {
  sidebarExpanded$: Observable<boolean>;

  constructor(private sidebarService: SidebarService) {
    this.sidebarExpanded$ = this.sidebarService.expanded$;
  }

  ngOnInit(): void {}
}
