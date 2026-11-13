// Animate bubbles on the intro page
(() => {
  const cv = document.getElementById('bubbles');
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  let W = 0, H = 0;
  const bubbles = [];
  const pops = [];
  const mouse = { x: -9999, y: -9999, nx: 0, ny: 0 };

  const make = (initial) => {
    const r = 8 + Math.pow(Math.random(), 2) * 62;
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + r + Math.random() * 120,
      r, z: 0.25 + r / 90, vx: 0, vy: 0,
      rise: 0.25 + Math.random() * 0.45, wob: Math.random() * TAU,
    };
  };

  const resize = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    cv.width = W * d;
    cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const count = Math.round(Math.min(70, Math.max(24, W / 24)));
    while (bubbles.length < count) bubbles.push(make(true));
    bubbles.length = count;
  };
  resize();
  addEventListener('resize', resize);

// Move bubbles with the pointer to create depth
  const place = (b) => ({ x: b.x - mouse.nx * 70 * b.z, y: b.y - mouse.ny * 70 * b.z });

  addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = e.clientX / W - 0.5;
    mouse.ny = e.clientY / H - 0.5;
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  addEventListener('pointerdown', (e) => {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const p = place(bubbles[i]);
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < bubbles[i].r) {
        pops.push({ x: p.x, y: p.y, r: bubbles[i].r, t: 0 });
        bubbles[i] = make(false);
        break;
      }
    }
  });

  const draw = (b, x, y) => {
    const g = ctx.createRadialGradient(x - b.r * 0.3, y - b.r * 0.3, b.r * 0.1, x, y, b.r);
    g.addColorStop(0, 'rgba(255, 90, 105, .04)');
    g.addColorStop(0.75, 'rgba(255, 45, 69, .10)');
    g.addColorStop(1, 'rgba(255, 45, 69, .38)');
    ctx.beginPath();
    ctx.arc(x, y, b.r, 0, TAU);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `rgba(255, 110, 122, ${0.25 + b.z * 0.4})`;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - b.r * 0.35, y - b.r * 0.35, b.r * 0.18, 0, TAU);
    ctx.fillStyle = 'rgba(255, 255, 255, .35)';
    ctx.fill();
  };

  const frame = () => {
    ctx.clearRect(0, 0, W, H);
    for (const b of bubbles) {
      if (!reduce) {
        b.wob += 0.01;
        b.y -= b.rise * (0.5 + b.z * 0.5);
        b.x += Math.sin(b.wob) * 0.25;
      }
      let { x, y } = place(b);
// Push bubbles away from the pointer
      const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy) || 1, R = 170 + b.r;
      if (d < R) {
        const f = (1 - d / R) * 1.6;
        b.vx += (dx / d) * f;
        b.vy += (dy / d) * f;
      }
      b.vx *= 0.93;
      b.vy *= 0.93;
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r - 80) Object.assign(b, make(false));
      ({ x, y } = place(b));
      draw(b, x, y);
    }
    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i];
      p.t += 0.05;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1 + p.t * 0.9), 0, TAU);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(255, 140, 150, ${1 - p.t})`;
      ctx.stroke();
      if (p.t >= 1) pops.splice(i, 1);
    }
    if (!reduce) requestAnimationFrame(frame);
  };
  frame();

// Fade into the portfolio
  const enter = document.getElementById('enter');
  let leaving = false;
  const go = (e) => {
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    document.body.classList.add('leaving');
    setTimeout(() => { location.href = 'portfolio.html'; }, 550);
  };
  enter.addEventListener('click', go);
  addEventListener('keydown', (e) => { if (e.key === 'Enter' && document.activeElement !== enter) go(e); });
})();
