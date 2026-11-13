// Shared cursor animation used on both pages
(() => {
  const fine = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine) return;

  const style = document.createElement('style');
  style.textContent =
    '.snake-canvas{position:fixed;inset:0;z-index:9999;pointer-events:none;transition:opacity .25s}' +
    'html.snake,html.snake *{cursor:none!important}' +
    'html.snake input,html.snake textarea{cursor:text!important}';
  document.head.appendChild(style);

  const cv = document.createElement('canvas');
  cv.className = 'snake-canvas';
  cv.setAttribute('aria-hidden', 'true');
  cv.style.opacity = 0;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const N = 26;
  const pts = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
  let mx = -100, my = -100, speed = 0, grow = 1, growTarget = 1, started = false;

  const resize = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * d;
    cv.height = innerHeight * d;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  addEventListener('pointermove', (e) => {
    if (!started) {
      started = true;
      pts.forEach((p) => { p.x = e.clientX; p.y = e.clientY; });
      document.documentElement.classList.add('snake');
    }
    mx = e.clientX;
    my = e.clientY;
    growTarget = e.target.closest && e.target.closest('a, button, label') ? 1.7 : 1;
    cv.style.opacity = 1;
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { cv.style.opacity = 0; });

  const frame = (t) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const dx = mx - pts[0].x, dy = my - pts[0].y;
    pts[0].x += dx * 0.4;
    pts[0].y += dy * 0.4;
speed += (Math.min(Math.hypot(dx, dy), 60) / 60 - speed) * 0.12; // Zero means still and one means fast
    for (let i = 1; i < N; i++) {
      pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42;
      pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42;
    }
    grow += (growTarget - grow) * 0.2;
    for (let i = N - 1; i >= 0; i--) {
      const p = pts[i], q = pts[Math.max(i - 1, 0)], n = pts[Math.min(i + 1, N - 1)];
      const a = Math.atan2(q.y - n.y, q.x - n.x) + Math.PI / 2;
  const wave = i ? Math.sin(t / 110 - i * 0.55) * 9 * speed * (i / N + 0.3) : 0; // Move the trail sideways
      const k = i / N;
      ctx.beginPath();
      ctx.arc(p.x + Math.cos(a) * wave, p.y + Math.sin(a) * wave, (1.8 + (1 - k) * 5.2) * (i === 0 ? grow : 1), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - k * 0.7})`;
      ctx.shadowColor = '#ff2d45';
      ctx.shadowBlur = 18;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
