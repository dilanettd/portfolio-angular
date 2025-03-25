import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // Add supported languages
    this.translate.addLangs(['fr', 'en']);

    // Set default language
    this.translate.setDefaultLang('fr');

    // Initialiser la langue au démarrage
    this.initLanguage();

    // Subscribe to language changes to save in localStorage
    this.translate.onLangChange.subscribe((event) => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('selectedLanguage', event.lang);
      }
    });
  }

  /**
   * Initialise la langue au démarrage de l'application
   */
  private initLanguage(): void {
    // Vérifier si nous sommes dans un navigateur
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Try to get saved language from localStorage first
        const savedLanguage = localStorage.getItem('selectedLanguage');

        if (
          savedLanguage &&
          this.translate.getLangs().includes(savedLanguage)
        ) {
          // Si une langue a été sauvegardée et est valide, l'utiliser
          console.log('Using saved language:', savedLanguage);
          this.translate.use(savedLanguage);
          return;
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }

    // Si pas de langue sauvegardée ou pas dans un navigateur
    // Essayer d'utiliser la langue du navigateur
    const browserLang = this.translate.getBrowserLang();

    if (browserLang && this.translate.getLangs().includes(browserLang)) {
      console.log('Using browser language:', browserLang);
      this.translate.use(browserLang);
    } else {
      // Fallback sur le français
      console.log('Using default language: fr');
      this.translate.use('fr');
    }

    // Sauvegarder la langue sélectionnée initialement
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLanguage', this.translate.currentLang);
    }
  }

  /**
   * Change application language
   * @param lang Language code (e.g., 'fr', 'en')
   */
  changeLanguage(lang: string): void {
    console.log('Changing language to:', lang);
    this.translate.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLanguage', lang);
    }
  }

  /**
   * Get current language
   * @returns Current language code
   */
  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  /**
   * Get supported languages
   * @returns Array of supported language codes
   */
  getLanguages(): string[] {
    return this.translate.getLangs();
  }
}
