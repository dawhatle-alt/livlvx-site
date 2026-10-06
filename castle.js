(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Gold dust in the gate (any page with a #dust canvas). Each speck slowly
  // fades in, glows, fades out over 5-11s, then reappears somewhere new.
  const c = document.getElementById('dust');
  if (c) {
    const x = c.getContext('2d');
    let w, h, dpr, motes = [];
    // About one in four is a large soft orb; the rest are fine specks
    const make = (now, age = 0) => {
      const orb = Math.random() < .25;
      const dur = (orb ? 6000 : 5000) + Math.random() * 5000;
      return { x: Math.random() * w, y: Math.random() * h,
        r: orb ? 4 + Math.random() * 6 : .8 + Math.random() * 1.6,
        peak: orb ? .35 + Math.random() * .25 : .9,
        rise: orb ? 2 + Math.random() * 4 : 4 + Math.random() * 8, sway: Math.random() * 6.28, dur, born: now - age * dur };
    };
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, w * h / 9000));
      const now = performance.now();
      // Stagger ages so specks are at different points in their fade, never in sync
      motes = Array.from({ length: n }, () => make(now, Math.random()));
    };
    let last = performance.now();
    const frame = (now = performance.now()) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      x.clearRect(0, 0, w, h);
      for (const m of motes) {
        let p = (now - m.born) / m.dur;
        if (p >= 1) { Object.assign(m, make(now)); p = 0; }
        if (!still) { m.y -= m.rise * dt; m.sway += dt * .6; m.x += Math.sin(m.sway) * 4 * dt; }
        const glow = still ? .6 : Math.sin(Math.PI * p) ** 2;
        if (glow < .01) continue;
        const g = x.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, `rgba(250,226,170,${m.peak * glow})`); g.addColorStop(1, 'rgba(250,226,170,0)');
        x.fillStyle = g; x.beginPath(); x.arc(m.x, m.y, m.r * 4, 0, 6.29); x.fill();
      }
      if (!still) requestAnimationFrame(frame);
    };
    size(); frame();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { size(); if (still) frame(); }, 150); });
  }

  // Eleven arched windows for You-Universe; they light one by one
  document.querySelectorAll('[data-eleven]').forEach(el => {
    const names = (el.dataset.eleven || '').split('|');
    ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI'].forEach((n, i) => {
      const s = document.createElement('span'); s.textContent = n;
      if (names[i]) s.title = names[i];
      el.appendChild(s);
    });
    const wins = [...el.children];
    if (still) wins.forEach(s => s.classList.add('lit'));
    else { let k = 0; setInterval(() => { wins.forEach((s, i) => s.classList.toggle('lit', i <= k)); k = (k + 1) % 12; }, 700); }
  });

  // Candle glint follows the cursor on cards
  document.querySelectorAll('.card').forEach(card => card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect(); card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
  }));

  // Mobile menu
  const tog = document.querySelector('.menu-toggle'), menu = document.getElementById('menu');
  if (tog && menu) tog.addEventListener('click', () => {
    const open = tog.getAttribute('aria-expanded') !== 'true';
    tog.setAttribute('aria-expanded', open); menu.classList.toggle('open', open);
  });

  // Newsletter: preview only
  const f = document.getElementById('signup');
  if (f) {
    const msg = document.getElementById('signup-msg'), em = document.getElementById('email');
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!em.checkValidity()) { msg.textContent = 'Please enter an email address like name@example.com.'; em.focus(); return; }
      msg.textContent = 'Thank you. (Preview only: on the live site this adds you to Liv\'s list.)';
      f.reset();
    });
  }

  // Contact form: preview only, inline validation
  const cf = document.getElementById('contact-form');
  if (cf) {
    const out = document.getElementById('contact-msg');
    cf.querySelectorAll('input,select,textarea').forEach(inp => inp.addEventListener('blur', () => check(inp)));
    function check(inp) {
      const err = document.getElementById(inp.id + '-err');
      if (!err) return true;
      let m = '';
      if (inp.validity.valueMissing) m = inp.dataset.need;
      else if (inp.validity.typeMismatch) m = 'Enter an email address like name@example.com.';
      err.textContent = m; inp.setAttribute('aria-invalid', !!m);
      return !m;
    }
    cf.addEventListener('submit', e => {
      e.preventDefault();
      const bad = [...cf.querySelectorAll('[required]')].filter(i => !check(i));
      if (bad.length) { bad[0].focus(); out.textContent = ''; return; }
      out.textContent = 'Thank you. (Preview only: on the live site this sends your message to Liv.)';
      cf.reset();
    });
  }
})();
