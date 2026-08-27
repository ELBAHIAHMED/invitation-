// ============ Wedding date config ============
// Edit this to change the countdown / calendar target.
const WEDDING_DATE = new Date('2026-09-26T16:00:00');

// ============ Preloader ============
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('is-hidden'), 500);
  }
});

// ============ Envelope gate ============
const envelopeGate = document.getElementById('envelope-gate');
const envelope = document.getElementById('envelope');
const envelopeSeal = document.getElementById('envelope-seal');

function openEnvelope() {
  if (!envelope || envelope.classList.contains('is-glowing')) return;
  // Stage 1: the seal glows and light beams from the seam.
  envelope.classList.add('is-glowing');
  // Stage 2: the flap lifts open and the whole card fades to reveal the site.
  setTimeout(() => {
    envelope.classList.add('is-open');
    document.body.classList.remove('no-scroll');
  }, 900);
  setTimeout(() => envelopeGate && envelopeGate.classList.add('is-open'), 900 + 250);
  setTimeout(() => {
    if (envelopeGate) envelopeGate.style.display = 'none';
  }, 900 + 1300);
}

if (envelopeSeal) envelopeSeal.addEventListener('click', openEnvelope);
if (envelope) {
  envelope.addEventListener('click', (e) => {
    if (e.target !== envelopeSeal) openEnvelope();
  });
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openEnvelope();
  });
}

// ============ Nav: scroll shadow, mobile menu, active link ============
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const navSectionLinks = navLinks ? [...navLinks.querySelectorAll('a[href^="#"]')] : [];
const navSections = navSectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && navSections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navSectionLinks.forEach((link) =>
            link.classList.toggle('is-active', link.getAttribute('href') === id)
          );
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  navSections.forEach((section) => navObserver.observe(section));
}

// ============ FAQ accordion ============
document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion__item');
    const wasOpen = item.classList.contains('is-open');
    item.parentElement.querySelectorAll('.accordion__item').forEach((el) =>
      el.classList.remove('is-open')
    );
    if (!wasOpen) item.classList.add('is-open');
  });
});

// ============ Gallery lightbox ============
const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightbox-frame');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery__item').forEach((item) => {
  item.addEventListener('click', () => {
    if (!lightbox) return;
    lightboxFrame.style.background = getComputedStyle(item).background;
    lightbox.hidden = false;
  });
});
if (lightboxClose) {
  lightboxClose.addEventListener('click', () => (lightbox.hidden = true));
}
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.hidden = true;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.hidden = true;
  });
}

// ============ Background music toggle ============
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {
    const isPlaying = musicToggle.getAttribute('aria-pressed') === 'true';
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
    } else {
      bgMusic.play().catch(() => {
        // No audio file provided yet — see README to add your own track.
      });
      musicToggle.setAttribute('aria-pressed', 'true');
    }
  });
}

// ============ Countdown ============
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };
  if (!els.days) return;

  if (diff <= 0) {
    els.days.textContent = '00';
    els.hours.textContent = '00';
    els.minutes.textContent = '00';
    els.seconds.textContent = '00';
    return;
  }

  const pad = (n) => String(n).padStart(2, '0');
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  els.days.textContent = pad(days);
  els.hours.textContent = pad(hours);
  els.minutes.textContent = pad(minutes);
  els.seconds.textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============ Scroll reveal ============
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ============ Falling petals ============
(function createPetals() {
  const container = document.querySelector('.petals');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * 10;
    const size = 6 + Math.random() * 8;
    petal.style.left = left + 'vw';
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = delay + 's';
    container.appendChild(petal);
  }
})();

// ============ Add to calendar (.ics download) ============
const calendarBtn = document.getElementById('add-to-calendar');
if (calendarBtn) {
  calendarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const start = WEDDING_DATE;
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
    const formatDate = (d) =>
      d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      'SUMMARY:Ahmed & Hajar\'s Wedding',
      'DESCRIPTION:Join us as we celebrate our wedding day!',
      'LOCATION:Venue Name, City, Country',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ahmed-hajar-wedding.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// ============ RSVP form ============
const rsvpForm = document.getElementById('rsvp-form');
const rsvpStatus = document.getElementById('rsvp-status');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // NOTE: This form currently only confirms locally. To actually receive
    // RSVPs, connect it to a backend or a service such as Formspree/Getform
    // by setting the form's `action` attribute and removing this handler's
    // preventDefault, or by sending the data via fetch() to your endpoint.
    const data = new FormData(rsvpForm);
    const name = data.get('name');
    const attending = data.get('attending');

    if (attending === 'yes') {
      rsvpStatus.textContent = `Thank you, ${name}! We can't wait to celebrate with you.`;
    } else {
      rsvpStatus.textContent = `Thank you for letting us know, ${name}. You'll be missed!`;
    }
    rsvpForm.reset();
  });
}
