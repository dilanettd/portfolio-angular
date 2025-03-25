import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interface for contact form data
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Email sending response
export interface EmailResponse {
  success: boolean;
  message: string;
  status?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  // EmailJS configuration
  private readonly serviceId =
    environment.emailjs.serviceId || 'your_service_id';
  private readonly templateId =
    environment.emailjs.templateId || 'your_template_id';
  private readonly publicKey =
    environment.emailjs.publicKey || 'your_public_key';

  constructor() {
    // Initialize EmailJS with the public key
    emailjs.init(this.publicKey);
  }

  /**
   * Send an email using EmailJS
   * @param formData Contact form data
   * @returns Observable with email sending result
   */
  sendEmail(formData: ContactForm): Observable<EmailResponse> {
    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_name: 'Dilane',
      reply_to: formData.email,
      year: new Date().getFullYear().toString(),
      time: new Date().toLocaleString(),
    };

    // Send email
    return from(
      emailjs.send(this.serviceId, this.templateId, templateParams)
    ).pipe(
      map((response) => ({
        success: true,
        message: 'Email sent successfully',
        status: response.status,
      })),
      catchError((error) => {
        console.error('Error sending email:', error);
        return from([
          {
            success: false,
            message: error.text || 'Failed to send email',
            status: error.status,
          },
        ]);
      })
    );
  }
}
