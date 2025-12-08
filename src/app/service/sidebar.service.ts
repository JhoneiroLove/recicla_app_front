import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private expandedSubject = new BehaviorSubject<boolean>(false);
  public expanded$ = this.expandedSubject.asObservable();

  toggleSidebar(): void {
    this.expandedSubject.next(!this.expandedSubject.value);
  }

  setExpanded(value: boolean): void {
    this.expandedSubject.next(value);
  }

  isExpanded(): boolean {
    return this.expandedSubject.value;
  }
}
