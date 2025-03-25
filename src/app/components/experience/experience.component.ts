import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme/theme.service';

interface ExperienceItem {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit, AfterViewInit, OnDestroy {
  experienceItems: ExperienceItem[] = [];
  isDarkMode = false;
  private observers: IntersectionObserver[] = [];

  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Charger les expériences lors du changement de langue
    this.translateService.onLangChange.subscribe(() => {
      this.loadExperiences();
    });

    // S'abonner aux changements de thème
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    // Charger les expériences au démarrage
    this.loadExperiences();
  }

  ngAfterViewInit(): void {
    // Donnez un peu de temps aux éléments d'être rendus
    setTimeout(() => {
      this.initScrollAnimations();
    }, 300);
  }

  ngOnDestroy(): void {
    // Nettoyage des observers pour éviter les fuites de mémoire
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
  }

  private loadExperiences(): void {
    this.translateService.get('EXPERIENCE.ITEMS').subscribe((items: any[]) => {
      this.experienceItems = items.map((item) => ({
        position: item.position,
        company: item.company,
        location: item.location,
        startDate: item.startDate,
        endDate: item.endDate,
      }));
    });
  }

  /**
   * Récupère le nom du fichier logo en fonction du nom de l'entreprise
   */
  getCompanyLogo(company: string): string {
    // Mapping des entreprises vers leurs fichiers logo
    const logoMap: { [key: string]: string } = {
      PaySika: 'paysika.webp',
      Mesintech: 'mesintech.png',
      TonkaIn: 'tonkain.jpg',
    };

    // Retourne le logo correspondant ou un logo par défaut
    return logoMap[company] || 'logo.png';
  }

  private initScrollAnimations(): void {
    // Configuration de l'observateur
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // 10% de l'élément doit être visible
    };

    // Observateur pour les éléments fade (titres, texte)
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observateur pour les éléments slide (expériences)
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Activer avec un délai pour effet de cascade
          setTimeout(() => {
            entry.target.classList.add('active');
          }, parseInt(entry.target.getAttribute('style')?.split('animation-delay:')[1]?.split('s')[0] || '0') * 1000);
          slideObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer la ligne de la roadmap
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          lineObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer tous les points de la roadmap
    const pointObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          pointObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer les éléments fade
    const fadeElements = document.querySelectorAll('.reveal-fade');
    fadeElements.forEach((element) => {
      fadeObserver.observe(element);
    });

    // Observer les éléments slide
    const slideElements = document.querySelectorAll('.reveal-slide');
    slideElements.forEach((element) => {
      slideObserver.observe(element);
    });

    // Observer la ligne de la timeline
    const lineElement = document.querySelector('.roadmap-line');
    if (lineElement) {
      lineObserver.observe(lineElement);
    }

    // Observer les points de la timeline
    const pointElements = document.querySelectorAll('.pulse-circle');
    pointElements.forEach((element) => {
      pointObserver.observe(element);
    });

    // Stocker les observateurs pour le nettoyage
    this.observers.push(
      fadeObserver,
      slideObserver,
      lineObserver,
      pointObserver
    );
  }
}
