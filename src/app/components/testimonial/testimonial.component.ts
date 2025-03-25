import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  image: string;
}

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss'],
})
export class TestimonialComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sophie Martin',
      content:
        'Dilane a transformé notre vision en une plateforme web exceptionnelle. Sa compréhension de nos besoins métier et sa maîtrise technique ont fait toute la différence.',
      image: 'testimonial-1.jpg',
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      content:
        'Nous avons confié à Dilane le développement de notre application financière et les résultats ont dépassé nos attentes. Son expertise en Angular et Spring Boot a permis de livrer un produit stable et performant.',
      image: 'testimonial-2.jpg',
    },
    {
      id: 3,
      name: 'Émilie Leroy',
      content:
        'Dilane is a true asset to our company. He not only developed our e-commerce platform but also brought innovative ideas that improved the user experience.',
      image: 'testimonial-3.jpg',
    },
    {
      id: 4,
      name: 'Laurent Moreau',
      content:
        'Collaborating with Dilane has been an enriching experience. His methodical approach and passion for technology are truly impressive. A talented developer who goes beyond expectations.',
      image: 'testimonial-4.jpg',
    },
  ];

  currentTestimonial = 0;
  autoPlayInterval: any;
  visibleItems = 3;
  clonedTestimonials: Testimonial[] = [];
  private observer: MutationObserver | null = null;
  private resizeTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.createInfiniteLoop();
    window.addEventListener('resize', this.adjustVisibleItems.bind(this));

    // Attendre que le DOM initial soit chargé avant d'initialiser
    setTimeout(() => {
      this.adjustVisibleItems();
      this.calculateCardPositions();

      // Afficher explicitement le premier élément
      console.log(
        'Initialisation avec élément actif:',
        this.currentTestimonial
      );
      this.updateMobileVisibility();

      this.startAutoPlay();
    }, 100);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateCardPositions();
      if (this.visibleItems === 1) {
        this.updateMobileVisibility();
      }
    }, 500);

    document.querySelectorAll('.testimonial-card img').forEach((img) => {
      img.addEventListener('load', () => {
        this.calculateCardPositions();
      });
    });

    this.observer = new MutationObserver(() => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.calculateCardPositions();
      }, 200);
    });

    if (this.carouselTrack && this.carouselTrack.nativeElement) {
      this.observer.observe(this.carouselTrack.nativeElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    window.removeEventListener('resize', this.adjustVisibleItems.bind(this));

    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  createInfiniteLoop(): void {
    this.clonedTestimonials = [
      ...this.testimonials.slice(this.testimonials.length - 2),
      ...this.testimonials,
      ...this.testimonials.slice(0, 2),
    ];
    this.currentTestimonial = 2;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.calculateCardPositions();
    }, 100);
  }

  adjustVisibleItems(): void {
    const oldVisibleItems = this.visibleItems;

    if (window.innerWidth < 1024) {
      this.visibleItems = 1;
    } else {
      this.visibleItems = 3;
    }

    if (oldVisibleItems !== this.visibleItems) {
      // Reset all animations when switching modes
      document.querySelectorAll('.equal-height-card').forEach((card) => {
        (card as HTMLElement).style.animation = 'none';
      });

      // Apply appropriate layout
      setTimeout(() => {
        if (this.visibleItems === 1) {
          // Reset transform on carousel track for mobile view
          const carouselTrack = document.querySelector(
            '.carousel-track'
          ) as HTMLElement;
          if (carouselTrack) {
            carouselTrack.style.transform = 'none';
          }
          this.updateMobileVisibility();
        } else {
          // Reset for desktop view
          document.querySelectorAll('.equal-height-card').forEach((card) => {
            card.classList.remove('active-card');
            (card as HTMLElement).style.display = 'flex';
            (card as HTMLElement).style.opacity = '1';
          });
        }
        this.calculateCardPositions();
        this.cdr.detectChanges();
      }, 50);
    }
  }

  calculateCardPositions(): void {
    const fixedHeight = 350;

    // Set fixed height for cards
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card) => {
      (card as HTMLElement).style.height = `${fixedHeight}px`;
    });

    // For mobile mode, make sure the active element is visible and centered
    if (this.visibleItems === 1) {
      this.updateMobileVisibility();
    } else {
      // For desktop mode, all elements should be visible
      document.querySelectorAll('.equal-height-card').forEach((card) => {
        card.classList.remove('active-card');
        (card as HTMLElement).style.display = 'flex';
        (card as HTMLElement).style.position = 'relative';
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'none';
        (card as HTMLElement).style.zIndex = '1';
        (card as HTMLElement).style.animation = 'none';
      });
    }
  }

  nextTestimonial(): void {
    this.stopAutoPlay();

    if (this.visibleItems === 1) {
      // Find current active card and prepare to animate it out
      const currentCard = document.querySelector(
        '.equal-height-card.active-card'
      ) as HTMLElement;
      if (currentCard) {
        // Prepare exit animation
        currentCard.style.animation = 'slideOutLeft 0.5s forwards';
      }

      // Calculate next index with infinite loop handling
      const nextIndex =
        this.currentTestimonial >= this.clonedTestimonials.length - 3
          ? 2
          : this.currentTestimonial + 1;

      // Update current index
      this.currentTestimonial = nextIndex;

      // Wait for exit animation, then update visibility
      setTimeout(() => {
        this.updateMobileVisibility();

        // Add entrance animation to the new active card
        const newActiveCard = document.querySelector(
          '.equal-height-card.active-card'
        ) as HTMLElement;
        if (newActiveCard) {
          newActiveCard.style.animation = 'slideInRight 0.5s forwards';
        }
      }, 300);
    } else {
      // Desktop behavior
      this.currentTestimonial++;

      if (this.currentTestimonial >= this.clonedTestimonials.length - 2) {
        setTimeout(() => {
          const carousel = document.querySelector(
            '.carousel-track'
          ) as HTMLElement;
          if (carousel) carousel.style.transition = 'none';

          this.currentTestimonial = 2;

          setTimeout(() => {
            if (carousel)
              carousel.style.transition = 'transform 500ms ease-in-out';
            this.calculateCardPositions();
          }, 50);
        }, 500);
      }
    }

    this.startAutoPlay();
  }

  prevTestimonial(): void {
    this.stopAutoPlay();

    if (this.visibleItems === 1) {
      // Find current active card and prepare to animate it out
      const currentCard = document.querySelector(
        '.equal-height-card.active-card'
      ) as HTMLElement;
      if (currentCard) {
        // Prepare exit animation
        currentCard.style.animation = 'slideOutRight 0.5s forwards';
      }

      // Calculate previous index with infinite loop handling
      const prevIndex =
        this.currentTestimonial <= 2
          ? this.clonedTestimonials.length - 3
          : this.currentTestimonial - 1;

      // Update current index
      this.currentTestimonial = prevIndex;

      // Wait for exit animation, then update visibility
      setTimeout(() => {
        this.updateMobileVisibility();

        // Add entrance animation to the new active card
        const newActiveCard = document.querySelector(
          '.equal-height-card.active-card'
        ) as HTMLElement;
        if (newActiveCard) {
          newActiveCard.style.animation = 'slideInLeft 0.5s forwards';
        }
      }, 300);
    } else {
      // Desktop behavior
      this.currentTestimonial--;

      if (this.currentTestimonial < 2) {
        setTimeout(() => {
          const carousel = document.querySelector(
            '.carousel-track'
          ) as HTMLElement;
          if (carousel) carousel.style.transition = 'none';

          this.currentTestimonial = this.clonedTestimonials.length - 3;

          setTimeout(() => {
            if (carousel)
              carousel.style.transition = 'transform 500ms ease-in-out';
            this.calculateCardPositions();
          }, 50);
        }, 500);
      }
    }

    this.startAutoPlay();
  }

  goToTestimonial(index: number): void {
    const adjustedIndex = index + 2;
    if (adjustedIndex === this.currentTestimonial) return;

    this.stopAutoPlay();

    if (this.visibleItems === 1) {
      // Determine direction for animation
      const isNext = adjustedIndex > this.currentTestimonial;

      // Find current active card and prepare to animate it out
      const currentCard = document.querySelector(
        '.equal-height-card.active-card'
      ) as HTMLElement;
      if (currentCard) {
        // Prepare exit animation
        currentCard.style.animation = isNext
          ? 'slideOutLeft 0.5s forwards'
          : 'slideOutRight 0.5s forwards';
      }

      // Update current index
      this.currentTestimonial = adjustedIndex;

      // Wait for exit animation, then update visibility
      setTimeout(() => {
        this.updateMobileVisibility();

        // Add entrance animation to the new active card
        const newActiveCard = document.querySelector(
          '.equal-height-card.active-card'
        ) as HTMLElement;
        if (newActiveCard) {
          newActiveCard.style.animation = isNext
            ? 'slideInRight 0.5s forwards'
            : 'slideInLeft 0.5s forwards';
        }
      }, 300);
    } else {
      // Desktop behavior
      this.currentTestimonial = adjustedIndex;
      setTimeout(() => {
        this.calculateCardPositions();
      }, 100);
    }

    this.startAutoPlay();
  }

  updateMobileVisibility(): void {
    if (this.visibleItems !== 1) return;

    // First hide all cards
    const cards = document.querySelectorAll('.equal-height-card');
    cards.forEach((card, index) => {
      // Remove any existing active class
      card.classList.remove('active-card');

      // Set initial styles for all cards
      (card as HTMLElement).style.display = 'none';
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.zIndex = '1';
    });

    // Then, ensure the active card is visible and centered
    const activeCard = cards[this.currentTestimonial] as HTMLElement;
    if (activeCard) {
      activeCard.classList.add('active-card');
      activeCard.style.display = 'flex';
      activeCard.style.opacity = '1';
      activeCard.style.zIndex = '2';
      activeCard.style.position = 'relative';
      activeCard.style.left = '0';
      activeCard.style.right = '0';
      activeCard.style.margin = '0 auto';
    }
  }

  getOriginalIndex(clonedIndex: number): number {
    if (clonedIndex < 2) {
      return this.testimonials.length - 2 + clonedIndex;
    } else if (clonedIndex >= this.testimonials.length + 2) {
      return clonedIndex - (this.testimonials.length + 2);
    } else {
      return clonedIndex - 2;
    }
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextTestimonial();
    }, 6000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  handleImageError(event: any): void {
    if (!event.target.src.includes('default-avatar.jpg')) {
      event.target.src = 'assets/images/testimonials/avatar.jpg';
    }
  }
}
