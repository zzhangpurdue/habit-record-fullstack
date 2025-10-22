# Frontend Guideline Document

This document describes the frontend architecture, design principles, and technologies used in the **habit-record-fullstack** starter template. It’s written in everyday language so that anyone—technical or not—can understand how the frontend is set up.

## 1. Frontend Architecture

### Core Frameworks & Libraries
- **Next.js (App Router)**: Provides file-based routing, layouts, server-side rendering (SSR), and API routes. It keeps page and API logic organized in the `app/` directory.
- **TypeScript**: Adds type safety across components, pages, and data models, reducing bugs by catching mistakes at compile time.
- **shadcn/ui**: A modern, unstyled component library built on Radix UI. It offers building blocks such as `Button`, `Card`, `Table`, and `Dialog` for constructing interfaces quickly.
- **Tailwind CSS v4**: A utility-first CSS framework that accelerates styling and ensures consistency without writing custom CSS for every new component.
- **next-themes**: Manages light/dark mode toggling with minimal setup, preserving user preferences.
- **Better Auth**: Handles user sign-up, sign-in, and session management on both client and server sides.

### How It Supports Scalability, Maintainability & Performance
- **Modular Folder Structure**: Code is grouped by feature (`app/`, `components/`, `lib/`, `db/`), making it easy to find and extend functionality as the app grows.
- **Component-Driven Development**: Reusable components in `components/ui/` and feature-specific components (e.g., habits) reduce duplication and improve maintainability.
- **Server-Side Rendering & Server Actions**: Pages load quickly with SSR, and Server Actions simplify data mutations without a separate API client.
- **Type-Safe ORM (Drizzle)**: Ensures database queries match schema definitions, reducing runtime errors.
- **Docker & Docker Compose**: Provides a consistent local environment for the database, eliminating "works on my machine" issues.

## 2. Design Principles

### Key Principles
1. **Usability**: Interfaces are clear and intuitive, with straightforward flows for creating and logging habits.
2. **Accessibility (A11y)**: Components use semantic HTML, focus states, and ARIA attributes where needed. All interactive elements (buttons, forms) are keyboard-navigable.
3. **Responsiveness**: Layouts adapt to different screen sizes using Tailwind’s responsive utilities. The dashboard looks good on desktops, tablets, and phones.
4. **Consistency**: Styling and interaction patterns are uniform across the app, thanks to utility classes and a shared component library.

### Applying These Principles
- **Buttons and Forms**: Use consistent padding, rounded corners, and hover/focus states. Validate inputs immediately with React Hook Form + Zod (planned).
- **Charts & Tables**: Ensure text remains legible at all sizes. Provide alternative text or labels for screen readers.
- **Dark Mode**: Maintain sufficient contrast in dark mode by adjusting background and text colors via `next-themes`.

## 3. Styling and Theming

### Styling Approach
- **Utility-First with Tailwind CSS**: Avoids naming conflicts and promotes rapid styling. All classes live in the markup for quick visual feedback.
- **No BEM/SMACSS**: Tailwind’s atomic utilities replace traditional CSS methodologies.

### Theming
- **Light/Dark Mode**: Configured in `_app.tsx` (App Layout) using `next-themes`. Colors switch automatically based on system preference or user toggle.

### Visual Style
- **Design Style**: Modern, flat design with subtle shadows and rounded corners. You’ll find a balance between minimalism and clarity, avoiding heavy skeuomorphic effects.
- **Glassmorphism Accents**: On modal backdrops (dialogs) we use slight translucency (`bg-white/50` with `backdrop-blur`) for a modern feel.

### Color Palette
- Primary: `#2563EB` (blue-600)  
- Secondary: `#10B981` (green-500)  
- Accent: `#F59E0B` (amber-500)  
- Background (light): `#F9FAFB` (gray-50)  
- Background (dark): `#1F2937` (gray-800)  
- Surface (cards): `#FFFFFF` / `#111827`  
- Text (light): `#111827`  
- Text (dark): `#F9FAFB`

