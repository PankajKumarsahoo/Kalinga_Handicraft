(() => {
  'use strict';

  /* ---------- Toast helper ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg){
    if(!toastEl) return;
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  if(header){
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    document.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  if(hamburger && mainNav){
    hamburger.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Search panel ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  if(searchToggle && searchPanel){
    searchToggle.addEventListener('click', () => {
      const open = searchPanel.classList.toggle('open');
      searchToggle.setAttribute('aria-expanded', open);
      if(open) searchPanel.querySelector('input').focus();
    });
  }
  const searchForm = document.getElementById('searchForm');
  if(searchForm){
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = e.target.querySelector('input').value.trim();
      showToast(q ? `Searching for "${q}"...` : 'Type something to search');
    });
  }

  /* ---------- Category / product cards ----------
     The cards are written directly in the page markup (real photos,
     real links) — nothing here regenerates them, so editing the HTML
     is always what actually renders. This just wires up the demo
     click feedback and keyboard support. */
  const categoryGrid = document.getElementById('categoryGrid');
  if(categoryGrid){
    categoryGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if(!card) return;
      const name = card.querySelector('h3')?.textContent?.trim();
      if(name) showToast(`Browsing "${name}"...`);
    });
  }

  /* ---------- Interactive card glow (cursor-tracked spotlight) ----------
     Any element with the .fx-card class gets a glow that follows the
     pointer, driven by the --mx / --my custom properties read in
     styles.css. Falls back to a centered glow on touch devices. */
  document.querySelectorAll('.fx-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  /* ---------- Cart (demo counter) ---------- */
  const cartCount = document.getElementById('cartCount');
  const cartBtn = document.getElementById('cartBtn');
  if(cartCount && cartBtn){
    let count = 0;
    cartBtn.addEventListener('click', () => {
      count++;
      cartCount.textContent = count;
      cartCount.classList.remove('bump');
      void cartCount.offsetWidth; // restart animation
      cartCount.classList.add('bump');
      cartBtn.setAttribute('aria-label', `Cart, ${count} item${count === 1 ? '' : 's'}`);
      showToast('Cart updated');
    });
  }

  /* ---------- Newsletter ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
  if(newsletterForm && newsletterNote){
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const email = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!valid){
        newsletterNote.textContent = 'Please enter a valid email address.';
        newsletterNote.style.color = '#E07856';
        return;
      }
      newsletterNote.textContent = `Thanks -- we'll write to ${email}.`;
      newsletterNote.style.color = 'var(--gold)';
      input.value = '';
    });
  }

  /* ---------- Contact form (demo submit) ---------- */
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent -- we will get back to you soon.');
      contactForm.reset();
    });
  }

  /* ---------- CTA buttons feedback for placeholder actions ---------- */
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if(!href || href === '#') e.preventDefault();
    });
  });
})();
