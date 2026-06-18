/* ── Bioluminescent particle field ── */
const canvas = document.getElementById('bio-canvas');
const ctx = canvas.getContext('2d');

let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function randBetween(a, b) { return a + Math.random() * (b - a); }

function createParticle() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: randBetween(0.8, 2.5),
    vx: randBetween(-0.08, 0.08),
    vy: randBetween(-0.12, -0.02),
    alpha: randBetween(0.05, 0.45),
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: randBetween(0.005, 0.025),
    hue: randBetween(168, 192),
  };
}

function initParticles(n) {
  particles = [];
  for (let i = 0; i < n; i++) particles.push(createParticle());
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function draw() {
  if (prefersReducedMotion) return;
  ctx.clearRect(0, 0, W, H);

  for (const p of particles) {
    p.pulse += p.pulseSpeed;
    const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
    ctx.shadowBlur = p.r * 6;
    ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, ${alpha * 0.5})`;
    ctx.fill();
    ctx.shadowBlur = 0;

    p.x += p.vx;
    p.y += p.vy;

    if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
  }

  requestAnimationFrame(draw);
}

resize();
initParticles(130);
window.addEventListener('resize', () => { resize(); initParticles(130); });
draw();

/* ── Depth counter in hero ── */
const depthEl = document.getElementById('depth-counter');
let depthVal = 0;
const targetDepth = 3842;
const duration = 2000;
const startTime = performance.now();

function animateDepth(currentTime) {
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);
  depthVal = Math.floor(progress * targetDepth);
  depthEl.textContent = depthVal.toLocaleString() + ' m';
  
  if (progress < 1) {
    requestAnimationFrame(animateDepth);
  }
}

requestAnimationFrame(animateDepth);