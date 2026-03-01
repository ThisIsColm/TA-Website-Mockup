# Tiny Ark — Creative Design Studio Website

A Next.js recreation of [prolab.framer.website](https://prolab.framer.website/), built with TypeScript, Tailwind CSS v4, and Framer Motion.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build
npm run start      # serve production build
```

---

## Phase 1 — Design Plan

### Page Inventory

| Page            | Route              | Description                                      |
|-----------------|--------------------|--------------------------------------------------|
| Home            | `/`                | Hero with glow, featured projects, about teaser, blog, CTA |
| Work Index      | `/work`            | 2-column project grid with project count         |
| Project Detail  | `/work/[slug]`     | Hero, meta grid, cover image, content, gallery, next project |
| Blog Index      | `/blog`            | 3-column blog post grid                          |
| Blog Post       | `/blog/[slug]`     | Centered article with cover image                |
| About           | `/about`           | Hero, values, services, process, contact CTA     |
| 404             | auto               | Custom not-found page                            |

### Layout System

- **Container**: max-width 1400px, responsive padding (24px → 40px → 64px)
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Spacing rhythm**: 8px base, sections use 80px (sm) / 128px (lg) vertical gaps
- **Grid**: 1-col mobile → 2-col (projects) / 3-col (blog) desktop

### Typography System

- **Font**: Inter (Google Fonts) — weights 300–700
- **Scale**: Hero: clamp(2.5rem, 6vw, 5rem), H2: clamp(1.75rem, 4vw, 3rem), Body: 17px, Small: 15px, Tiny: 12–13px
- **Tracking**: Headlines: -0.04em to -0.03em, Body: normal
- **Line-height**: Headlines: 1.05–1.1, Body: 1.6–1.8

### Color Palette (Dark Theme)

| Token             | Value     | Usage                         |
|-------------------|-----------|-------------------------------|
| `bg`              | `#141517` | Page background               |
| `bg-card`         | `#1a1b1e` | Card backgrounds              |
| `bg-elevated`     | `#222326` | Tags, elevated surfaces       |
| `border`          | `#2a2b2e` | Borders, dividers             |
| `text-primary`    | `#f5f5f7` | Headlines, primary text       |
| `text-secondary`  | `#8a8a8e` | Body text, descriptions       |
| `text-tertiary`   | `#5a5a5e` | Labels, metadata              |
| `accent`          | `#e8793a` | Accent color (warm orange)    |
| `accent-hover`    | `#f09050` | Accent hover state            |

### Interaction Specs

- **Card hover**: Image scales 105% over 700ms + dark overlay fade
- **Title hover**: Color transitions to accent (300ms)
- **Nav**: Sticky with scroll-triggered blur backdrop + border
- **Mobile menu**: Animated hamburger → X with slide-down menu (Framer Motion AnimatePresence)
- **Scroll reveals**: Elements fade in + translate up 40px as they enter viewport (-80px margin)
- **Hero**: Staggered entrance (headline → description → CTAs, 200ms delays)

### Component Map

```
Layout
├── Header (sticky, logo + centered nav + contact CTA)
│   └── MobileMenu (AnimatePresence slide-down)
├── Container (1400px max-width wrapper)
├── Footer (3-col links + oversized faded logo)
├── ScrollReveal (directional entrance wrapper)
├── SectionHeading (title + optional count)
├── ProjectCard (image + meta + tags)
├── ProjectGrid (2-col responsive grid)
├── PostCard (image + category badge + meta)
└── PostList (2/3-col responsive grid)
```

### Data Model

```typescript
interface Project {
  slug, title, excerpt, coverImage, tags[], date, year,
  role, services[], tools[], content, galleryImages[]
}

interface Post {
  slug, title, excerpt, date, author, coverImage, category, content
}
```

### Animation Approach: Framer Motion

**Why Framer Motion over Motion One:**
- Tighter React integration with declarative `motion.div` components
- Built-in `AnimatePresence` for mount/unmount animations (mobile menu)
- `useInView` hook for scroll-triggered reveals
- `whileInView` prop for staggered entrance animations
- More mature ecosystem and better TypeScript support

### Performance/Accessibility Checklist

- [x] `prefers-reduced-motion` respected (CSS + JS)
- [x] Semantic HTML (`header`, `nav`, `main`, `article`, `section`, `footer`)
- [x] `aria-label` on nav and interactive elements
- [x] `aria-expanded` on mobile menu toggle
- [x] Focus-visible styles (accent ring)
- [x] `next/image` for all images (lazy loading, format optimization)
- [x] Static generation for all pages (SSG)
- [x] Font-display: swap via Google Fonts
- [x] Selection styles for readability

---

## Parity Checklist

| Feature                          | Reference       | This Build      |
|----------------------------------|-----------------|-----------------|
| Dark theme                       | ✅              | ✅              |
| Inter font                       | ✅              | ✅              |
| Sticky nav with blur             | ✅              | ✅              |
| Logo left / nav center / CTA right | ✅           | ✅              |
| Mobile hamburger menu            | ✅              | ✅              |
| Hero with radial glow            | ✅              | ✅              |
| Hero staggered entrance          | ✅              | ✅              |
| Featured projects grid (2-col)   | ✅              | ✅              |
| Project card hover (scale + overlay) | ✅          | ✅              |
| Project detail with meta grid    | ✅              | ✅              |
| Image gallery                    | ✅              | ✅              |
| Next project navigation          | ✅              | ✅              |
| Blog grid (3-col)                | ✅              | ✅              |
| Blog post article layout         | ✅              | ✅              |
| About page with values/services  | ✅              | ✅              |
| "Let's work together" CTA        | ✅              | ✅              |
| Footer with sitemap/social + large logo | ✅       | ✅              |
| Scroll reveal animations         | ✅              | ✅              |
| Tag/badge components             | ✅              | ✅              |
| prefers-reduced-motion            | ⚠️ (Framer)    | ✅              |
| Page transitions                 | ✅ (Framer)     | ⚠️ (not added)  |

**Notes:**
- Page-level transitions (cross-fade between routes) are not implemented since Next.js App Router doesn't natively support them without added complexity. Could be added with `framer-motion` layout animations if needed.

---

## Images

All placeholder images are served remotely from **Unsplash** (`images.unsplash.com`), which provides free-to-use images under the [Unsplash License](https://unsplash.com/license).

**`next.config.ts`** is configured with `remotePatterns` for `images.unsplash.com`.

To replace images: edit the URLs in `src/data/projects.ts` and `src/data/posts.ts`. No other files need to change.

---

## CMS Migration Guide

The data layer is designed for easy CMS migration. **Only two files need to change:**

### `src/lib/data.ts`

Replace the static imports with CMS API calls:

```typescript
// Before (static)
import { projects } from "@/data/projects";
export function getAllProjects() { return projects; }

// After (e.g., Sanity)
import { client } from "@/sanity/client";
export async function getAllProjects() {
  return client.fetch('*[_type == "project"] | order(date desc)');
}
```

### `src/types/index.ts`

Extend types if your CMS adds fields (e.g., `_id`, `_createdAt`).

### Pages

Page components already consume the helper functions. If you make them `async`, they'll work with async CMS fetches out of the box (they already use `async` in dynamic routes).

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (header + footer)
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # 404 page
│   ├── globals.css         # Tailwind v4 + design tokens
│   ├── work/
│   │   ├── page.tsx        # Work index
│   │   └── [slug]/page.tsx # Project detail
│   ├── blog/
│   │   ├── page.tsx        # Blog index
│   │   └── [slug]/page.tsx # Blog post
│   └── about/
│       └── page.tsx        # About page
├── components/
│   ├── Container.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ScrollReveal.tsx
│   ├── SectionHeading.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectGrid.tsx
│   ├── PostCard.tsx
│   └── PostList.tsx
├── data/
│   ├── projects.ts         # Static project data (8 projects)
│   └── posts.ts            # Static post data (6 posts)
├── lib/
│   └── data.ts             # Data helpers (CMS abstraction layer)
└── types/
    └── index.ts            # Project & Post TypeScript types
```

## Tech Stack

- **Next.js 15** (App Router, SSG)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (with `@theme` design tokens)
- **Framer Motion** (scroll reveals, entrance animations, mobile menu)
