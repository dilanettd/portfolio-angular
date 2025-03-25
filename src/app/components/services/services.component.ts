// services.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme/theme.service';

interface Service {
  icon: string;
  title: string;
  description: string;
  technologies: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  activeTab = 'frontend';
  frontendServices: Service[] = [];
  backendServices: Service[] = [];
  isDarkMode = false;

  // For intersection observer
  private observers: IntersectionObserver[] = [];

  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements de langue
    this.translateService.onLangChange.subscribe(() => {
      this.loadServices();
    });

    // S'abonner aux changements de thème
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this.loadServices();
  }

  ngAfterViewInit(): void {
    // Donnez un peu de temps aux éléments d'être rendu
    setTimeout(() => {
      this.initScrollReveal();
    }, 300);
  }

  ngOnDestroy(): void {
    // Nettoyage des observers pour éviter les fuites de mémoire
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
  }

  setActiveTab(tab: string): void {
    // Si le tab est déjà actif, ne rien faire
    if (this.activeTab === tab) return;

    // Changer de tab
    this.activeTab = tab;

    // Reset des animations pour le nouveau contenu
    setTimeout(() => {
      this.resetAnimationsForCurrentTab();
    }, 50);
  }

  private loadServices(): void {
    // Frontend services
    this.translateService
      .get('SERVICES.FRONTEND_SERVICES')
      .subscribe((services: any[]) => {
        this.frontendServices = services.map((service) => ({
          icon: service.icon,
          title: service.title,
          description: service.description,
          technologies: service.technologies,
        }));
      });

    // Backend services
    this.translateService
      .get('SERVICES.BACKEND_SERVICES')
      .subscribe((services: any[]) => {
        this.backendServices = services.map((service) => ({
          icon: service.icon,
          title: service.title,
          description: service.description,
          technologies: service.technologies,
        }));
      });
  }

  private initScrollReveal(): void {
    // Observer configuration
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // 10% of the element must be visible
    };

    // Observer for fade-up elements (titles, text)
    const fadeUpObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          fadeUpObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer for section itself to trigger initial content
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When the section becomes visible, ensure all active tab content is visible
            this.ensureActiveTabContentVisible();
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe the fade-up elements
    const fadeUpElements = document.querySelectorAll('.reveal-fade-up');
    fadeUpElements.forEach((element) => {
      fadeUpObserver.observe(element);
    });

    // Observe the section itself
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      sectionObserver.observe(servicesSection);
    }

    // Store observers for cleanup
    this.observers.push(fadeUpObserver, sectionObserver);

    // Initialize the slide-up elements for the current active tab
    this.initSlideUpElementsForCurrentTab();
  }

  private initSlideUpElementsForCurrentTab(): void {
    // Observer for slide-up elements (service cards)
    const slideUpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add an additional small delay for staggered animation
            setTimeout(() => {
              entry.target.classList.add('active');
            }, parseInt(entry.target.getAttribute('style')?.split('animation-delay:')[1]?.split('s')[0] || '0') * 1000);
            slideUpObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Only select slide-up elements from the active tab
    const activeTabContainer = document.querySelector(`.service-grid.active`);
    if (activeTabContainer) {
      const slideUpElements =
        activeTabContainer.querySelectorAll('.reveal-slide-up');
      slideUpElements.forEach((element) => {
        slideUpObserver.observe(element);
      });
    }

    // Store observer for cleanup
    this.observers.push(slideUpObserver);
  }

  private ensureActiveTabContentVisible(): void {
    // Force active tab content to be visible
    const activeTabContainer = document.querySelector(`.service-grid.active`);
    if (activeTabContainer) {
      activeTabContainer.classList.add('visible');

      // Activate all slide-up elements with proper delay
      const slideUpElements =
        activeTabContainer.querySelectorAll('.reveal-slide-up');
      slideUpElements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('active');
        }, 100 + index * 100); // Staggered delay
      });
    }
  }

  private resetAnimationsForCurrentTab(): void {
    // Remove active class from all slide-up elements in the new active tab
    const activeTabContainer = document.querySelector(`.service-grid.active`);
    if (activeTabContainer) {
      const slideUpElements =
        activeTabContainer.querySelectorAll('.reveal-slide-up');
      slideUpElements.forEach((element) => {
        element.classList.remove('active');
      });

      // Re-initialize animations for the current tab
      this.initSlideUpElementsForCurrentTab();

      // Force visibility after a small delay
      setTimeout(() => {
        this.ensureActiveTabContentVisible();
      }, 100);
    }
  }
}
