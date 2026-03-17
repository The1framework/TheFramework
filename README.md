Project Documentation

## Overview

This project is a modern, multilingual, SEO-first web application built using **React, TypeScript, Vite, and Tailwind CSS**. It serves as a scalable foundation for building high-performance, AI-ready, and search-optimized websites.

The architecture is designed with the following priorities:

* Multilingual support (EN / FR / AR)
* SEO and structured data compliance
* Performance and static deployment readiness
* Modular and reusable component system
* Clean separation of concerns (UI, routing, SEO, i18n, utilities)

---

## Project Structure

### Root Directory

#### `.vscode/`

Contains editor-specific configuration for Visual Studio Code.

* `settings.json`: Workspace-level settings (formatting, linting, TypeScript behavior).
* `launch.json`: Debug configurations.

---

#### `public/`

Static assets served directly without processing.

* `404.html`: SPA fallback page for routing (required for GitHub Pages).
* `favicon.ico`: Browser tab icon.
* `robots.txt`: Defines crawler rules for search engines.
* `sitemap.xml`: Lists all indexable URLs for SEO.
* `robot.glb`: 3D model used in the Hero section.
* `AchiDigital.jpeg`, `logo.png`, `image.png`, `placeholder.svg`: Branding and UI assets.

##### `public/tech/`

Technology stack icons used in the UI:

* GitHub, React, Tailwind, TypeScript, Vite, Node.js, etc.

---

#### `.env`

Environment variables used at build time (e.g., API keys, Supabase config).

---

#### `package.json`

Defines project dependencies, scripts, and metadata.

* Scripts include:

  * `dev`: Start development server
  * `build`: Production build
  * `preview`: Preview production build
  * `test`: Run tests

---

#### `package-lock.json` / `bun.lockb`

Dependency lock files ensuring consistent installs.

---

#### `vite.config.ts`

Configuration for Vite bundler.

* Handles build optimization
* Configures base path for GitHub Pages deployment
* Plugin setup

---

#### `vitest.config.ts`

Configuration for Vitest testing environment.

---

#### `tailwind.config.ts`

Tailwind CSS configuration:

* Design system (colors, spacing, typography)
* Custom utilities and animations

---

#### `postcss.config.js`

PostCSS configuration used by Tailwind.

---

#### `eslint.config.js`

Linting rules to enforce code quality and consistency.

---

#### `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

TypeScript configurations for different environments (app, node, tooling).

---

#### `index.html`

Main HTML entry point used by Vite.

---

#### `components.json`

Configuration for UI component system (shadcn-based structure).

---

## Source Code (`src/`)

### Entry Points

#### `main.tsx`

Application bootstrap:

* Mounts React app
* Wraps with global providers

---

#### `App.tsx`

Main application container:

* Defines global layout
* Integrates routing and shared components

---

#### `App.css` / `index.css`

Global styles and Tailwind base imports.

---

#### `vite-env.d.ts`

Type definitions for Vite environment variables.

---

## Components Architecture

### `src/components/`

#### `layout/`

Global layout components:

* `Header.tsx`: Navigation, language switcher
* `Footer.tsx`: Footer links and structure
* `PageLayout.tsx`: Wraps pages with consistent layout

---

#### `sections/`

Page sections used to build pages:

* `Hero.tsx`: Main landing section
* `HeroRobot3D.tsx`: 3D model integration using Three.js
* `About.tsx`, `AboutPage.tsx`: Company/brand information
* `AiAssistant.tsx`: SEO-indexable AI assistant section
* `Contact.tsx`: Contact form and information
* `FAQ.tsx`: Frequently asked questions
* `ProcessTimeline.tsx`: Step-by-step workflow visualization

---

#### `chatbot/`

AI chatbot system:

* `ChatbotWidget.tsx`: Floating chatbot entry point
* `ChatbotPanel.tsx`: Chat interface UI
* `useChatbot.ts`: State and logic management

---

#### `ui/`

Reusable UI components (based on shadcn + Radix UI):

Includes:

* Forms (input, textarea, select)
* Layout (card, dialog, drawer)
* Navigation (dropdown, menu, tabs)
* Feedback (toast, alert, progress)
* Data display (table, chart, badge)

Each component is modular and reusable across the application.

---

#### `NavLink.tsx`

Custom navigation link with routing and localization awareness.

---

#### `SEO.tsx`

Handles page-level SEO metadata:

* Title
* Description
* Open Graph tags

---

## Hooks (`src/hooks/`)

Custom React hooks:

* `useMagneticButton.ts`: Interactive button behavior
* `useMousePosition.ts`: Mouse tracking for UI effects
* `useScrollReveal.ts`: Scroll-based animations
* `useScrollHighlight.ts`: Section highlighting
* `use-mobile.tsx`: Responsive detection
* `use-toast.ts`: Toast notifications

---

## Internationalization (`src/i18n/`)

Multilingual system:

* `locales/`: Translation files (`en.json`, `fr.json`, `ar.json`)
* `useI18n.ts`: Hook for accessing translations
* `runtime.ts`: Runtime translation loader
* `index.ts`, `ts.ts`: Type-safe translation utilities

All UI text must be defined in translation files. No hardcoded strings are allowed.

---

## Pages (`src/pages/`)

Top-level routes:

* `Index.tsx`: Homepage
* `About.tsx`: About page
* `Services.tsx`: Services listing
* `ServiceSlug.tsx`: Dynamic service pages
* `Technologies.tsx`: Tech stack page
* `NotFound.tsx`: 404 fallback

---

## Routing (`src/routing/`)

* `LangRouter.tsx`: Handles multilingual routing (EN / FR / AR)
* `ScrollToTop.tsx`: Ensures scroll reset on navigation

---

## SEO System (`src/seo/`)

* `RouteSeo.tsx`: Injects SEO metadata per route
* `seoConfig.ts`: Central SEO configuration
* `urlUtils.ts`: URL normalization and canonical handling

---

## Utilities (`src/utils/`)

* `langRouting.ts`: Locale-aware path generation and parsing

---

## Library (`src/lib/`)

* `utils.ts`: Shared helper functions

---

## Testing (`src/test/`)

* `example.test.ts`: Sample test file
* `setup.ts`: Testing environment setup

---

## How to Run the Project

### Prerequisites

* Node.js (v18+ recommended)
* npm or bun

---

### Installation

```bash
npm install
```

---

### Development

```bash
npm run dev
```

---

### Build for Production

```bash
npm run build
```

---

### Preview Production Build

```bash
npm run preview
```

---

### Run Tests

```bash
npm run test
```

---

## Deployment

This project is designed for **GitHub Pages deployment**.

### Key Configuration

* Vite base path must match repository name
* SPA routing handled via `404.html`
* Static files served from `/public`

### Deployment Flow

1. Build project:

```bash
npm run build
```

2. Output generated in `dist/`

3. Deploy using GitHub Actions or manual upload to `gh-pages`

---

## Architecture Principles

* No hardcoded UI text (strict i18n)
* SEO-first rendering (HTML content always present)
* Component reusability and modular design
* Clean separation between UI, logic, and configuration
* Static-first deployment strategy

---

## Conclusion

This repository provides a scalable, production-ready foundation for building multilingual, SEO-optimized, and AI-integrated web applications. The architecture ensures maintainability, performance, and extensibility for future growth.
