// ============ Wedding date config ============
// Edit this to change the countdown / calendar target.
const WEDDING_DATE = new Date('2026-09-26T20:00:00');

// ============ Preloader ============
// Normally hidden once everything (fonts, images, the audio/video files) has
// finished loading via the 'load' event. But that event waits on EVERY
// subresource, so on a slow connection it can take a long time to fire --
// making the envelope look stuck behind the preloader until a guest happens
// to tap around. The 3s fallback guarantees it hides on its own regardless.
(function hidePreloaderWhenReady() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  let hidden = false;
  const hide = () => {
    if (hidden) return;
    hidden = true;
    preloader.classList.add('is-hidden');
  };
  window.addEventListener('load', () => setTimeout(hide, 400));
  setTimeout(hide, 3000);
})();

// ============ Envelope gate ============
const envelopeGate = document.getElementById('envelope-gate');
const envelope = document.getElementById('envelope');
const envelopeSeal = document.getElementById('envelope-seal');
const envelopeVideo = document.getElementById('envelope-video');

// If assets/video/envelope-open.mp4 exists and loads, switch to showing it
// (its own first frame, e.g. a closed envelope) right away, in place of the
// vector envelope. This waits for an actual paintable frame (readyState >= 2,
// the 'loadeddata' event) rather than just 'loadedmetadata' (readyState 1,
// which only guarantees duration/dimensions are known) -- switching on
// metadata alone left a blank video element on screen until playback
// started. If the video never becomes ready this silently stays on the
// vector envelope — no broken UI either way.
if (envelopeVideo) {
  const markVideoReady = () => {
    envelope.classList.add('has-video');
    if (envelopeGate) envelopeGate.classList.add('has-video-mode');
  };
  if (envelopeVideo.readyState >= 2) {
    // A frame is already decoded before this script ran (fast/cached load) —
    // the 'loadeddata' event already fired and would never be caught below.
    markVideoReady();
  } else {
    envelopeVideo.addEventListener('loadeddata', markVideoReady, { once: true });
  }
}

// ============ Background music ============
// Starts automatically once the envelope/letter has opened (see becomeVideoHero()
// and openEnvelope() below) so guests don't have to find and tap the toggle
// themselves; the toggle button still works normally to pause/resume it.
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
if (bgMusic) bgMusic.volume = 0.35; // kept low so it sits behind the page, not over it

function startBackgroundMusic() {
  if (!bgMusic || !musicToggle || musicToggle.getAttribute('aria-pressed') === 'true') return;
  bgMusic
    .play()
    .then(() => musicToggle.setAttribute('aria-pressed', 'true'))
    .catch(() => {
      // Autoplay blocked (rare, this soon after a tap) — the toggle button
      // stays available so the guest can just start it manually.
    });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {
    const isPlaying = musicToggle.getAttribute('aria-pressed') === 'true';
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
    } else {
      startBackgroundMusic();
    }
  });
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
  startBackgroundMusic();
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
      if (envelopeGate) envelopeGate.classList.remove('has-video-mode');
      openEnvelope();
    });
    return; // becomeVideoHero() runs on the video's 'ended' event, and starts the music
  }

  // Vector fallback sequence.
  // Stage 1: the seal glows and light beams from the seam.
  envelope.classList.add('is-glowing');
  // Stage 2: the flap lifts open and the whole card fades to reveal the site.
  setTimeout(() => {
    envelope.classList.add('is-open');
    document.body.classList.remove('no-scroll');
    startBackgroundMusic();
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
