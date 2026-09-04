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
- `/admin/content` — edit hero/intro text across every page (Home banner slides, Home service cards, and every other page's eyebrow/heading/intro paragraph)
- `/admin/meetings` — add/edit/delete Live Learning session cards (title, description, date, image URL, free/paid + price)
- `/admin/testimonials` — add/delete testimonials
- `/admin/requests` — consultation request record book, with status + notes

## Content editing architecture (complete CMS)

Every page's text is admin-editable from **`/admin/content`** — not just
hero sections. This includes:

- Every page's eyebrow/heading/intro paragraph
- Home's 3 banner slides and 6 service cards
- About's full accordion (Employment, Education, Leadership & Teaching,
  Research, Publications, Helping Students) — add/edit/delete individual
  entries within each section
- Education & Training and Advisory Services hub cards
- The complete Tele-Rotation curriculum: purpose bullets, learning
  outcomes, the 6-week schedule table, assessment weighting, completion
  standards, and safety/privacy disclosures — every row independently
  editable
- Question Bank topics and their sub-topics
- Physical Rotations track cards and "what to expect" steps
- Clinical Services feature cards and privacy text
- NICU Development and Curriculum Development service cards
- Community Impact initiative cards and the (inactive) support/donation text
- Research's ongoing studies and publications table

The admin screen is organized as one page-per-accordion-section so it stays
navigable despite covering the whole site. It's built from three reusable
generic editor components in `components/AdminEditors.js`:

- `ObjectArrayEditor` — any array of flat objects (cards, schedule rows, etc.)
- `StringArrayEditor` — any array of plain strings (bullet lists)
- `NestedGroupEditor` — two-level nesting (About's sections → items)

All original page/data architecture notes below still apply.

Every page's hero/intro text (and Home's banner slides + service cards) now
lives in `lib/defaultData.js` as `DEFAULT_CONTENT`, managed through
`DataContext`'s `content` state and edited via one generic admin screen
(`/admin/content`) — not a bespoke form per page. To add a new editable
field anywhere on the site:

1. Add the field to the relevant page's object in `DEFAULT_CONTENT`.
2. Read it in the page component via `const { content } = useSiteData(); const c = content.pageKey;` and render `{c.fieldName}`.
3. Add one line to the `SIMPLE_PAGES` schema (or a bespoke panel, for arrays like `bannerSlides`/`cards`) in `app/admin/content/page.js`.

Structured/repeatable content (About's accordion entries, the Tele-Rotation
curriculum, Question Bank topics) intentionally stays in code for now —
it's less likely to need frequent editing than page copy, and moving it to
the admin UI is a natural next step once real content from the client
shows which fields actually change often.

Meeting/event cards (`/admin/meetings`) now also support an optional
**join link** field (Zoom/Google Meet URL) — stored but not rendered
publicly, since exposing a live meeting link to anyone visiting the
public site would let uninvited people join.

## About Page — Full CV CMS with Google Drive links

The About page now has **18 accordion sections** covering the doctor's complete
academic CV: Employment, Education, Post-Graduate Training, Certifications &
Licensure, Memberships & Committees, Judge of Work of Others (peer review),
Publications, Work Cited by Others, Oral Presentations, Poster Presentations,
Education Curriculum, Teaching, Research & Funded Projects, Overall
Contribution to Science, Research Skills, Critical Roles in Established
Organizations, Community & Mentorship, and Languages.

Each section shows a tightened, curated set of highlight entries (not the
full exhaustive CV — some of his lists run 20-75 items long, which would
make the page unusable). **Each section can also carry an admin-set Google
Drive link** — when set, a "View Full Document ↗" button appears at the
bottom of that section on the public page, so the full un-tightened detail
(e.g., the complete 75-review peer-review list, or all 24 publications with
abstracts) can live in a Google Doc/PDF the admin manages separately,
without needing code changes. Set these under `/admin/content` → About →
each section's "Google Drive link" field.

**Awards & Honors** gets a distinct layout instead of an accordion: a
sticky photo on the left (stays in view while scrolling) alongside a
vertical timeline of awards on the right, placed after all the accordion
sections. Admin-editable under `/admin/content` → About → "Awards & Honors
Timeline."

The page ends with a **"By the Numbers" counts strip** (publications, oral
presentations, poster presentations, manuscript reviews, journals reviewed
for, cited-by count) — also admin-editable as plain numbers.

**Architecture for the Drive-link CMS:** `about.sections` items now each
carry a `driveLink` field (empty string by default). `DataContext.js` has
a dedicated `updateNestedGroupMeta()` function for editing a section's own
metadata (label, driveLink) separately from its list of entries — see
`components/AdminEditors.js`'s `NestedGroupEditor`/`GroupBlock` for the
admin UI, and `app/about/page.js` for how the public page conditionally
renders the button.

## Tele-Rotation Learning Hub + Sign Up pages

The Tele-Rotations page is now a real "Learning Hub" — each of the 6
curriculum weeks is its own module card showing the clinical focus,
required products, a session date, and either a live "Join Live Session"
button (if a link is set) or a placeholder ("Session link auto-generates
closer to the date") if not. Session date and join link are both
admin-editable per week under `/admin/content` → Tele-Rotations.

**Important limitation to flag to the client:** the join links are
currently just a text field an admin fills in manually — they do not
yet call the Zoom API to generate real meeting links automatically.
Real automation requires backend work: a Zoom Server-to-Server OAuth
app (needs Zoom Pro) and backend code that calls Zoom's API to create
a meeting and store the returned link. The front-end structure here is
built to support that once the backend exists — the `joinLink` field
just needs to be populated by that API call instead of by hand.

Two new pages support the enrollment flow:
- `/education-training/tele-rotations/apply` — program enrollment form (logs to the same consultation-records system as a distinct request type)
- `/student-signup` — general account creation (front-end preview, no real auth yet), linked from `/student-login`

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
