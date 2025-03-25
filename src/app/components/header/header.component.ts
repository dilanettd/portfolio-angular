import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Renderer2,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme/theme.service';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  isMobileMenuOpen = false;
  isLangMenuOpen = false;
  isDarkMode = false;

  // Variable pour suivre si on est en train de scroller
  isScrolled = false;

  languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ];

  currentLang = 'fr'; // Définir français comme valeur par défaut

  private themeSubscription: Subscription | null = null;
  private langChangeSubscription: Subscription | null = null;
  private lastScrollTop = 0; // Pour détecter la direction du scroll

  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Récupérer la langue enregistrée dans localStorage
      const savedLang = localStorage.getItem('selectedLanguage');

      if (savedLang && this.translateService.getLangs().includes(savedLang)) {
        // Si une langue est sauvegardée et est valide, l'utiliser
        this.translateService.use(savedLang);
        this.currentLang = savedLang;
      } else {
        // Sinon, utiliser la langue par défaut (français)
        this.currentLang = this.translateService.getDefaultLang() || 'fr';
        this.translateService.use(this.currentLang);
      }

      // S'abonner aux changements de langue
      this.langChangeSubscription =
        this.translateService.onLangChange.subscribe((event) => {
          this.currentLang = event.lang;
          localStorage.setItem('selectedLanguage', event.lang);
        });

      // S'abonner aux changements de thème
      this.themeSubscription = this.themeService.isDarkMode$.subscribe(
        (isDark) => {
          this.isDarkMode = isDark;
        }
      );

      this.checkScroll();
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScroll();
    }
  }

  private checkScroll(): void {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollTop > 50) {
      this.renderer.addClass(
        this.el.nativeElement.querySelector('header'),
        'shadow-on-scroll'
      );
      this.isScrolled = true;
    } else {
      this.renderer.removeClass(
        this.el.nativeElement.querySelector('header'),
        'shadow-on-scroll'
      );
      this.isScrolled = false;
    }

    this.lastScrollTop = scrollTop;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isLangMenuOpen = false;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  changeLanguage(langCode: string): void {
    this.translateService.use(langCode);
    this.currentLang = langCode;
    localStorage.setItem('selectedLanguage', langCode);
  }
}
