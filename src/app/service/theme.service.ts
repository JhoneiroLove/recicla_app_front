import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('darkMode');
    const isDark = savedTheme === 'true';
    this.darkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }

  toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    console.log('Toggling dark mode to:', newValue);
    this.darkModeSubject.next(newValue);
    localStorage.setItem('darkMode', newValue.toString());
    this.applyTheme(newValue);
  }

  private applyTheme(isDark: boolean): void {
    console.log('Applying theme, isDark:', isDark);
    console.log('Document element:', document.documentElement);
    if (isDark) {
      document.documentElement.classList.add('dark');
      console.log('Added dark class, classes:', document.documentElement.className);
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class, classes:', document.documentElement.className);
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
