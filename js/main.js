/* main.js — arranque: loader, iconos, smooth scroll */
(function () {
  'use strict';

  // Año del footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Iconos Lucide
  window.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
  });

  // Smooth scroll (Lenis) + sincronía con ScrollTrigger
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduce) {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -70 });
        }
      });
    });
  }

  // Loader: barra de progreso y salida
  const bar = document.getElementById('loader-bar-fill');
  const loader = document.getElementById('loader');
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(p + Math.random() * 18, 92);
    if (bar) bar.style.width = p + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(tick);
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
      document.body.classList.remove('js-disabled');
      if (loader) loader.classList.add('is-hidden');
      document.dispatchEvent(new CustomEvent('cc:ready'));
    }, 450);
  });
})();
