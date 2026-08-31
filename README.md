# Dr. Doctor Name — Free Consultation, Education & Advisory Practice (Next.js)

A front-end prototype of the practice website, restructured to match the
client-supplied "Website Front End V2" information architecture, with
real curriculum content from the "Pediatrics & Neonatology Tele-Rotation
Curriculum" document integrated into the Tele-Rotations page.

## What this is

This is a **Next.js 16 (App Router)** app. All content is placeholder —
doctor bio, photos, exact numbers, meetings and testimonials — ready to
be replaced once the client shares real material (the doctor's profile
is expected next, to update the About page).

There is **no real backend yet**. Admin-editable content (site stats,
meeting/event cards, testimonials, consultation request records) is
stored in the browser's `localStorage` via a React Context
(`lib/DataContext.js`). Swap its functions for real API calls once a
backend/database is ready — the client has indicated this is a later phase.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Site structure (per client's V2 document)

- `/` — Home
- `/about` — profile, mission, credentials, leadership, teaching, research (accordion sections)
- `/education-training` — hub page linking to:
  - `/education-training/live-learning` — lectures, meetings, case discussions, OSCE prep
  - `/education-training/question-banks` — Shelf/USMLE/pediatrics/neonatology boards, 6 topics
  - `/education-training/tele-rotations` — full 6-week curriculum (schedule, outcomes, assessment, safety/privacy)
  - `/education-training/physical-rotations` — institution-approved in-person placements
- `/clinical-services` — free phone consultation request (scheduling, telehealth eligibility, privacy, emergency guidance)
- `/advisory-services` — hub page linking to:
  - `/advisory-services/nicu-development` — NICU development & expansion consulting
  - `/advisory-services/curriculum-development` — pediatrics/neonatology curriculum design consulting
- `/research` — neonatology/pediatrics research and publications
- `/community-impact` — outreach, volunteering, partnerships (donation CTA marked pending legal confirmation, per client's note)
- `/testimonials`
- `/contact` — single form routing by category (Education & Training, Clinical Services, Advisory Services, Research, Community Impact, General)
- `/student-login` — front-end preview only, no real auth
- `/admin` — stats editor + quick links
- `/admin/meetings` — add/edit/delete Live Learning session cards (title, description, date, image URL, free/paid + price)
- `/admin/testimonials` — add/delete testimonials
- `/admin/requests` — consultation request record book, with status + notes

## What changed in this restructure

- Nav simplified from 11 items to 9 top-level items, matching the client's diagram exactly (Student Login moved to a utility button, out of the main nav).
- Old routes (`/doctor-profile`, `/question-bank`, `/tele-rotation`, `/physical-rotation`, `/meetings`, `/donate`, `/consultation`) were removed and replaced by the new nested structure above — no redirects were added since the site isn't live/indexed yet.
- Tele-Rotations page now contains the actual curriculum: 6-week schedule table, learning outcomes, purpose statements, assessment weighting, completion standards, and safety/privacy disclosures — sourced from the client's curriculum document.
- Community Impact replaces the standalone Donate page. Per the client's note, the donation CTA is shown but explicitly marked as pending "the practice's legal donation process" — nothing is collected yet.
- Fixed a real CSS bug: headings inside dark-background cards (`.card.dark`, `.section.navy`, `.hero-card`) were rendering in dark text, nearly invisible against the navy background. Now explicitly set to white.

## Deploying to Vercel / Cloudflare Pages

Standard Next.js app, no special configuration needed. See prior conversation for a
cost comparison between Vercel, Cloudflare Pages, and self-hosting on a Chicago VPS.

## Known limitations (by design, at this stage)

- No real backend/database — everything admin-editable lives in `localStorage`.
- No real authentication for Student Login or Admin.
- No real payment processing anywhere (Community Impact's donation CTA is explicitly inactive).
- Doctor photo and meeting/event images use placeholder blocks until real images are supplied.
- Doctor's real bio/credentials are still placeholder text on `/about` — pending the client's profile document.

## Next steps

- Swap in the doctor's real profile content once shared (goes into `/about` and `lib/defaultData.js`'s `PROFILE_SECTIONS`).
- Build the real backend (database, auth, payments) per the earlier infrastructure cost documents.
- Confirm the practice's legal donation process, then activate the Community Impact donation flow.
