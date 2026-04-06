# Schedule — לוח זמנים לבית כנסת

A multi-tenant synagogue prayer timetable app built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

**[Live Demo](https://schedule-gamma-nine.vercel.app/)** · [GitHub](https://github.com/ChaimBaror/Schedule)

---

## Features

- **Dynamic zmanim** — sunrise, sunset, candle lighting, shabbat end and more via `@hebcal/core`
- **Hebrew calendar** — monthly view with daf yomi, parasha, holidays per day
- **8 display templates** — Classic, Modern, LED, Sephardic, Parchment, Night, Golden
- **Template switcher** — switch templates live from the header, saved to localStorage
- **Multi-tenant** — each kehila has its own slug, template, logo, location and announcements
- **Admin panel** — manage announcements (simcha / avel / notice), set logo URL, pick template, embed code
- **Public kiosk** — `/kehila/[slug]` fullscreen display for screens in the synagogue
- **Responsive** — horizontal scroll on mobile, 3-column grid on desktop

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Main dashboard (template switcher in header) |
| `/calendar` | Hebrew monthly calendar |
| `/kehila/[slug]` | Public kiosk page for a kehila |
| `/admin/[slug]` | Admin panel for a kehila |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS**
- **@hebcal/core** + **@hebcal/learning** — Hebrew calendar & zmanim
- **next-auth** — authentication
- **firebase-admin** — backend data (production)

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    admin/[slug]/       # Admin panel
    kehila/[slug]/      # Public kiosk
    calendar/           # Hebrew monthly calendar
  components/
    Header/             # Navbar with template picker
    HebrewCalendar/     # Monthly Hebrew calendar
    Layouts/            # DefaultLayout with TemplateProvider
  context/
    TemplateContext.tsx  # Global template selection (localStorage)
  services/
    hebcal.service.ts   # Zmanim & Hebrew date calculations
    kehila.service.ts   # Multi-tenant kehila data
  templates/            # ClassicTemplate, ModernTemplate, LedTemplate…
  types/                # TypeScript interfaces
```
