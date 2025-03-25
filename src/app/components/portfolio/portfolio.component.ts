import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme/theme.service';

interface Project {
  id: number;
  title: string;
  description: string;
  images: string[]; // Tableau d'images au lieu d'une seule image
  category: string;
  technologies: string[];
  demoUrl?: string;
  codeUrl?: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
  animations: [
    trigger('projectAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.4s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  displayedProjects: Project[] = []; // Nouvelle propriété pour les projets affichés
  categories: string[] = [];
  activeCategory = 'all';
  isDarkMode = false;

  projectsPerPage = 3; // Changé de 6 à 3
  currentPage = 1;
  hasMoreProjects = false;

  // Observer for scroll animations
  private observer: IntersectionObserver | null = null;

  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to language changes
    this.translateService.onLangChange.subscribe(() => {
      this.loadProjects();
    });

    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this.loadProjects();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Setup scroll animations
      this.setupScrollAnimations();
    }
  }

  // Obtient l'image principale d'un projet
  getPrimaryImage(project: Project): string {
    return project.images && project.images.length > 0
      ? project.images[0]
      : 'default-image.png';
  }

  // Obtient l'image secondaire d'un projet
  getSecondaryImage(project: Project): string {
    return project.images && project.images.length > 1
      ? project.images[1]
      : this.getPrimaryImage(project);
  }

  private loadProjects(): void {
    this.translateService
      .get('PORTFOLIO.PROJECTS')
      .subscribe((projects: Project[]) => {
        this.allProjects = projects;

        // Extract unique categories
        this.categories = [
          ...new Set(projects.map((project) => project.category)),
        ];

        // Initialize with all projects
        this.filterCategory('all');

        // Re-initialize scroll animations when projects change
        setTimeout(() => {
          if (isPlatformBrowser(this.platformId)) {
            this.setupScrollAnimations();
          }
        }, 100);
      });
  }

  filterCategory(category: string): void {
    this.activeCategory = category;

    // Filtrer les projets en fonction de la catégorie
    if (category === 'all') {
      this.filteredProjects = [...this.allProjects];
    } else {
      this.filteredProjects = this.allProjects.filter(
        (project) => project.category === category
      );
    }

    // Reset pagination
    this.currentPage = 1;
    this.updateDisplayedProjects();

    // Re-initialize scroll animations after category change
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.setupScrollAnimations();
      }
    }, 100);
  }

  loadMoreProjects(): void {
    // Sauvegarder le nombre actuel de projets avant mise à jour
    const previousProjectCount = this.displayedProjects.length;

    this.currentPage++;
    this.updateDisplayedProjects();

    // Réinitialiser les animations pour les nouveaux éléments après chargement
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.setupScrollAnimationsForNewItems();

        // Faire défiler l'écran vers le premier nouvel élément
        if (previousProjectCount > 0) {
          const allProjects = document.querySelectorAll('.project-card');
          if (allProjects.length > previousProjectCount) {
            // Sélectionner le premier nouveau projet
            const firstNewProject = allProjects[previousProjectCount];
            this.scrollToElement(firstNewProject);
          }
        }
      }
    }, 100);
  }

  private updateDisplayedProjects(): void {
    const endIndex = this.currentPage * this.projectsPerPage;
    this.displayedProjects = this.filteredProjects.slice(0, endIndex);
    this.hasMoreProjects = endIndex < this.filteredProjects.length;
  }

  private setupScrollAnimations(): void {
    // Disconnect previous observer if exists
    if (this.observer) {
      this.observer.disconnect();
    }

    // Setup for regular reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;

      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);

    // Setup IntersectionObserver for project cards with staggered animation
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const delay = element.dataset['delay'] || '0';

            // Apply staggered animation
            element.style.transitionDelay = `${delay}s`;
            element.classList.add('revealed');

            // Unobserve after animation
            this.observer?.unobserve(element);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    // Observe all project cards
    document.querySelectorAll('.reveal-item').forEach((item) => {
      this.observer?.observe(item);
    });

    // Trigger once on load
    setTimeout(revealOnScroll, 300);
  }

  // Méthode spécifique pour les nouveaux éléments chargés
  /**
   * Prépare les animations pour les nouveaux éléments chargés
   */
  private setupScrollAnimationsForNewItems(): void {
    // Trouver tous les éléments qui ne sont pas encore révélés
    const newItems = document.querySelectorAll('.reveal-item:not(.revealed)');

    // S'assurer que l'observateur existe
    if (!this.observer) {
      this.setupScrollAnimations();
      return;
    }

    // Observer les nouveaux éléments
    newItems.forEach((item, index) => {
      // Forcer la révélation immédiate des nouveaux éléments
      const element = item as HTMLElement;
      const delay = element.dataset['delay'] || '0';
      element.style.opacity = '0';

      // Marquer l'élément comme un nouvel élément chargé
      element.classList.add('newly-loaded');

      // Appliquer l'animation avec un léger délai pour permettre le rendu
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition =
          'opacity 0.4s ease-out, transform 0.4s ease-out';
        element.style.transitionDelay = `${delay}s`;
        element.classList.add('revealed');
      }, 50);
    });

    // Aussi, mettre à jour les éléments reveal standards
    const windowHeight = window.innerHeight;
    document.querySelectorAll('.reveal:not(.active)').forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  /**
   * Effectue un défilement doux vers un élément spécifié
   * @param element L'élément vers lequel défiler
   */
  private scrollToElement(element: Element): void {
    if (!element) return;

    // Calculer la position de défilement
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Position à laquelle défiler (centre l'élément dans la vue)
    const targetPosition =
      rect.top + scrollTop - window.innerHeight / 2 + rect.height / 2;

    // Défiler avec une animation douce
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }

  ngOnDestroy(): void {
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Remove scroll event listener
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', () => {});
    }
  }
}
