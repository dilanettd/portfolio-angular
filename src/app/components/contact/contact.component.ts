import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { EmailService } from '../../services/email/email.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;
  formSubmitted = false;
  formSubmitSuccess = false;
  isDarkMode = false;
  private observers: IntersectionObserver[] = [];

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private emailService: EmailService,
    private themeService: ThemeService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // S'abonner au service de thème pour la détection du mode sombre
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngAfterViewInit(): void {
    // Give the DOM time to load
    setTimeout(() => {
      this.initAnimations();
    }, 300);
  }

  ngOnDestroy(): void {
    // Clean up observers to prevent memory leaks
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
  }

  get name(): AbstractControl {
    return this.contactForm.get('name')!;
  }

  get email(): AbstractControl {
    return this.contactForm.get('email')!;
  }

  get subject(): AbstractControl {
    return this.contactForm.get('subject')!;
  }

  get message(): AbstractControl {
    return this.contactForm.get('message')!;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      // Mark all fields as touched to display errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    // Send email using the service
    this.emailService
      .sendEmail(this.contactForm.value)
      .pipe(
        finalize(() => {
          // This code runs regardless of success or failure
          setTimeout(() => {
            this.formSubmitted = false;
          }, 5000);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Email response:', response);
          this.isSubmitting = false;
          this.formSubmitted = true;
          this.formSubmitSuccess = response.success;

          if (response.success) {
            // Reset the form on success
            this.contactForm.reset();
          }
        },
        error: (error) => {
          console.error('Email sending error:', error);
          this.isSubmitting = false;
          this.formSubmitted = true;
          this.formSubmitSuccess = false;
        },
      });
  }

  private initAnimations(): void {
    // Options for the observers
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // 10% of the element must be visible
    };

    // Observer for fade elements
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer for elements entering from the left
    const leftObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          leftObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer for elements entering from the right
    const rightObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          rightObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer for contact information elements
    const infoItemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add a delay for cascade animation
          setTimeout(() => {
            entry.target.classList.add('active');
          }, index * 150);
          infoItemObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all fade elements
    const fadeElements = document.querySelectorAll('.reveal-fade');
    fadeElements.forEach((element) => {
      fadeObserver.observe(element);
    });

    // Observe elements entering from the left
    const leftElements = document.querySelectorAll('.reveal-left');
    leftElements.forEach((element) => {
      leftObserver.observe(element);
    });

    // Observe elements entering from the right
    const rightElements = document.querySelectorAll('.reveal-right');
    rightElements.forEach((element) => {
      rightObserver.observe(element);
    });

    // Observe contact information elements
    const infoItems = document.querySelectorAll('.contact-info-item');
    infoItems.forEach((element) => {
      infoItemObserver.observe(element);
    });

    // Store observers for cleanup
    this.observers.push(
      fadeObserver,
      leftObserver,
      rightObserver,
      infoItemObserver
    );
  }
}
