/* ── 1. THÈME CLAIR / SOMBRE ── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/* ── 2. NAVBAR SCROLLÉE ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── 3. LIEN ACTIF SELON SECTION VISIBLE ── */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach(s => observer.observe(s));

/* ── 4. SCROLL DOUX VERS SECTION ── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── 5. BOUTON SCROLL-TO-TOP ── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

/* ── 6. MENU HAMBURGER MOBILE ── */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.querySelector('i').className =
    navLinksEl.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.querySelector('i').className = 'fas fa-bars';
  });
});

/* ── 7. ANIMATION TEXTE TYPÉ ── */
const phrases = [
  'Développeur Web passionné 💻',
  'Étudiant en Informatique Appliquée 🎓',
  'Amoureux du code propre ✨',
  'Prêt pour de nouveaux défis 🚀',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const phrase = phrases[phraseIndex];
  if (!isDeleting) {
    typedEl.textContent = phrase.slice(0, ++charIndex);
    if (charIndex === phrase.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 90);
}
typeEffect();

/* ── 8. REVEAL AU SCROLL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el, i) => {
  el.dataset.delay = (i % 4) * 120;
  revealObserver.observe(el);
});

/* ── 9. ANIMATION BARRES DE COMPÉTENCES ── */
const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.fill').forEach(fill => {
          fill.classList.add('animated');
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.card-skills').forEach(card => skillObserver.observe(card));

/* ── 10. FILTRE PROJETS ── */
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.project-card').forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── 11. CAROUSEL ── */
const carouselState = {};

function initCarousel(id) {
  if (carouselState[id]) return;
  const carousel = document.getElementById(id);
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  const dotsContainer = carousel.querySelector('.car-dots');
  dotsContainer.innerHTML = '';
  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('car-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  function goTo(index) {
    const currentVideo = slides[current].querySelector('video');
    if (currentVideo) currentVideo.pause();
    current = (index + slides.length) % slides.length;
    const track = carousel.querySelector('.carousel-track');
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    carousel.querySelectorAll('.car-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
  }
  carouselState[id] = { goTo, getCurrent: () => current };
}

function moveCarousel(id, dir) {
  const state = carouselState[id];
  if (state) state.goTo(state.getCurrent() + dir);
}

/* ── 12. MODALS ── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (id === 'modalIOT') initCarousel('carouselIOTModal');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.querySelectorAll('video').forEach(v => v.pause());
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Reset carousel dynamique à la fermeture
  if (id === 'modalDynamic') {
    delete carouselState['carouselDynamic'];
  }
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      closeModal(modal.id);
    });
  }
});

/* ── 13. INIT CAROUSELS AU CHARGEMENT ── */
document.addEventListener('DOMContentLoaded', () => {
  initCarousel('carouselIOT');
});

/* ── 14. BARRE DE PROGRESSION ── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; z-index: 9999;
  height: 3px; width: 0;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTotal = document.body.scrollHeight - window.innerHeight;
  const progress    = (window.scrollY / scrollTotal) * 100;
  progressBar.style.width = `${progress}%`;
});