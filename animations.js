/* animations.js — GSAP: hero, revelados con scroll, flotación, constelación */
(function () {
  'use strict';
  if (!window.gsap) return;
  gsap.registerPlugin(window.ScrollTrigger);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (reduce) {
      gsap.set('.reveal, [data-reveal]', { opacity: 1, y: 0 });
      return;
    }

    // Título del hero letra por letra (Splitting.js)
    if (window.Splitting) Splitting({ target: '#heroTitle', by: 'chars' });
    const chars = document.querySelectorAll('#heroTitle .char');
    if (chars.length) {
      gsap.from(chars, {
        yPercent: 110, opacity: 0, rotate: 6,
        duration: 1, ease: 'expo.out', stagger: 0.03, delay: 0.1
      });
    }

    // Elementos del hero con data-reveal
    gsap.from('.hero [data-reveal]', {
      y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.5
    });

    // Constelación: las líneas se dibujan solas
    document.querySelectorAll('.constellation-line').forEach((p, i) => {
      const len = p.getTotalLength ? p.getTotalLength() : 400;
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.6, delay: 0.6 + i * 0.15, ease: 'power2.inOut',
          onComplete: () => { p.style.strokeDasharray = '4 6'; } });
    });

    // Nodos del hero: entrada + flotación lenta
    gsap.from('.hero-node, .hero-core', {
      scale: 0.4, opacity: 0, duration: 1, ease: 'back.out(1.6)', stagger: 0.1, delay: 0.4
    });
    document.querySelectorAll('[data-float]').forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 ? -14 : 14, x: i % 3 ? 8 : -8, rotate: i % 2 ? 4 : -4,
        duration: 3 + i * 0.4, ease: 'sine.inOut', repeat: -1, yoyo: true
      });
    });

    // Revelados con scroll (fuera del hero)
    gsap.set('section:not(.hero) [data-reveal]', { opacity: 0, y: 28 });
    ScrollTrigger.batch('.reveal, section:not(.hero) [data-reveal]', {
      start: 'top 88%', once: true,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true
      })
    });
  }

  document.addEventListener('cc:ready', init, { once: true });
})();
