/* ═══════════════════════════════════════
   Serenity – Mental Wellness Helper
   script.js  — Twilight Garden Edition
═══════════════════════════════════════ */

/* ── FLOATING PARTICLES ── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLOURS = [
    'rgba(212,169,106,', // gold
    'rgba(122,158,126,', // sage
    'rgba(201,137,122,', // rose
    'rgba(168,197,170,', // mint
  ];

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.8 + .4;
    this.vx   = (Math.random() - .5) * .25;
    this.vy   = -Math.random() * .4 - .1;
    this.life = 0;
    this.maxLife = Math.random() * 220 + 120;
    this.col  = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  };
  Particle.prototype.draw = function () {
    const progress = this.life / this.maxLife;
    const alpha    = progress < .2 ? progress / .2 : progress > .8 ? (1 - progress) / .2 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.col + (alpha * .65) + ')';
    ctx.fill();
  };

  for (let i = 0; i < 80; i++) {
    const p = new Particle();
    p.life  = Math.random() * p.maxLife; // stagger start
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.life++;
      if (p.life >= p.maxLife) p.reset();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
function animateRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();


/* ── SCROLL FADE-UP ── */
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));


/* ── MOOD CHECK-IN ── */
function selectMood(card, message) {
  document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const box = document.getElementById('mood-message');
  box.textContent = message;
  box.style.display = 'block';
}


/* ── GUIDED BREATHING (4-7-8) ── */
let breathing = false;

function startBreathing() {
  if (breathing) {
    breathing = false;
    document.getElementById('breath-orb').className    = 'breath-orb';
    document.getElementById('breath-label').textContent = 'Ready?';
    document.getElementById('breath-count').textContent = '●';
    document.getElementById('breath-btn').textContent   = 'Begin';
    return;
  }
  breathing = true;
  document.getElementById('breath-btn').textContent = 'Stop';
  runBreathCycle();
}

function runBreathCycle() {
  if (!breathing) return;
  breathPhase('Inhale', 4, 'inhale', () => {
    if (!breathing) return;
    breathPhase('Hold', 7, 'hold', () => {
      if (!breathing) return;
      breathPhase('Exhale', 8, 'exhale', () => {
        if (breathing) setTimeout(runBreathCycle, 600);
      });
    });
  });
}

function breathPhase(label, seconds, cssClass, callback) {
  const orb     = document.getElementById('breath-orb');
  const labelEl = document.getElementById('breath-label');
  const countEl = document.getElementById('breath-count');
  orb.className        = 'breath-orb ' + cssClass;
  labelEl.textContent  = label;
  let remaining        = seconds;
  countEl.textContent  = remaining;
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) { clearInterval(interval); setTimeout(callback, 300); }
    else countEl.textContent = remaining;
  }, 1000);
}


/* ── DAILY AFFIRMATIONS ── */
const affirmations = [
  '"I am allowed to take up space. I am enough, exactly as I am."',
  '"My feelings are valid. I honour them without letting them define me."',
  '"I choose to release what I cannot control and focus on what I can."',
  '"Rest is not giving up — it is gathering strength for tomorrow."',
  '"I am worthy of love, connection, and compassion — especially from myself."',
  '"Each breath I take is a fresh beginning. I am always capable of starting again."',
  '"My struggles do not define me. My resilience does."',
  '"I am doing the best I can with what I have, and that is enough."',
  '"Peace is always available to me when I slow down and breathe."',
  '"I give myself permission to feel, to heal, and to grow at my own pace."',
  '"I am not my anxiety. I am the calm that exists beneath it."',
  '"Today I choose gentleness — with others, and especially with myself."',
];
let lastIdx = -1;

function newAffirmation() {
  let idx;
  do { idx = Math.floor(Math.random() * affirmations.length); } while (idx === lastIdx);
  lastIdx = idx;
  const el = document.getElementById('affirmation-text');
  el.style.transition = 'opacity .45s ease';
  el.style.opacity = 0;
  setTimeout(() => { el.textContent = affirmations[idx]; el.style.opacity = 1; }, 450);
}