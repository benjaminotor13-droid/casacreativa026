/* components.js — nav, menú móvil, cursor, confeti, testimonios */
(function () {
  'use strict';

  // Nav: estado al hacer scroll
  const nav = document.getElementById('nav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Cursor personalizado
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-cursor-pop]').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  // Confeti suave en el panel de contacto
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    const colors = ['#FF4D8D', '#FFB63E', '#14C3AE', '#5B2EFF'];
    let w, h, pieces = [], running = false;

    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    const make = () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 2 + Math.random() * 3, c: colors[(Math.random() * colors.length) | 0],
      vy: 0.15 + Math.random() * 0.35, vx: (Math.random() - 0.5) * 0.3, a: 0.35 + Math.random() * 0.4
    });
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      pieces.forEach((p) => {
        p.y += p.vy; p.x += p.vx;
        if (p.y > h) { p.y = -5; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    resize();
    pieces = Array.from({ length: 40 }, make);
    window.addEventListener('resize', resize);
    new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) draw(); }).observe(canvas);
  }

  // Testimonios: arrastrar con el mouse
  const track = document.getElementById('testiTrack');
  if (track) {
    let down = false, startX = 0, startLeft = 0;
    track.addEventListener('mousedown', (e) => { down = true; startX = e.pageX; startLeft = track.scrollLeft; track.style.scrollSnapType = 'none'; });
    window.addEventListener('mouseup', () => { down = false; track.style.scrollSnapType = ''; });
    track.addEventListener('mousemove', (e) => { if (down) track.scrollLeft = startLeft - (e.pageX - startX); });
  }
})();
