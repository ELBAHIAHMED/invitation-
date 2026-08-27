// ============ Wedding date config ============
// Edit this to change the countdown / calendar target.
const WEDDING_DATE = new Date('2026-09-26T16:00:00');

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
