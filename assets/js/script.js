// ============ Wedding date config ============
// Edit this to change the countdown / calendar target.
const WEDDING_DATE = new Date('2026-09-26T19:00:00');

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
const envelopeVideo = document.getElementById('envelope-video');

// If assets/video/envelope-open.mp4 exists and loads, switch to video mode.
// Otherwise this silently stays on the vector envelope — no broken UI either way.
if (envelopeVideo) {
  const markVideoReady = () => {
    envelope.classList.add('has-video');
    if (envelopeGate) envelopeGate.classList.add('has-video-mode');
  };
  if (envelopeVideo.readyState >= 1) {
    // Metadata already loaded before this script ran (fast/cached load) — the
    // 'loadedmetadata' event already fired and would never be caught below.
    markVideoReady();
  } else {
    envelopeVideo.addEventListener('loadedmetadata', markVideoReady, { once: true });
  }
}

// Scatter twinkling sparkle particles around the seal, concentrated near the center.
(function createEnvelopeSparkles() {
  const container = document.getElementById('envelope-sparkles');
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'envelope__sparkle';
    // Bias positions toward the seal at the center, with some drifting further out.
    const angle = Math.random() * Math.PI * 2;
    const radius = 8 + Math.random() * Math.random() * 42; // percent from center, weighted inward
    const left = 50 + Math.cos(angle) * radius;
    const top = 46 + Math.sin(angle) * radius;
    sparkle.style.left = left + '%';
    sparkle.style.top = top + '%';
    sparkle.style.animationDelay = (Math.random() * 1.6).toFixed(2) + 's';
    sparkle.style.animationDuration = (1.1 + Math.random() * 0.9).toFixed(2) + 's';
    container.appendChild(sparkle);
  }
})();

function revealSite() {
  envelope.classList.add('is-open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => envelopeGate && envelopeGate.classList.add('is-open'), 250);
  setTimeout(() => {
    if (envelopeGate) envelopeGate.style.display = 'none';
  }, 1300);
}

// When the real video finishes, it stays on screen (frozen on its last frame) and
// becomes the actual hero section, instead of disappearing to reveal a separate one.
function becomeVideoHero() {
  if (!envelopeGate || envelopeGate.classList.contains('is-video-hero')) return;
  envelope.classList.add('is-open');
  document.body.classList.remove('no-scroll');

  const heroHeader = document.getElementById('top');
  const heroText = document.querySelector('.hero__text');
  const heroScroll = document.querySelector('.hero__scroll');
  if (heroText) envelope.appendChild(heroText);
  if (heroScroll) envelope.appendChild(heroScroll);
  if (heroHeader) {
    heroHeader.style.display = 'none';
    heroHeader.removeAttribute('id');
    envelopeGate.id = 'top'; // keep the nav logo's #top anchor working
  }

  envelopeGate.classList.add('is-video-hero');
}

if (envelopeVideo) {
  envelopeVideo.addEventListener('ended', becomeVideoHero);
}

function openEnvelope() {
  if (!envelope || envelope.classList.contains('is-glowing') || envelope.classList.contains('is-open')) return;

  if (envelope.classList.contains('has-video')) {
    envelope.classList.add('is-glowing'); // guards against double-triggering while playing
    envelopeVideo.play().catch(() => {
      // Autoplay/play blocked — fall back to the vector sequence instead of a dead tap.
      envelope.classList.remove('has-video', 'is-glowing');
      openEnvelope();
    });
    return; // revealSite() runs on the video's 'ended' event
  }

  // Vector fallback sequence.
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

// ============ Hero photo ============
// If assets/img/hero-scene.jpg exists and loads, switch from the illustration to the real photo.
const heroArchWrap = document.getElementById('hero-arch-wrap');
const heroPhoto = document.getElementById('hero-photo');
if (heroPhoto && heroArchWrap) {
  heroPhoto.addEventListener('load', () => heroArchWrap.classList.add('hero-arch-wrap--has-photo'));
}

// ============ Nav: scroll shadow, active link ============
const nav = document.getElementById('nav');
const navLinks = document.getElementById('nav-links');

if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
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
      'SUMMARY:Hajar & Ahmed\'s Wedding',
      'DESCRIPTION:Join us as we celebrate our wedding day!',
      'LOCATION:Qasr Al-Sa\'ada (قصر السعادة)',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hajar-ahmed-wedding.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
