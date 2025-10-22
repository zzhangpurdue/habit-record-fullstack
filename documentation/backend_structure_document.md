# Backend Structure Document for habit-record-fullstack

This document outlines the backend architecture, hosting solutions, and infrastructure components for the habit-record-fullstack application. It is written in everyday language to ensure clarity for both technical and non-technical readers.

## 1. Backend Architecture

### Overall Design
- **Framework**: Next.js (App Router) provides routing, server-side rendering (SSR), and API route handling in one integrated framework.  
- **Language**: TypeScript ensures type safety across the entire codebase.  
- **ORM**: Drizzle ORM offers a type-safe way to interact with PostgreSQL, reducing runtime errors.  
- **Authentication**: Better Auth library manages user sessions, sign-up, and sign-in flows.  
- **Pattern**: The code follows a layered approach:
  1. **API Layer** – Next.js API routes handle HTTP requests.  
  2. **Service/Controller Layer** – Encapsulates business logic (e.g., habit creation, streak calculations).  
  3. **Data Access Layer** – Drizzle ORM performs database queries.  

### Scalability, Maintainability, Performance
- **Scalability**:  
  - API routes can be auto-scaled on Vercel.  
  - Database connections are pooled for efficiency.  
  - The serverless model lets you add new endpoints without infrastructure changes.  
- **Maintainability**:  
  - Clear folder structure separates concerns (`app/`, `components/`, `lib/`, `db/`).  
  - TypeScript and Drizzle ORM enforce consistent data shapes.  
  - Reusable UI components and server actions minimize duplication.  
- **Performance**:  
  - SSR delivers pre-rendered pages to reduce client load time.  
  - Static assets (CSS, JS) are served via CDN.  
  - Optional caching at the edge layer speeds up common API responses.

## 2. Database Management

### Technologies Used
- **Type**: Relational (SQL) database.  
- **System**: PostgreSQL.  
- **ORM & Migrations**:
  - Drizzle ORM for type-safe queries.  
  - Drizzle Kit for schema migrations (creating, updating tables).

### Data Structure and Practices
- **Tables**: `users`, `habits`, `completions`.  
- **Connection Management**: Connection pooling (e.g., pgBouncer) ensures efficient reuse of database connections.  
- **Backups & Recovery**: Regular automated backups via the managed database provider (AWS RDS, Supabase, etc.).  
- **Indexes**: Primary keys on `id` fields and foreign keys (`userId`, `habitId`) for fast lookups.  
- **Access Patterns**:
  - Read all habits for a specific user.  
  - Insert new completion records.  
  - Query completion history for charting.

## 3. Database Schema

Below is the schema for a PostgreSQL database in SQL format. It covers users, habits, and completions.

```sql
-- Users table (Better Auth integration)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL,    -- e.g., 'daily', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Completions table
CREATE TABLE completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)       -- Ensures one completion per habit per day
);
```

## 4. API Design and Endpoints

The backend uses RESTful Next.js API routes to perform CRUD operations. All routes require a valid user session.

- **Authentication Routes** (provided by Better Auth)
  - `POST /api/auth/signup` – Create a new user account.  
  - `POST /api/auth/signin` – Sign in an existing user.  
  - `POST /api/auth/signout` – End the user session.  

- **Habit Routes**
  - `GET /api/habits`  
    • Purpose: List all habits for the current user.  
    • Response: Array of habit objects.  
  - `POST /api/habits`  
    • Purpose: Create a new habit.  
    • Body: `{ name, frequency }`.  
    • Response: New habit object.  
  - `PATCH /api/habits/:habitId`  
    • Purpose: Update habit details.  
    • Body: Fields to update (e.g., `name`).  
  - `DELETE /api/habits/:habitId`  
    • Purpose: Remove a habit and its completions.  

- **Completion Routes**
  - `POST /api/habits/:habitId/completions`  
    • Purpose: Log a completion for today.  
    • Response: Completion record.  
  - `DELETE /api/habits/:habitId/completions/:date`  
    • Purpose: Remove a specific completion.  

## 5. Hosting Solutions

- **Application Hosting**: Vercel  
  - Auto-scales serverless functions for API routes.  
  - Built-in global CDN for static and SSR assets.  
  - Zero-config deployments from GitHub.  
- **Database Hosting**: Managed PostgreSQL (e.g., AWS RDS, Supabase)  
  - Automated backups and point-in-time recovery.  
  - High availability across regions.  
  - Easy scaling of storage and compute.

## 6. Infrastructure Components

- **Load Balancer & Edge Network**  
  - Vercel’s edge network routes users to the nearest server.  
- **CDN**  
  - Static files and SSR responses are cached at edge locations for low latency.  
- **Caching**  
  - Edge caching rules for API routes with predictable data (e.g., frequently read stats).  
  - Optionally integrate Redis for user-specific cache (session data, recent queries).  
- **Containerization (Local Dev)**
  - Docker & Docker Compose define services for the Next.js app and PostgreSQL.  
  - Ensures a consistent environment for all developers.

## 7. Security Measures

- **Authentication & Authorization**
  - Better Auth secures sessions with HTTP-only cookies.  
  - All API routes validate user sessions and check resource ownership before allowing access.  
- **Data Encryption**
  - TLS (HTTPS) for all client-server communication.  
  - Passwords stored as salted hashes (e.g., bcrypt).  
- **Environment Variables**
  - Secrets (database URL, JWT keys) are stored in environment variables, not code.  
- **Input Validation & Sanitization**
  - Use Zod (or similar) to validate request bodies and query parameters.  
  - ORM queries prevent SQL injection.
- **Security Headers**
  - Content Security Policy, X-Frame-Options, and other headers enforced by Next.js.

## 8. Monitoring and Maintenance

- **Logging & Error Tracking**
  - Integrate Sentry (or similar) for capturing runtime errors and performance metrics.  
  - Use structured logs (Winston, Pino) for API requests and database errors.  
- **Health Checks**
  - Simple ping endpoint (`GET /api/health`) to verify service is alive.  
- **Performance Monitoring**
  - Vercel Analytics for real-time performance data (latency, error rates).  
  - Database monitoring via provider dashboard (CPU, connections, slow queries).  
- **Scheduled Maintenance**
  - Drizzle Kit migrations are applied automatically on deployment or manually via CLI.  
  - Regular dependency updates and security patch reviews managed via GitHub Dependabot.

## 9. Conclusion and Overall Backend Summary

The backend for habit-record-fullstack combines Next.js, TypeScript, Drizzle ORM, and PostgreSQL to deliver a robust, scalable foundation for a habit-tracking app. Authentication is handled securely by Better Auth, while API routes and server actions provide the core CRUD operations for habits and completions. Hosting on Vercel and a managed PostgreSQL service ensures reliability, global performance, and minimal operational overhead.

Unique strengths of this setup include:
- Fully type-safe stack from front end to database queries.  
- Fast server-side rendering paired with edge caching for a lightning-quick user experience.  
- Clear separation of concerns and modular components for easy extension and maintenance.

With this architecture in place, developers can focus on adding features—streak calculations, reminders, advanced analytics—secure in the knowledge that the backend is stable, performant, and ready to grow with user needs.