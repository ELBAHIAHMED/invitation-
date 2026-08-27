# Ahmed & Hajar — Wedding Invitation

A single-page wedding invitation website, celebrating Ahmed & Hajar's wedding on **September 26, 2026**.

## Directory structure

```
invitation-/
├── index.html              # main page (hero, countdown, story, details, gallery, RSVP)
├── assets/
│   ├── css/
│   │   └── style.css       # all styling (fonts, layout, animations)
│   ├── js/
│   │   └── script.js       # countdown timer, scroll reveal, petals, RSVP, add-to-calendar
│   └── img/                # put your real wedding photos here
└── README.md
```

## Customize it

- **Names / date**: already set to Ahmed & Hajar, September 26, 2026. To change the date, edit
  `WEDDING_DATE` at the top of `assets/js/script.js`.
- **Venue details**: edit the placeholder text ("Venue Name", "City, Country") inside the
  `#details` section of `index.html`.
- **Photos**: drop images into `assets/img/` and reference them in the `.gallery__grid` items
  (replace the empty `<div class="gallery__item">` blocks with `<img src="assets/img/photo1.jpg" alt="...">`).
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
