# Ahmed & Hajar — Wedding Invitation

A luxury, botanical "sacred garden" style single-page wedding invitation site, celebrating
Ahmed & Hajar's wedding on **September 26, 2026**. Original design and code — not a copy of
any commercial template — built for personal, non-commercial use.

## Directory structure

```
invitation-/
├── index.html                  # full page: nav, hero, countdown, story, schedule,
│                                #   venue/map, travel, gallery, registry, FAQ, RSVP, footer
├── assets/
│   ├── css/
│   │   └── style.css           # "sacred garden" palette, botanical ornaments, all styling
│   ├── js/
│   │   └── script.js           # preloader, nav, countdown, reveal animations, accordion,
│   │                            #   lightbox, RSVP handler, add-to-calendar, music toggle
│   ├── img/
│   │   ├── favicon.svg         # A&H monogram favicon
│   │   ├── hero-scene.jpg      # optional real hero photo — see "AI-generated media" below
│   │   └── (put your real wedding photos here)
│   ├── video/
│   │   └── envelope-open.mp4   # optional real envelope-open video — see below
│   └── audio/
│       └── (optional background music track — see below)
└── README.md
```

## AI-generated media (envelope video & hero photo)

The envelope-open animation and hero background currently use hand-coded vector art (SVG/CSS) —
that's what renders by default. The site is also wired to automatically switch to real media the
moment you add it, no code changes needed:

- Drop a video at **`assets/video/envelope-open.mp4`** (portrait, ~5s, showing the envelope
  glowing and opening) and it replaces the vector envelope. Tapping it plays the video; the site
  reveals itself the moment the video ends.
- Drop a photo at **`assets/img/hero-scene.jpg`** (portrait) and it replaces the illustrated arch
  scene as the hero background — your existing text (names, date, "Scroll Down") still overlays on
  top of it.

If either file is missing, the site quietly falls back to the vector version — nothing breaks.
Ask Claude for ready-to-use prompts for an AI video/image tool (e.g. Kling AI, which has a
generous free tier) to generate media matching the site's burgundy-wax-seal, golden-hour-arch look.

## Features

- Botanical SVG line-art ornaments (branch/leaf/wreath motifs) — hand-coded, no external assets
- Elegant preloader with animated wreath + monogram
- Sticky nav with scroll shadow, active-section highlighting, and a mobile slide-out menu
- Hero with falling petal animation and countdown timer to the wedding date
- Our Story timeline, day-of Schedule/agenda, Venue details with an embedded Google Map
- Travel & accommodation info, photo Gallery with a lightbox, Gift Registry cards
- FAQ accordion, RSVP form, and a floating background-music toggle

## Customize it

- **Names / date**: already set to Ahmed & Hajar, September 26, 2026. To change the date, edit
  `WEDDING_DATE` at the top of `assets/js/script.js`.
- **Venue details**: edit the placeholder text ("Venue Name", "City, Country") in the `#details`
  section of `index.html`, and update the Google Maps embed URL in the `.map-frame iframe`.
- **Photos**: drop images into `assets/img/` and replace the empty `.gallery__item` buttons with
  `<img src="assets/img/photo1.jpg" alt="...">` (update the lightbox script in `script.js` if you
  want the lightbox to show the full-size image instead of just the color swatch).
- **Background music**: add your own licensed track as `assets/audio/song.mp3` — the toggle
  button (bottom-right) will play/pause it. No track is bundled, since music can't be copied
  from another site.
- **RSVP form**: currently confirms locally in the browser only. To actually collect responses,
  connect it to a backend (e.g. [Formspree](https://formspree.io), [Getform](https://getform.io),
  or your own server) by setting the `<form>`'s `action`/`method` attributes, or by sending the
  data with `fetch()` inside `assets/js/script.js`.

## Run locally

No build step required — it's plain HTML/CSS/JS. Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Works as a static site on GitHub Pages, Netlify, Vercel, or any static host — just upload the
whole folder.
