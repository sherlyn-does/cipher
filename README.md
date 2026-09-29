# CIPHER — Student Association Website

Official website for **CIPHER**, the student association of the Department of Computer Science & Engineering ,SJEC Mangalore.

CIPHER serves as a platform for students to nurture their technical and interpersonal skills through innovative and collaborative activities, bridging the gap between academic knowledge and practical application.

## Tech Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Features

- **Boot + decrypt intro animation** — a terminal-style boot sequence ("authenticating access... access granted") tied to real asset-loading progress, followed by a giant "CIPHER" wordmark that resolves from scrambled characters to plaintext, revealed by a mouse-tracking magnifying glass effect. Skippable at any point.
- **Matrix-inspired theme** — black background with phosphor-green accent color, custom `matrix.ttf` display font for headings, optional low-opacity digital-rain background motif.
- **Scroll-triggered animations** — sections fade/rise into view as the user scrolls; section headings use a text-scramble/decode effect on entry.
- **Custom cursor & micro-interactions** — hover states on buttons, cards, and nav links inspired by activetheory.net's interaction language.
- **Hidden easter egg** — a small hidden interaction for curious visitors (verify/trigger and confirm payoff before launch).

## Sections

| Section | Description |
|---|---|
| Hero | Intro animation + headline, CTA buttons |
| About | Who CIPHER is and its mission |
| Our Domains | Technical Skill Building, Leadership & Governance, Events & Collaboration, Industry Readiness |
| Leadership Structure | How annual elections work (President, Secretary, office bearers — guided by HOD & Faculty Coordinator) |
| Voices of CIPHER | Testimonials from HOD, Faculty Coordinator, Student President |
| Events & Workshops | Hackathons, workshops, tech talks |
| Join CIPHER | Recruitment CTA and contact |

## Getting Started

```bash
git clone <this-repo-url>
cd <repo-folder>
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Assets

- `matrix.ttf` — custom display font used for the hero wordmark and section headings. Loaded via a custom `@font-face` declaration.

## ⚠️ Placeholders to replace before launch

- [ ] College name, logo, and full address
- [ ] Real office bearer names, photos, and roles (President, Secretary, Treasurer, Tech Lead)
- [ ] Real testimonial quotes from HOD, Faculty Coordinator, and Student President
- [ ] Real event history, upcoming event dates, and photos
- [ ] Contact email (currently `cipher@cse.edu`) and social links (Instagram, LinkedIn, GitHub)
- [ ] Stats row numbers — confirm if real figures or remove

## Deployment

Connected to Vercel for automatic deployments. Pushes to a feature branch open a pull request — review and merge into `main` to trigger a production deploy.

## Credits

Design direction inspired by [nucleussjec.in](https://nucleussjec.in/) (page structure) and [activetheory.net](https://activetheory.net/) (animation/interaction language), adapted for CIPHER's cipher/decryption theme.
