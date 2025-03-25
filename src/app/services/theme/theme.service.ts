import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    // Check for saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');

    // Check for system preference if no saved preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.setTheme(prefersDark);
    } else {
      this.setTheme(savedTheme === 'dark');
    }

    // Listen for system preference changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches);
        }
      });
  }

  toggleTheme(): void {
    this.setTheme(!this.darkModeSubject.value);
  }

  private setTheme(isDark: boolean): void {
    // Update subject
    this.darkModeSubject.next(isDark);

    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
