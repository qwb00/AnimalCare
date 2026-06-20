# Happy Paws — Animal Shelter Management System

**Happy Paws** is a full-stack web application for managing an animal shelter. It helps shelter staff and volunteers take care of rescued animals — keeping track of each animal's profile and medical history, scheduling walks, managing veterinary examinations and medication plans, and coordinating the people involved through a role-based access system.

The project consists of a **REST API** built with ASP.NET Core (.NET 8) and a **single-page client** built with React.

---

## Table of Contents

- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Default Accounts](#default-accounts)
- [API Overview](#api-overview)
- [License](#license)

---

## Features

- **Animal catalog** — browse, search and filter rescued animals by species, breed, size, sex, health status and behavioural traits, each with a detailed profile, photo and rescue history.
- **Walk reservations** — volunteers can reserve time slots to walk animals through an interactive calendar; caretakers review and approve or reject incoming requests.
- **Veterinary examinations** — caretakers create examination requests; veterinarians process them, set a diagnosis and update their status.
- **Medication schedules (prescriptions)** — veterinarians prescribe medication for animals with dosage, frequency and a treatment period.
- **User management** — administrators manage all user accounts and roles; caretakers verify and promote volunteers.
- **Authentication & authorization** — JWT-based authentication with fine-grained, role-based access control on every endpoint.
- **Image uploads** — animal and user photos are uploaded to and served from Cloudinary.
- **Interactive API docs** — Swagger UI is available in development for exploring and testing the API.

---

## User Roles

The system defines several roles, each with its own permissions and dashboard:

| Role | Responsibilities |
|------|------------------|
| **Administrator** | Full access. Manages users, roles, animals, examinations and medications. |
| **Caretaker** | Manages animals, approves walk reservations, creates examination requests, verifies volunteers. |
| **Veterinarian** | Handles examination records and prescribes medication schedules. |
| **Volunteer** | Browses animals and reserves walks. Can be *uncertified* (pending verification) or *certified* (approved). |

---

## Tech Stack

### Backend
- **.NET 8** / **ASP.NET Core Web API**
- **Entity Framework Core 8** (Code-First with migrations)
- **Microsoft SQL Server**
- **ASP.NET Core Identity** for user and role management
- **JWT Bearer** authentication
- **AutoMapper** for entity ↔ DTO mapping
- **Swashbuckle (Swagger / OpenAPI)** for API documentation

### Frontend
- **React 18**
- **React Router 6** for client-side routing
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **jwt-decode** for reading auth tokens
- **react-datepicker**, **react-select**, **react-range**, **react-toastify** for UI components
- **Cloudinary** for image hosting

---

## Architecture

The backend follows a layered **Onion / Clean Architecture**, split across multiple projects within a single solution. Dependencies point inward toward the domain, keeping business logic independent of infrastructure concerns.

```
┌─────────────────────────────────────────────┐
│  AnimalCare (Web API host, Program.cs)       │  <-- entry point, DI, middleware
├─────────────────────────────────────────────┤
│  AnimalCare.Presentation (Controllers)       │  <-- API endpoints, action filters
├─────────────────────────────────────────────┤
│  Service / Service.Contracts                 │  <-- business logic & service interfaces
├─────────────────────────────────────────────┤
│  Repositories / Contracts                    │  <-- data access, EF Core, DbContext
├─────────────────────────────────────────────┤
│  Models                                      │  <-- domain entities
│  Shared                                      │  <-- DTOs, enums, request features
└─────────────────────────────────────────────┘
```

**Key domain entities:** `Animal`, `User` (and its derived roles `Administrator`, `Caretaker`, `Veterinarian`, `Volunteer`), `Reservation`, `ExaminationRecord`, and `MedicationSchedule`.

The database schema is created and seeded automatically on first run via EF Core migrations and seed configurations (roles, demo users, sample animals, reservations, examinations and medication schedules).

---

## Project Structure

```
.
├── backend/
│   ├── AnimalCare/                  # Web API host: Program.cs, DI extensions,
│   │                               #   migrations, seed configuration
│   ├── AnimalCare.Presentation/     # Controllers and action filters
│   ├── Service/                     # Business logic implementation
│   ├── Service.Contracts/           # Service interfaces
│   ├── Repositories/                # EF Core DbContext, repositories, data seeding
│   ├── Contracts/                   # Repository interfaces
│   ├── Models/                      # Domain entities
│   ├── Shared/                      # DTOs, enums, request features (paging/filtering)
│   └── AnimalCare.sln               # Solution file
│
└── frontend/
    ├── public/                      # Static assets
    ├── src/
    │   ├── components/              # Reusable UI components (cards, forms,
    │   │                           #   calendars, header/footer, etc.)
    │   ├── context/                # React context (shared state)
    │   ├── pages/                  # Route-level pages (Home, Animals,
    │   │                           #   Reservations, Prescriptions, Users, …)
    │   ├── App.js                  # Root component & route definitions
    │   ├── config.js               # API base URL
    │   └── cloudinaryConfig.js     # Cloudinary upload settings
    ├── package.json
    └── tailwind.config.js
```

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v16 or newer) and npm
- [Microsoft SQL Server](https://www.microsoft.com/sql-server) (e.g. SQL Server Express or LocalDB)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Configure the database connection.**
   Update the `sqlConnection` connection string in `AnimalCare/appsettings.json` to point at your SQL Server instance, or provide it via the `AZURE_SQL_CONNECTION_STRING` environment variable.

3. **Set the JWT secret.**
   The application reads the token signing key from the `SECRET` environment variable. Set it to a long, random string (see [Configuration](#configuration)).

4. **Restore, build and run:**
   ```bash
   dotnet restore
   dotnet run --project AnimalCare
   ```

   On startup the application automatically applies EF Core migrations and seeds the database with roles, demo users and sample data.

5. **Open the API docs.**
   In development, Swagger UI is available at `https://localhost:<port>/swagger`.

> **Note:** If you need to create or apply migrations manually:
> ```bash
> dotnet ef migrations add <MigrationName> --project AnimalCare
> dotnet ef database update --project AnimalCare
> ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Point the client at your API.**
   Update the API base URL in `src/config.js` to match where your backend is running, for example:
   ```js
   const API_BASE_URL = 'https://localhost:<port>/api';
   export default API_BASE_URL;
   ```

4. **Configure Cloudinary.**
   Update `src/cloudinaryConfig.js` with your own Cloudinary cloud name and unsigned upload preset.

5. **Start the development server:**
   ```bash
   npm start
   ```

   The app runs at [http://localhost:3000](http://localhost:3000) by default.

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## Configuration

### Backend environment variables

| Variable | Description |
|----------|-------------|
| `SECRET` | Secret key used to sign JWT tokens. **Required.** |
| `AZURE_SQL_CONNECTION_STRING` | Optional. Overrides the connection string from `appsettings.json`. |

### `appsettings.json` (JWT settings)

```json
"JwtSettings": {
  "validIssuer": "AnimalCareAPI",
  "validAudience": "AnyClient",
  "expires": 30
}
```

### Frontend configuration files

- `src/config.js` — base URL of the backend API.
- `src/cloudinaryConfig.js` — Cloudinary upload URL and upload preset.

---

## Default Accounts

The database seeder creates a set of demo accounts you can use to explore the different roles.

| Role | Email | Password |
|------|-------|----------|
| Administrator | `admin1@gmail.com` | `Admin123!` |
| Veterinarian | `vet1@gmail.com` | `Vet123!` |
| Veterinarian | `vet2@gmail.com` | `Vet123!` |
| Caretaker | `caretaker1@gmail.com` | `CareTaker123!` |
| Volunteer | `volunteer1@gmail.com` | `Volunteer123!` |
| Volunteer | `volunteer2@gmail.com` | `Volunteer123!` |

---

## API Overview

All endpoints are served under the `/api` prefix. Most require a valid JWT in the `Authorization: Bearer <token>` header, and many are further restricted by role.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/authentication` | Register a new user |
| `POST` | `/api/authentication/login` | Authenticate and receive a JWT |

### Animals
| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/api/animals` | Public — list animals (with filtering & paging) |
| `GET` | `/api/animals/{id}` | Public — animal details |
| `POST` | `/api/animals` | Caretaker, Administrator |
| `PUT` / `PATCH` | `/api/animals/{id}` | Caretaker, Administrator |
| `DELETE` | `/api/animals/{id}` | Caretaker, Administrator |

### Reservations
| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/api/reservations` | List reservations (with filtering) |
| `GET` | `/api/reservations/{id}` | Authenticated |
| `GET` | `/api/reservations/user/{userId}` | Volunteer, Caretaker, Administrator |
| `POST` | `/api/reservations` | Authenticated |
| `PATCH` | `/api/reservations/{id}` | Authenticated |
| `DELETE` | `/api/reservations/{id}` | Caretaker, Administrator |

### Examinations
| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/api/examinations` | Caretaker, Administrator, Veterinarian |
| `GET` | `/api/examinations/{id}` | Caretaker, Administrator, Veterinarian |
| `POST` | `/api/examinations` | Caretaker, Administrator |
| `PATCH` | `/api/examinations/{id}` | Administrator, Veterinarian |
| `DELETE` | `/api/examinations/{id}` | Caretaker, Administrator, Veterinarian |

### Medications
| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/api/medications` | Caretaker, Administrator, Veterinarian |
| `GET` | `/api/medications/{id}` | Caretaker, Administrator, Veterinarian |
| `POST` | `/api/medications` | Veterinarian, Administrator |
| `PUT` | `/api/medications/{id}` | Administrator, Veterinarian |
| `DELETE` | `/api/medications/{id}` | Caretaker, Administrator, Veterinarian |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/api/users` | Administrator, Caretaker |
| `GET` | `/api/users/{id}` | Administrator |
| `GET` | `/api/users/me` | Authenticated |
| `POST` | `/api/users` | Administrator |
| `PATCH` | `/api/users/me` | Authenticated |
| `PATCH` | `/api/users/{id}` | Administrator, Caretaker |
| `PUT` | `/api/users/{userId}/role` | Authenticated |
| `DELETE` | `/api/users/{id}` | Administrator, Caretaker |

### Volunteers
| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/api/volunteers` | Caretaker, Administrator |
| `PATCH` | `/api/volunteers/{id}` | Caretaker, Administrator |

> For full request/response schemas, run the backend and explore the interactive **Swagger UI** at `/swagger`.

---

## License

This project is provided as-is for educational and demonstration purposes.