### Typography
- **Font Family**: `Inter`, a versatile, legible sans-serif.  
- **Fallbacks**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`  
- **Scale**: Use Tailwind’s font-size scale (`text-sm`, `text-base`, `text-lg`, etc.) for consistency.

## 4. Component Structure

### Organization
- **`app/`**: Holds page-level components, layouts (`layout.tsx`), and route handlers.
- **`components/ui/`**: Core reusable UI bits from shadcn/ui (buttons, dialogs, charts).
- **`components/habits/`**: Habit-specific components (e.g., `HabitList`, `HabitForm`, `StreakCounter`).
- **`lib/`**: Utility functions, authentication helpers (`auth.ts`), and API client abstractions.

### Reusability
- Break complex UIs into small pieces (e.g., a `HabitCard` with its own props and styles).
- Share low-level UI components (`Button`, `Card`, `Tooltip`) across features to maintain a single source of truth.

### Benefits of Component-Based Architecture
- **Isolation**: Each component manages its own logic and styles, reducing side effects.
- **Testability**: Smaller units are easier to test in isolation.
- **Scalability**: New features can reuse existing components, speeding up development.

## 5. State Management

### Approach
- **Local State**: `useState` and `useReducer` in individual components for form inputs and UI toggles.
- **Session State**: `useSession` (from Better Auth) or a custom React Context in `lib/auth-client.ts` to provide user info across the app.
- **Data Fetching**: Server Components (Next.js App Router) fetch data at the page level. For client-side revalidation or mutation, use React’s built-in hooks or plan to integrate libraries like SWR or React Query.

### Sharing State
- Session and theme are provided by context providers at the root layout.
- Feature-specific data (habits, completions) is fetched in server components and passed down as props, ensuring a smooth, data-driven UI.

## 6. Routing and Navigation

### Routing
- **File-Based**: Every folder in `app/` with a `page.tsx` becomes a URL. E.g., `app/dashboard/page.tsx` → `/dashboard`.
- **Nested Layouts**: `app/dashboard/layout.tsx` wraps all dashboard pages with a common header, sidebar, and theme switcher.

### Navigation
- **Next.js `Link`** component for client-side transitions without full reloads.
- **Sidebar & Header**: Provide links to core areas: Dashboard, Statistics, Settings, Log Out.
- **Protected Routes**: Server components check for a valid session; unauthenticated users get redirected to `/login`.

## 7. Performance Optimization

- **Server-Side Rendering (SSR)**: Pages render with data on the server, reducing initial load times and improving SEO.
- **Code Splitting**: Next.js automatically splits code by route. Use `dynamic()` to lazily load heavy components like charts.
- **Image Optimization**: Use the built-in `next/image` component for responsive, optimized images.
- **Tailwind JIT**: Generates only the CSS classes you use, keeping the stylesheet lean.
- **Caching & CDN**: Deploy on Vercel to leverage edge caching and global distribution.

## 8. Testing and Quality Assurance

### Unit Tests
- **Jest** with **React Testing Library**: Test individual components (e.g., `HabitForm`, `StreakCounter`) to ensure they render and handle interactions correctly.

### Integration Tests
- **Supertest** or **Next.js Testing Library**: Hit API routes (`/api/habits`, `/api/completions`) to verify CRUD operations and permission checks.

### End-to-End Tests
- **Playwright** or **Cypress**: Simulate user flows—sign up, create a habit, log completions, switch themes—ensuring the entire app works as expected.

### Linting & Formatting
- **ESLint** with the Next.js and TypeScript plugins for code consistency.
- **Prettier** for automatic code formatting.
- **Tailwind CSS Lint**: Ensure no unused or malformed utility classes.

## 9. Conclusion and Overall Frontend Summary

This frontend guideline lays out a clear, maintainable foundation for a habit-tracking application. We use Next.js App Router and TypeScript for robust routing and type safety; shadcn/ui and Tailwind CSS for rapid, consistent styling; and Better Auth plus Drizzle ORM for secure, type-safe data handling. Modular component design and a well-defined folder structure make the code easy to navigate and extend. Performance is enhanced with SSR, code splitting, and image optimization, while testing strategies ensure reliability. Altogether, these guidelines align with the project’s goals: creating a sleek, responsive, and secure habit tracker that’s both user-friendly and developer-friendly.