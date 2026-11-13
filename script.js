document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
// Typing animation
  if (window.Typed) {
    new Typed('.typed', {
      strings: ['Video Editor', 'Freelancer', 'Software Engineering Aspirant'],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1200,
      loop: true,
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

// Mobile navigation menu
  const menuBtn = document.querySelector('.menu-btn');
  const navbar = document.querySelector('.navbar');
  const setMenu = (open) => {
    navbar.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.firstElementChild.className = open ? 'bx bx-x' : 'bx bx-menu';
  };
  menuBtn.addEventListener('click', () => setMenu(!navbar.classList.contains('open')));
  navbar.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });

// Reveal page sections and animate skill bars
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');
      el.querySelectorAll('.track span').forEach((bar) => { bar.style.width = bar.dataset.percent + '%'; });
      el.querySelectorAll('.radial').forEach((r) => {
        r.querySelector('.fg').style.strokeDashoffset = 502 * (1 - r.dataset.percent / 100);
      });
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.15 });
  reveals.forEach((el, i) => {
    el.style.setProperty('--d', (el.closest('.hero') ? 0.1 + i * 0.12 : (i % 3) * 0.1) + 's');
    revealObserver.observe(el);
  });

// Highlight the visible navigation link
  const links = [...navbar.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

// Split scrolling text for the wave animation
  document.querySelectorAll('.marquee-group').forEach((group) => {
    let n = 0;
    group.querySelectorAll('span').forEach((word) => {
      const text = word.textContent;
      word.textContent = '';
      [...text].forEach((ch) => {
        const b = document.createElement('b');
        b.className = 'ch';
        b.textContent = ch === ' ' ? '\u00A0' : ch;
        b.style.setProperty('--i', n++);
        word.appendChild(b);
      });
      n += 2;
    });
  });

// Animate rows of cards in the background
  const bg = document.createElement('div');
  bg.className = 'bg';
  bg.setAttribute('aria-hidden', 'true');
  const inner = document.createElement('div');
  inner.className = 'bg-inner';
  for (let r = 0; r < 7; r++) {
    const row = document.createElement('div');
    row.className = 'bg-row';
    row.innerHTML = '<i class="bg-card"></i>'.repeat(24);
    inner.appendChild(row);
  }
  bg.appendChild(inner);
  document.body.prepend(bg);

// Add pointer effects to the background and cards
  const fine = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine) {
    addEventListener('pointermove', (e) => {
      inner.style.setProperty('--px', (-(e.clientX / innerWidth - 0.5) * 36) + 'px');
      inner.style.setProperty('--py', (-(e.clientY / innerHeight - 0.5) * 36) + 'px');
    }, { passive: true });
    document.querySelectorAll('.card, .panel, .stats li, .work-box').forEach((box) => {
      box.classList.add('tilt-box');
      box.addEventListener('pointermove', (e) => {
        const r = box.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        box.classList.add('tilt-on');
        box.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) scale(1.02)`;
        box.style.setProperty('--mx', x * 100 + '%');
        box.style.setProperty('--my', y * 100 + '%');
      });
      box.addEventListener('pointerleave', () => { box.style.transform = ''; });
    });
  }

// Back to top button
  const topBtn = document.querySelector('.top');
  addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 600), { passive: true });

// Open the email app with the contact message
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const subject = d.get('subject') || 'Message from your portfolio';
    const body = `${d.get('message')}\n\nFrom: ${d.get('name')} (${d.get('email')})`;
    location.href = `mailto:mujahith22mass@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
