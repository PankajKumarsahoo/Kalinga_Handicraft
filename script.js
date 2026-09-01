(() => {
  'use strict';

  /* ---------- Toast helper ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg){
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  hamburger.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Search panel ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  searchToggle.addEventListener('click', () => {
    const open = searchPanel.classList.toggle('open');
    searchToggle.setAttribute('aria-expanded', open);
    if(open) searchPanel.querySelector('input').focus();
  });
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.querySelector('input').value.trim();
    showToast(q ? `Searching for “${q}”…` : 'Type something to search');
  });

  /* ---------- Category data (swap freely per real catalog) ----------
     "image" points at your real product photo in /images.
     "color" is used only as a background behind the photo while it loads
     (or if the file is ever missing), so leave it — it won't normally show. */
  const categories = [
    { name:'Folk Paintings',     color:'#EADFC4', image:'images/folk-paintings.jpg'    },
    { name:'Handmade Decor',     color:'#DCE6DA', image:'images/handmade-decor.jpg'    },
    { name:'Textiles',           color:'#F0D9C7', image:'images/textiles.jpg'          },
    { name:'Pottery & Ceramics', color:'#EED9BE', image:'images/pottery-ceramics.jpg'  },
    { name:'Jewellery',          color:'#E7DCC0', image:'images/jewellery.jpg'         },
    { name:'Wooden Art',         color:'#DFCBAE', image:'images/wooden-art.jpg'        },
    { name:'Wall Art',           color:'#DFCBAE', image:'images/wall-art.jpg'          },
    { name:'Straw Crafts',       color:'#EADFC4', image:'images/Straw Crafts.jpg'      },
    { name:'Jute Products & Bags', color:'#DCE6DA', image:'images/jute-products-bags.jpg'     },
    { name:'Palm Leaf Crafts',       color:'#F0D9C7', image:'images/palm-leaf-crafts.jpg'      },
    { name:'Bamboo & Cane Crafts  ',       color:'#EED9BE', image:'images/Bamboo & Cane Crafts  .jpg'      },
    { name:'Gift Items',       color:'#E7DCC0', image:'images/Gift Items.jpg'      },
    { name:'Mementos & Awards',       color:'#DFCBAE', image:'images/Mementos Awards.jpg'      },
    { name:'Home Décor',       color:'#DFCBAE', image:'images/Home Décor.jpg'      },
    { name:'Custom Products',       color:'#EADFC4', image:'images/Custom Products.jpg'      },

  ];

  const grid = document.getElementById('categoryGrid');
  grid.innerHTML = categories.map(cat => `
    <article class="cat-card" data-cat="${cat.name}" tabindex="0" role="button" aria-label="Shop ${cat.name}">
      <div class="cat-thumb" style="background:${cat.color}">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy">
      </div>
      <h3>${cat.name}</h3>
      <span class="go" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </span>
    </article>
  `).join('');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.cat-card');
    if(!card) return;
    showToast(`Browsing “${card.dataset.cat}” →`);
  });
  grid.addEventListener('keydown', (e) => {
    if(e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.cat-card');
    if(!card) return;
    e.preventDefault();
    showToast(`Browsing “${card.dataset.cat}” →`);
  });

  /* ---------- Cart (demo counter) ---------- */
  const cartCount = document.getElementById('cartCount');
  const cartBtn = document.getElementById('cartBtn');
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

  /* ---------- Newsletter ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
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
    newsletterNote.textContent = `Thanks — we'll write to ${email}.`;
    newsletterNote.style.color = 'var(--gold)';
    input.value = '';
  });

  /* ---------- CTA buttons feedback for placeholder actions ---------- */
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if(!href || href === '#') e.preventDefault();
    });
  });
})();