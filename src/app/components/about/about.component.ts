// about.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Typed from 'typed.js';
import { ThemeService } from '../../services/theme/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('typedElement') typedElement!: ElementRef;

  private platformId = inject(PLATFORM_ID);

  currentLang = 'fr';
  typedInstance: Typed | null = null;
  isDarkMode = false;

  typewriterTexts: string[] = [];

  private langChangeSubscription: Subscription | null = null;
  private themeSubscription: Subscription | null = null;

  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translateService.currentLang || 'fr';

    // Subscribe to language changes
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      (event) => {
        console.log('Language changed in AboutComponent:', event.lang);
        this.currentLang = event.lang;

        // Update typed text strings based on current language
        this.updateTypedStrings();

        // Restart typed instance when language changes
        if (this.typedInstance) {
          this.typedInstance.destroy();
          this.initTyped();
        }
      }
    );

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => {
        this.isDarkMode = isDark;
      }
    );

    // Initialize typed text strings
    this.updateTypedStrings();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize typed.js
      this.initTyped();

      // Scroll reveal animation
      this.initScrollReveal();
    }
  }

  ngOnDestroy(): void {
    // Destroy typed instance when component is destroyed
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }

    // Unsubscribe from subscriptions
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }

    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private updateTypedStrings(): void {
    // Get the typed strings from translation files
    this.translateService
      .get('INTRO.TYPED_TEXTS')
      .subscribe((texts: string[]) => {
        if (texts && Array.isArray(texts)) {
          this.typewriterTexts = texts;

          // Update typed instance if it exists
          if (this.typedInstance) {
            this.typedInstance.destroy();
            this.initTyped();
          }
        }
      });
  }

  private initTyped(): void {
    // Make sure the element is available
    if (!this.typedElement) return;

    // Initialize typed.js
    this.typedInstance = new Typed(this.typedElement.nativeElement, {
      strings: this.typewriterTexts,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: '|',
      autoInsertCss: true,
    });
  }

  private initScrollReveal(): void {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;

      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);

    // Trigger once on load
    setTimeout(revealOnScroll, 300);
  }
}
