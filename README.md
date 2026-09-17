ده ملف `README.md` احترافي وشامل، معمول بدقة متناهية بناءً على المعمارية الحقيقية للـ Frontend، والـ dependencies الحديثة جدًا (Next.js 16 + React 19 + Tailwind v4 + pnpm 11)، مع شرح تفصيلي لهيكل الصفحات والـ Routing:

```markdown
# 🖋️ Inkwell — Modern Editorial & Blog Client

A blazing-fast, content-driven modern publishing frontend for the **Inkwell** blog platform. Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**, seamlessly consuming editorial content via REST APIs powered by **Strapi v5**.

---

## ✨ Key Features & User Experience

* **Content Aggregation (Home):** Clean editorial layout highlighting featured articles, recent releases, and quick category filtering.
* **Granular Taxonomy (Categories):** Dedicated category browsing (`Technology`, `History`, `Psychology`, `Science`) with nested article discovery routes.
* **Dynamic Article Reading (`/articles` & `/articles/[slug]`):**
  * Card-level previews with responsive Cloudinary thumbnails, excerpts, publication dates, and author tags.
  * Comprehensive detail views rendering rich body content, publication metadata, and linked author profiles.
* **Author Profiles (`/users` & `/users/[id]`):** Dedicated community/author index showcasing bios and clickable profile pages linking authors to their published work.
* **Contextual Navigation:** Seamless nested routes for browsing content either globally or scoped strictly by topic/author.
* **Modern Minimalist UI:** Ultra-clean aesthetic styled entirely with **Tailwind CSS v4** engine.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Language:** TypeScript 5
* **Package Manager:** `pnpm` (v11+)
* **Data Source:** Headless REST API ([Inkwell Strapi Backend](https://github.com/N3ssar/inkwell-backend))

---

## 🧭 Application Routing Architecture

```text
app/
├── page.tsx                     # Landing page with highlights & editorial feed
├── categories/
│   ├── page.tsx                 # Taxonomy overview index
│   └── [category]/
│       ├── page.tsx             # Filtered articles by category
│       └── [slug]/page.tsx      # Article reader scoped within category route
├── articles/
│   ├── page.tsx                 # Global article archive with preview cards
│   └── [slug]/page.tsx          # Full-length article reader & author details
├── users/
│   ├── page.tsx                 # Writers & contributors directory
│   └── [id]/page.tsx            # Dedicated author portfolio & bio
└── layout.tsx                   # Global navigation bar, branding, & footer

```

---

## ⚙️ Environment Variables (.env.example)

Create a `.env.local` file in the root directory:

```env
# Strapi API Base URL (Local or Cloud Deployment)
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

```

---

## 🚀 Getting Started Locally

1. **Clone the repository:**
```bash
git clone [https://github.com/N3ssar/inkwell-frontend.git](https://github.com/N3ssar/inkwell-frontend.git)
cd inkwell-frontend

```


2. **Install dependencies:**
```bash
pnpm install

```


3. **Run development server:**
```bash
pnpm dev

```


4. **Access the application:**
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Build & Production

```bash
# Generate optimized production build
pnpm build

# Run production server
pnpm start

```

---

## 🔗 Related Repositories

* **Backend Engine:** [Inkwell Backend (Strapi v5 + Neon PostgreSQL + Cloudinary)](https://www.google.com/url?sa=E&source=gmail&q=https://github.com/N3ssar/inkwell-backend)
