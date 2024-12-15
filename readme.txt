This document describes the directory structure of the frontend part of the Happy Paws project.

Link to the project on Internet: https://happypaws1-ebf6715a6c46.herokuapp.com/

Directory Structure:

/frontend
|-- /src
|   |-- /components
|   |   |-- AchievementsSlider.js - Aleksei Petrishko [xpetri23] - Component for displaying an achievements slider on Home Page.
|   |   |-- AddPrescriptionForm.js - Aleksander Postelga [xposte00] - Form for adding prescriptions.
|   |   |-- AddRequestForm.js - Mikhail Vorobev [xvorob01] - Form for adding requests.
|   |   |-- AnimalCard.js - Mikhail Vorobev [xvorob01] & Aleksander Postelga [xposte00] - Card for displaying main details about an animal.
|   |   |-- BackToTop.js - Aleksei Petrishko [xpetri23] - Component for returning to the top of every page.
|   |   |-- Button.js - Aleksei Petrishko [xpetri23] - Universal button component used across the application.
|   |   |-- Calendar.js - Aleksei Petrishko [xpetri23] - Calendar for managing reservations with animals and displaying current user's reservations.
|   |   |-- Card.js - Aleksander Postelga [xposte00] - Universal card for displaying content in user dashboard.
|   |   |-- ErrorMessages.js - Mikhail Vorobev [xvorob01] - Displays error messages.
|   |   |-- FileUploader.js - Aleksei Petrishko [xpetri23] - Component for uploading photos to Cloudinary server.
|   |   |-- Footer.js - Aleksei Petrishko [xpetri23] - Footer of the application.
|   |   |-- Header.js - Aleksei Petrishko [xpetri23] - Header of the application.
|   |   |-- HomeSlider.js - Aleksei Petrishko [xpetri23] - Main slider on the homepage.
|   |   |-- icons.js - Aleksander Postelga [xposte00] - File for managing icons.
|   |   |-- ListItem.js - Mikhail Vorobev [xvorob01] - Component representing an individual list item.
|   |   |-- PrescriptionCard.js - Mikhail Vorobev [xvorob01] - Card with prescription details.
|   |   |-- PrescriptionListItem.js - Mikhail Vorobev [xvorob01] - List item for prescriptions.
|   |   |-- PrescriptionsCalendar.js - Aleksander Postelga [xposte00] - Calendar for managing prescriptions.
|   |   |-- Search.js - Aleksei Petrishko [xpetri23] - Component for searching animals on Reservations page and suggesting most frequently reserved animals.
|   |   |-- ShowMoreButton.js - Aleksander Postelga [xposte00] - Button for displaying more items.
|   |   |-- TreatmentListItem.js - Mikhail Vorobev [xvorob01] - List item for treatment procedures.
|   |   |-- TreatmentRequest.js - Mikhail Vorobev [xvorob01] - Form for treatment requests.
|   |   |-- UserBasicInfo.js - Aleksander Postelga [xposte00] - Component for displaying basic user information.
|   |   |-- UserHeader.js - Aleksei Petrishko [xpetri23] - Header for user sections with user's name, role and photo.
|   |   |-- UserNav.js - Mikhail Vorobev [xvorob01] - Navigation for user pages.
|   |   |-- UserReservations.js - Aleksander Postelga [xposte00] - Component for displaying user reservations.
|   |
|   |-- /context
|   |   |-- AppContext.js - Aleksei Petrishko [xpetri23] - Context for sharing suggested animals state between Search.js and Calendar.js on Reservations page.
|   |
|   |-- /pages
|       |-- AnimalDetails.js - Aleksander Postelga [xposte00] & Aleksei Petrishko [xpetri23] - Page with detailed information about a specific animal.
|       |-- Animals.js - Mikhail Vorobev [xvorob01] & Aleksei Petrishko [xpetri23] & Aleksander Postelga [xposte00] - Page displaying a list of available for walks animals.
|       |-- Home.js - Aleksei Petrishko [xpetri23] - Homepage of the application.
|       |-- LoginPage.js - Mikhail Vorobev [xvorob01] - Login page.
|       |-- PlannedWalks.js - Aleksander Postelga [xposte00] & Mikhail Vorobev [xvorob01] - Page for managing planned walks by Caretaker.
|       |-- Prescriptions.js - Aleksander Postelga [xposte00] & Mikhail Vorobev [xvorob01] - Page for managing prescriptions.
|       |-- RegisterPage.js - Mikhail Vorobev [xvorob01] - Registration page.
|       |-- Reservations.js - Aleksei Petrishko [xpetri23] - Page for animal walks reservations by Volunteers.
|       |-- UserGeneral.js - Aleksander Postelga [xposte00] & Aleksei Petrishko [xpetri23] - Page with general user information.
|       |-- UserReservationsConfirm.js - Aleksander Postelga [xposte00] & Mikhail Vorobev [xvorob01] - User reservation approvals page in Caretaker's dashboard.
|       |-- Users.js - Mikhail Vorobev [xvorob01] & Aleksander Postelga [xposte00] - Page for managing users by Admin.
|       |-- VeterinarianExaminations.js - Mikhail Vorobev [xvorob01] - Page for veterinarian examinations.
|       |-- Volunteers.js - Aleksander Postelga [xposte00] - Page with list of volunteers.
|
|-- App.css - Styles for the main components of the application.
|-- App.js - The main application component that initializes the app.
|-- App.test.js - Test files for App.js.
|-- cloudinaryConfig.js - Configuration for integration with Cloudinary (for users and animals photos management).
|-- config.js - General configuration settings for the project.
|-- index.css - Global styles for the application.
|-- index.js - Entry point of the application that renders React components into the DOM.
|-- reportWebVitals.js - Application performance monitoring.
|-- setupTests.js - Setup for unit testing.
|-- tailwind.config.js - Tailwind CSS configuration.
|-- .gitignore - File specifying ignored files for the Git versioning system.
|-- package.json - List of dependencies and scripts for the frontend project.
|-- package-lock.json - Lock file for dependency versions.
|-- Procfile - Configuration for deploying the application on Heroku.