Dilane Portfolio - Angular 18
A professional portfolio developed with Angular 18 , Tailwind CSS , featuring light/dark theme functionality, and multilingual support (French/English).

Features
Responsive and Modern Design : Adaptable to all devices and screen sizes
.
Light/Dark Mode : Easily switch between themes with preference persistence.
Multilingual Support : Full support for French and English using @ngx-translate .
Smooth Animations : Scrolling animations and elegant transitions powered by Angular's Animation API.
Optimized Structure : Modular and maintainable Angular architecture.
Intuitive User Interface : Easy navigation and a polished user experience.
Sections
About : Personal introduction with floating element animations.
Services : Showcase of services offered (Frontend and Backend).
Experience : Professional journey presented in a timeline format.
Portfolio : Completed projects with category filtering.
Testimonials : Client reviews in a slider format.
Contact : Contact form and personal information.
Technologies Used
Frontend :
Angular 18
TypeScript
Tailwind CSS
RxJS
@ngx-translate
Angular Animation API
Backend :
Illustrated skills include:
Spring Boot / Spring Security
Flask / FastAPI / Django
Java / Python
Relational and NoSQL database

# Clone the repository

git clone https://github.com/your-username/portfolio-dilane.git

# Navigate into the project

cd portfolio-dilane

# Install dependencies

npm install

# Start the development server

ng serve
The site will be accessible at http://localhost:4200/.

Project Structure
The project follows a modular architecture with clear separation of responsibilities:

Components : Reusable components organized by section.
Services : Theme management and translation handling.
Directives : Custom directives such as clickOutside.
Assets : Static resources (images, translations, CV).
Customization
Theme
Primary colors are defined in the tailwind.config.js file and in src/app/styles/variables.scss.

Content
Texts are stored in translation files located at src/assets/i18n/fr.json and src/assets/i18n/en.json.

Images
Replace images in the src/assets/images/ folder while maintaining the folder structure.

Credits
Developed by: Dilane Tchinda Takoubo
Design: Original design inspired by modern UI/UX trends.
Illustrations and Icons: Font Awesome and custom resources.
License
MIT
