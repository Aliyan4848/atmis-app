# ATMIS — Apply for Assistive Devices (Prototype)

A high-fidelity, production-structured prototype of the ATMIS "Apply for Assistive
Devices" module, built with Next.js 15, TypeScript, Tailwind CSS v4, and a hand-built
shadcn/ui-style component library on Radix primitives.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (make sure `package.json` sits at the repo root,
   not nested in a subfolder — see note below).
2. Go to vercel.com → Add New → Project → import the repo.
3. Framework preset: Next.js (auto-detected). No environment variables needed —
   everything runs on mock data, no backend required.
4. Deploy.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, devices, benefits, eligibility, documents, FAQ, contact |
| `/apply` | 6-step application wizard with save-and-resume (localStorage) |
| `/apply/success` | Confirmation page with QR code and downloadable receipt |
| `/track` | Search by Request ID / CNIC / phone, visual status timeline |
| `/dashboard` | Applicant dashboard — status, notifications, documents, profile |
| `/admin` | Read-only review queue preview |

## What's real vs. mocked

- **Real:** form validation (Zod + react-hook-form), duplicate-application detection,
  cascading province/district/tehsil selects, drag-and-drop upload UI with simulated
  progress, localStorage draft persistence, QR code generation, responsive layout,
  accessible focus states and keyboard navigation.
- **Mocked:** there is no backend. "Submitted" applications are stored in
  `sessionStorage` for the current browser tab only (so Track works immediately after
  applying), plus two seeded demo records (`ATMIS-2026-48213`, `ATMIS-2026-48099`) so
  Track works out of the box. Document uploads are not actually stored anywhere.
  SMS/email notifications are not actually sent.

## Design tokens

Brand colors and type scale are defined in `src/app/globals.css` under `@theme inline`,
matching the palette provided in the project brief (Primary Green `#2F8D46`, Primary
Blue `#1D4E89`, etc.). Change them there to re-theme the whole app.

## Known limitation

Vercel's build servers can reach Google Fonts; this sandbox's couldn't, so the project
uses self-hosted `@fontsource/inter` instead of `next/font/google`. Both produce
the same rendered result — this was a build-environment workaround, not a design
change.

## Not yet built

- Full notification center as its own page (currently a dashboard panel only)
- Real OCR on uploaded documents (upload UI is real, extraction is not)
- Authentication / real admin access control on `/admin`
