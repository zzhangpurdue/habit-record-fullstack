# Project Requirements Document

## 1. Project Overview

This project, **habit-record-fullstack**, is a starter template for a habit-tracking web application built on Next.js (App Router) and TypeScript. It provides secure user authentication, an interactive dashboard, and a foundational database setup with Drizzle ORM and PostgreSQL. The goal is to let developers focus on habit-tracking logic right away, rather than boilerplate setup.

By the end of the first version, users should be able to sign up, log in, create and view their habits, mark daily completions, and see a simple streak chart. Success is measured by completing these core flows end-to-end, with data saved in the database and rendered in a responsive UI. The template is optimized for local development (Docker) and deployment on platforms like Vercel.

---

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**
- Email/password sign-up and sign-in using Better Auth
- Protected dashboard page after login
- Habit CRUD (Create, Read, Update, Delete) via Next.js API routes or Server Actions
- Habit completions: marking a habit as done for the current day
- Interactive area chart showing completion streaks over time
- Sortable data table listing habits with name, frequency, and streak
- Type-safe database schema with Drizzle ORM and PostgreSQL (tables: `users`, `habits`, `completions`)
- Responsive, component-based UI with shadcn/ui and Tailwind CSS v4
- Light/dark theming via next-themes
- Docker Compose setup for local PostgreSQL

**Out-of-Scope (Phase 2+):**
- Push or email reminders and notifications
- Advanced analytics (heatmaps, completion rates over custom intervals)
- Social features (sharing habits, leaderboards)
- Mobile app or React Native version
- Machine-learning habit suggestions or predictions
- Multi-language support
- CI/CD pipelines (beyond suggested GitHub Actions)

---

## 3. User Flow

When a new visitor lands on the homepage, they can choose to sign up with an email and password or log in if they already have an account. After submitting valid credentials, they are redirected to the `/dashboard` route, which runs server-side code to confirm their session and fetch their personal habit data from the database.

Once on the dashboard, the user sees a navigation sidebar (links to Dashboard, Settings, Logout) and a main content area. The top section displays an interactive area chart of their habit streaks. Below is a sortable table listing each habit’s name, frequency (e.g., daily), current streak, and action buttons: **Log Today**, **Edit**, and **Delete**. Clicking **Log Today** triggers an API call to record a completion, then updates the chart and table in place. A “New Habit” button opens a modal form to create additional habits.

---

## 4. Core Features

- **User Authentication**: Secure email/password flows, session management, protected routes.
- **Habit Management**: Create, read, update, delete habits tied to the current user.
- **Completion Logging**: Record daily completions with server-side validation to prevent duplicates.
- **Streak Chart**: Interactive area chart showing completion streaks over the last 30 days.
- **Habit Table**: Sortable, paginated list of habits with controls for logging and editing.
- **Theming**: Light/dark mode toggle with next-themes.
- **Database Integration**: Drizzle ORM schemas and migrations for `users`, `habits`, `completions`.
- **API Endpoints**: Next.js API routes or Server Actions for all CRUD operations.
- **Responsive UI**: Mobile-first design with Tailwind CSS and shadcn/ui components.
- **Local Development**: Docker Compose configuration with PostgreSQL container.

---

## 5. Tech Stack & Tools

- **Frontend Framework**: Next.js (App Router) with React
- **Language**: TypeScript for type safety
- **UI Library**: shadcn/ui (prebuilt React components)
- **Styling**: Tailwind CSS v4
- **Theming**: next-themes for light/dark mode switch
- **Authentication**: Better Auth (email/password)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Database**: PostgreSQL (in Docker for local dev)
- **API Routes**: Next.js API routes or Server Actions
- **Form Validation**: Zod + React Hook Form (optional but recommended)
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (optimized build)

---

## 6. Non-Functional Requirements

- **Performance**: Server-side rendered dashboard should TTFB < 200ms. Chart and table updates within 300ms of API calls.
- **Security**: OWASP top 10 compliance, HTTPS everywhere, secure cookies (HttpOnly, SameSite), salt-and-hash passwords.
- **Scalability**: Design API routes to handle hundreds of concurrent users; database connection pooling.
- **Accessibility**: WCAG 2.1 AA standards, keyboard navigation, aria-labels on interactive elements.
- **Reliability**: Zero data loss on habit logging; database transactions for all writes.
- **Usability**: Clear form validation errors, smooth mobile layout, consistent UI components.

---

## 7. Constraints & Assumptions

- **Auth Service**: Better Auth must support sessions and user management in your hosting environment.
- **Database Setup**: PostgreSQL instance available via Docker or managed service with connection string in `.env`.
- **Environment Variables**: `.env` file will store DB URL, Better Auth keys, NEXTAUTH_ settings.
- **Browser Support**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge).
- **Timezone**: All dates stored and displayed in UTC; client adjusts for local timezone.
- **Data Volume**: Initial design for tens of habits per user; no heavy analytics queries yet.

---

## 8. Known Issues & Potential Pitfalls

- **Static JSON Stub**: The dashboard currently reads static JSON. Must replace with Drizzle ORM queries to avoid stale data.
- **Duplicate Completions**: Users could click “Log Today” multiple times before UI update. Mitigate by unique constraint on `(habitId, date)` and server-side validation.
- **Race Conditions**: Simultaneous API calls might conflict. Use database transactions and optimistic UI updates.
- **Schema Migrations**: Drizzle Kit migrations must run before API routes are used. Document migration steps clearly.
- **Session Expiry**: If a user’s session expires while on the dashboard, API calls will fail. Handle 401 errors by redirecting to the login page.
- **Responsive Breakpoints**: Ensure table and chart components degrade gracefully on small screens; test on mobile viewport.

---

This document provides the definitive blueprint for building, testing, and deploying the first version of the habit-record-fullstack application. All development guidelines, API designs, and UI conventions should reference these requirements to maintain consistency and clarity.
