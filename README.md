# colinyoung.scot

Personal website for Colin Young - Platform Engineer & Piano Teacher

## Features

- Minimalist homepage with dark theme
- Projects page showcasing web applications and services
- Case studies page with auto-discovery of markdown case studies
- Responsive design with burger menu navigation
- SEO optimized with sitemap and robots.txt
- Google Analytics support (optional)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Inter font

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Adding Case Studies

To add a new case study:

1. Create a markdown file in `/content/case-studies/` with the following frontmatter:
```yaml
---
title: "Case Study Title"
description: "Brief description"
date: "2024-01-01"
slug: "case-study-slug"
---
```

2. The case study will automatically appear on the case studies index page

## Environment Variables

Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics ID
```

## Deployment

The site is configured for deployment on Vercel. Simply connect your repository and deploy.

## Logo

Replace `/public/logo.svg` with your own logo file.
