(() => {
  'use strict';
  const grid = document.getElementById('productGrid');
  if (!grid || !window.KHStore) return;

  const typeFilter = grid.dataset.type || 'all'; // 'all' | 'art' | 'craft'
  const PAGE_SIZE = 12;
  const WISH_KEY = 'kh_wishlist';

  const params = new URLSearchParams(location.search);
  const urlCat = params.get('cat');

  let activeCats = urlCat ? new Set([urlCat]) : new Set();
  let maxPrice = 10000;
  let sortBy = 'featured';
  let page = 1;

  function money(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; }
  }
  function toggleWishlist(id) {
    let list = getWishlist();
    if (list.includes(id)) list = list.filter(x => x !== id);
    else list.push(id);
    localStorage.setItem(WISH_KEY, JSON.stringify(list));
    return list.includes(id);
  }

  function baseList() {
    const all = window.KHStore.getProducts();
    return typeFilter === 'all' ? all : all.filter(p => p.type === typeFilter);
  }

  function categoryCounts() {
    const counts = {};
    baseList().forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }

  function filteredList() {
    let list = baseList().filter(p => Number(p.price) <= maxPrice);
    if (activeCats.size) list = list.filter(p => activeCats.has(p.category));
    switch (sortBy) {
      case 'price-asc': list = list.slice().sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = list.slice().sort((a, b) => b.price - a.price); break;
      case 'name-asc': list = list.slice().sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }

  function renderCategoryStrip() {
    const strip = document.getElementById('categoryStrip');
    if (!strip) return;
    const counts = categoryCounts();
    const cats = Object.keys(counts);
    const all = baseList();
    const thumbFor = cat => (all.find(p => p.category === cat) || {}).image || 'images/home-decor.jpg';

    const items = [
      `<button type="button" class="cat-circle${activeCats.size === 0 ? ' active' : ''}" data-cat="">
         <span class="cat-circle-img"><img src="${all[0] ? all[0].image : 'images/home-decor.jpg'}" alt=""></span>
         <strong>All ${typeFilter === 'craft' ? 'Crafts' : typeFilter === 'art' ? 'Art' : 'Products'}</strong>
         <span>${all.length} Products</span>
       </button>`,
      ...cats.map(cat => `
        <button type="button" class="cat-circle${activeCats.has(cat) ? ' active' : ''}" data-cat="${cat}">
          <span class="cat-circle-img"><img src="${thumbFor(cat)}" alt=""></span>
          <strong>${cat}</strong>
          <span>${counts[cat]} Products</span>
        </button>`)
    ];
    strip.innerHTML = items.join('');

    strip.querySelectorAll('.cat-circle').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        activeCats = cat ? new Set([cat]) : new Set();
        page = 1;
        syncCategoryCheckboxes();
        renderCategoryStrip();
        render();
      });
    });
  }

  function renderCategoryFilters() {
    const box = document.getElementById('categoryFilters');
    if (!box) return;
    const counts = categoryCounts();
    box.innerHTML = Object.keys(counts).map(cat => `
      <label class="check-row">
        <input type="checkbox" value="${cat}" ${activeCats.has(cat) ? 'checked' : ''}>
        <span>${cat}</span>
        <em>${counts[cat]}</em>
      </label>
    `).join('');

    box.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) activeCats.add(cb.value); else activeCats.delete(cb.value);
        page = 1;
        renderCategoryStrip();
        render();
      });
    });
  }

  function syncCategoryCheckboxes() {
    const box = document.getElementById('categoryFilters');
    if (!box) return;
    box.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = activeCats.has(cb.value); });
  }

  function renderPagination(total) {
    const box = document.getElementById('pagination');
    if (!box) return;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (pages <= 1) { box.innerHTML = ''; return; }
    let html = `<button type="button" class="page-btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>&lsaquo;</button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button type="button" class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button type="button" class="page-btn" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}>&rsaquo;</button>`;
    box.innerHTML = html;
    box.querySelectorAll('.page-btn').forEach(b => b.addEventListener('click', () => {
      const p = Number(b.dataset.page);
      if (p >= 1 && p <= pages) { page = p; render(); window.scrollTo({ top: document.getElementById('productGrid').offsetTop - 100, behavior: 'smooth' }); }
    }));
  }

  function render() {
    const wishlist = getWishlist();
    const full = filteredList();
    const total = full.length;
    const start = (page - 1) * PAGE_SIZE;
    const list = full.slice(start, start + PAGE_SIZE);

    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = total ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total} products` : 'No products found';

    grid.innerHTML = list.length ? list.map(p => `
      <div class="product-card fx-card" data-id="${p.id}">
        <div class="product-card-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <button type="button" class="wish-btn${wishlist.includes(p.id) ? ' active' : ''}" data-id="${p.id}" aria-label="Add to wishlist">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.65-9.5 9-9.5 9z"/></svg>
          </button>
        </div>
        <div class="product-card-body">
          <h3>${p.name}</h3>
          <span class="product-card-sub">${p.category}</span>
          <div class="product-card-row">
            <span class="product-price">${money(p.price)}</span>
            <button type="button" class="cart-icon-btn product-add" data-id="${p.id}" data-name="${p.name}" aria-label="Add to cart">
              <svg viewBox="0 0 24 24"><path d="M3 4h2l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.3"/><circle cx="17" cy="21" r="1.3"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('') : '<p class="product-empty">No products match your filters.</p>';

    renderPagination(total);
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastT);
    window._toastT = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.product-add');
    const wishBtn = e.target.closest('.wish-btn');
    if (addBtn) {
      const product = baseList().find(p => p.id === addBtn.dataset.id);
      if (product && window.KHCart) window.KHCart.addItem(product);
      showToast(`${addBtn.dataset.name} added to cart`);
    } else if (wishBtn) {
      const active = toggleWishlist(wishBtn.dataset.id);
      wishBtn.classList.toggle('active', active);
      showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
    }
  });

  const priceRange = document.getElementById('priceRange');
  const priceRangeVal = document.getElementById('priceRangeVal');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      maxPrice = Number(priceRange.value);
      priceRangeVal.textContent = maxPrice >= 10000 ? '₹10,000+' : money(maxPrice);
      page = 1;
      render();
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => { sortBy = sortSelect.value; page = 1; render(); });
  }

  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      activeCats = new Set();
      maxPrice = 10000;
      sortBy = 'featured';
      page = 1;
      if (priceRange) priceRange.value = 10000;
      if (priceRangeVal) priceRangeVal.textContent = '₹10,000+';
      if (sortSelect) sortSelect.value = 'featured';
      syncCategoryCheckboxes();
      renderCategoryStrip();
      render();
    });
  }

  renderCategoryStrip();
  renderCategoryFilters();
  render();
})();
