# Dr. Doctor Name — Free Consultation & Mentorship Site (Next.js)

A front-end prototype rebuild of the practice website, focused on free
phone consultations, neonatology/pediatrics mentorship, and an
NGO-style donation/record-keeping model.

## What this is

This is a **Next.js 16 (App Router)** app. All content is placeholder —
doctor bio, photos, exact numbers, meetings and testimonials — ready to
be replaced once the client shares real material.

There is **no real backend yet**. Admin-editable content (site stats,
meeting/event cards, testimonials, consultation request records) is
stored in the browser's `localStorage` via a React Context
(`lib/DataContext.js`), so the admin panel is fully interactive for a
demo but **does not persist across different browsers/devices** and
resets if the user clears site data. This is intentional for this
stage — swap `lib/DataContext.js`'s functions for real API calls once
a backend/database is ready.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Pages

- `/` — Home
- `/doctor-profile` — tagline, stats, click-to-expand accordion (Employment, Education, Research, Publications, Helping Students)
- `/research` — neonatology/pediatrics research only
- `/question-bank` — 6 topics, each with sub-topics
- `/tele-rotation` and `/physical-rotation` — separate dedicated pages
- `/meetings` — public event/meeting cards (admin-managed)
- `/donate` — NGO-style donation page (front-end only, no real payment processing yet)
- `/consultation` — free consultation request form (record-keeping, not booking)
- `/testimonials`
- `/contact`
- `/student-login` — front-end preview only, no real auth
- `/admin` — stats editor + quick links
- `/admin/meetings` — add/edit/delete meeting cards (title, description, date, image URL, free/paid + price)
- `/admin/testimonials` — add/delete testimonials
- `/admin/requests` — consultation request record book, with status + notes

## Deploying to Vercel

This app needs zero configuration for Vercel:

1. Push this folder to a GitHub repo (or drag-and-drop via the Vercel dashboard's "Import" flow if you don't want to use git).
2. In Vercel, "Add New Project" → import the repo → it will auto-detect Next.js → Deploy.
3. No environment variables are required for this front-end-only version.

## Known limitations (by design, at this stage)

- No real backend/database — everything admin-editable lives in `localStorage`.
- No real authentication for Student Login or Admin — both are open, unauthenticated front-end previews.
- No real payment processing on the Donate page.
- Doctor photo and meeting/event images use placeholder blocks until real images are supplied (or a URL is pasted into the admin form's "Image URL" field).
- Google Fonts (Fraunces, Public Sans, IBM Plex Mono) load from Google's CDN — this requires the deployed site to have normal internet access, which Vercel provides by default.

## Next steps toward a real backend

- Replace `lib/DataContext.js`'s in-memory/localStorage logic with real API routes (Next.js API routes or a separate backend) backed by a database (e.g., Postgres via Supabase/Neon).
- Add real authentication for `/admin` and `/student-login` (e.g., NextAuth or Clerk).
- Wire the Donate page to a real payment processor (e.g., Stripe or PayPal Giving Fund).
- Replace placeholder doctor bio/stats/photos with real content once supplied.
