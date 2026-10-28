const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = '☰';
}));
document.getElementById('year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const form = document.getElementById('enquiry-form');
const statusText = document.getElementById('form-status');
form?.addEventListener('submit', () => {
  statusText.textContent = 'Opening secure enquiry submission… If this is your first submission, check your inbox for FormSubmit activation.';
});


// Scroll-driven story: the editing process evolves as the visitor scrolls.
(() => {
  const stage = document.getElementById('process-stage');
  if (!stage) return;
  const number = document.getElementById('process-number');
  const kicker = document.getElementById('process-kicker');
  const title = document.getElementById('process-title');
  const description = document.getElementById('process-description');
  const tags = document.getElementById('process-tags');
  const previewTime = document.getElementById('preview-time');
  const previewLabel = document.getElementById('preview-label');
  const captionStep = document.getElementById('visual-caption-step');
  const progressFill = document.getElementById('process-progress-fill');
  const playhead = document.getElementById('timeline-playhead');
  const cards = [...document.querySelectorAll('.process-step')];
  const scenes = [
    {kicker:'THE STARTING POINT',title:'Raw footage.',description:'Every great edit starts with moments waiting to be found.',tags:['SELECT','REVIEW','IMAGINE'],label:'RAW FOOTAGE',time:'00:00:01:12',caption:'01 — DISCOVER'},
    {kicker:'SHAPING THE STORY',title:'Find the rhythm.',description:'The right cut, beat and pace turn separate clips into one story.',tags:['CUTS','MUSIC SYNC','PACING'],label:'TIMELINE IN MOTION',time:'00:00:04:08',caption:'02 — BUILD'},
    {kicker:'THE CREATIVE FINISH',title:'Make it feel.',description:'Color, sound and tiny details give the footage its own atmosphere.',tags:['COLOR GRADE','SOUND','DETAIL'],label:'COLOR & FINISH',time:'00:00:08:16',caption:'03 — POLISH'},
    {kicker:'READY FOR THE WORLD',title:'A story, complete.',description:'The final edit is polished, exported and ready to make someone stop scrolling.',tags:['1080P','FINAL CUT','READY TO SHARE'],label:'FINAL EXPORT',time:'00:00:12:00',caption:'04 — DELIVER'}
  ];
  let active = -1;
  function setStep(step) {
    step = Math.max(0, Math.min(3, step));
    if (active === step) return;
    active = step;
    const item = scenes[step];
    stage.dataset.step = String(step);
    number.textContent = String(step + 1).padStart(2, '0');
    kicker.textContent = item.kicker;
    title.textContent = item.title;
    description.textContent = item.description;
    tags.innerHTML = item.tags.map(t => `<span>${t}</span>`).join('');
    previewLabel.textContent = item.label;
    previewTime.textContent = item.time;
    captionStep.textContent = item.caption;
    progressFill.style.width = `${(step + 1) * 25}%`;
    if (playhead) playhead.style.left = `${25 + step * 17}%`;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === step));
  }
  // Drive each scene from the full tall section's scroll progress.
  function updateFromScroll() {
    const section = document.getElementById('process');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const range = Math.max(1, section.offsetHeight - viewport);
    const progress = Math.max(0, Math.min(0.999, -rect.top / range));
    setStep(Math.floor(progress * 4));
    const preview = document.getElementById('main-preview');
    if (preview) {
      const tilt = (progress - 0.5) * 7;
      preview.style.setProperty('--scroll-tilt', `${tilt.toFixed(2)}deg`);
    }
  }
  window.addEventListener('scroll', updateFromScroll, {passive:true});
  window.addEventListener('resize', updateFromScroll);
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const step = Number(card.dataset.step);
      setStep(step);
      // Scroll the visual into view so the chosen chapter is visible on mobile too.
      stage.scrollIntoView({behavior:'smooth', block:'center'});
    });
  });
  setStep(0);
  updateFromScroll();
})();

// Ambient particle field — lightweight, responsive, and reduced-motion aware.
(() => {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  let w = 0, h = 0, dpr = 1, particles = [], raf = 0;
  const count = () => Math.min(70, Math.max(24, Math.floor(w / 18)));
  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = rect.width; h = rect.height;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles = Array.from({length:count()}, () => ({
      x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.8+.35,
      vx:(Math.random()-.5)*.24, vy:(Math.random()-.5)*.2,
      hue:Math.random()>.5?150:205, alpha:Math.random()*.38+.12
    }));
  }
  function draw() {
    ctx.clearRect(0,0,w,h);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = w+5; if (p.x > w+5) p.x = -5;
      if (p.y < -5) p.y = h+5; if (p.y > h+5) p.y = -5;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue},90%,72%,${p.alpha})`; ctx.fill();
    }
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const a=particles[i], b=particles[j], dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<90) {
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(89,220,180,${(1-dist/90)*.07})`;ctx.lineWidth=.6;ctx.stroke();
        }
      }
    }
    raf=requestAnimationFrame(draw);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!raf) draw();
  });
  window.addEventListener('resize', resize, {passive:true});
  resize(); draw();
})();
