(() => {
  'use strict';
  const root = document.getElementById('productDetailRoot');
  if (!root || !window.KHStore) return;

  const WISH_KEY = 'kh_wishlist';
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  function money(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  function getWishlist() {
    if (window.KHWish) return window.KHWish.getWishlist();
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; }
  }
  function toggleWishlist(pid) {
    if (window.KHWish) return window.KHWish.toggleWishlist(pid);
    let list = getWishlist();
    if (list.includes(pid)) list = list.filter(x => x !== pid);
    else list.push(pid);
    localStorage.setItem(WISH_KEY, JSON.stringify(list));
    return list.includes(pid);
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastT);
    window._toastT = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // A short, generic write-up since product records don't carry their own copy.
  function describe(p) {
    const kind = p.type === 'art' ? 'artwork' : 'craft piece';
    return `This ${p.name.toLowerCase()} is a handcrafted ${kind} from our ${p.category} collection, `
      + `made by skilled Indian artisans using traditional techniques passed down through generations. `
      + `Every piece carries small natural variations that make it one of a kind — a mark of genuine `
      + `handmade craftsmanship rather than a factory finish.`;
  }

  function renderBreadcrumb(p) {
    const box = document.getElementById('breadcrumb');
    if (!box) return;
    if (!p) {
      box.innerHTML = `<a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><em>Product not found</em>`;
      return;
    }
    box.innerHTML = `
      <a href="index.html">Home</a><span>/</span>
      <a href="shop.html">Shop</a><span>/</span>
      <a href="shop.html?cat=${encodeURIComponent(p.category)}">${p.category}</a><span>/</span>
      <em>${p.name}</em>
    `;
  }

  function renderNotFound() {
    renderBreadcrumb(null);
    root.innerHTML = `
      <div class="product-not-found">
        <h1>Product Not Found</h1>
        <p>The item you're looking for may have been removed or is no longer available.</p>
        <a href="shop.html" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
    const related = document.getElementById('relatedSection');
    if (related) related.style.display = 'none';
  }

  function cardTemplate(p, wishlist) {
    return `
      <div class="product-card fx-card" data-id="${p.id}">
        <div class="product-card-img">
          <a href="product.html?id=${encodeURIComponent(p.id)}" aria-label="View ${p.name}">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </a>
          <button type="button" class="wish-btn${wishlist.includes(p.id) ? ' active' : ''}" data-id="${p.id}" aria-label="Add to wishlist">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.65-9.5 9-9.5 9z"/></svg>
          </button>
        </div>
        <div class="product-card-body">
          <a href="product.html?id=${encodeURIComponent(p.id)}" class="product-card-title-link"><h3>${p.name}</h3></a>
          <span class="product-card-sub">${p.category}</span>
          <div class="product-card-row">
            <span class="product-price">${money(p.price)}</span>
            <button type="button" class="cart-icon-btn product-add" data-id="${p.id}" data-name="${p.name}" aria-label="Add to cart">
              <svg viewBox="0 0 24 24"><path d="M3 4h2l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.3"/><circle cx="17" cy="21" r="1.3"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderRelated(p, all) {
    const grid = document.getElementById('relatedGrid');
    const section = document.getElementById('relatedSection');
    if (!grid) return;
    const wishlist = getWishlist();
    const related = all.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4);
    const fallback = related.length ? related : all.filter(x => x.id !== p.id).slice(0, 4);
    if (!fallback.length) { if (section) section.style.display = 'none'; return; }
    grid.innerHTML = fallback.map(item => cardTemplate(item, wishlist)).join('');

    grid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.product-add');
      const wishBtn = e.target.closest('.wish-btn');
      if (addBtn) {
        const product = all.find(x => x.id === addBtn.dataset.id);
        if (product && window.KHCart) window.KHCart.addItem(product);
        showToast(`${addBtn.dataset.name} added to cart`);
      } else if (wishBtn) {
        const active = toggleWishlist(wishBtn.dataset.id);
        wishBtn.classList.toggle('active', active);
        showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
      }
    });
  }

  function renderProduct(p, all) {
    document.title = `${p.name} — Kalinga Handicraft`;
    renderBreadcrumb(p);

    const wishlist = getWishlist();
    root.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-detail-gallery">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="product-detail-info">
          <span class="product-detail-cat">${p.category}</span>
          <h1>${p.name}</h1>
          <div class="product-detail-price">${money(p.price)}</div>
          <p class="product-detail-desc">${describe(p)}</p>
          <ul class="product-detail-meta">
            <li><strong>Category</strong><span>${p.category}</span></li>
            <li><strong>Type</strong><span>${p.type === 'art' ? 'Art' : 'Craft'}</span></li>
            <li><strong>Availability</strong><span>In Stock</span></li>
          </ul>
          <div class="product-detail-actions">
            <div class="qty-stepper">
              <button type="button" class="qty-btn qty-dec" aria-label="Decrease quantity">−</button>
              <span class="qty-val" id="pdQty">1</span>
              <button type="button" class="qty-btn qty-inc" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="btn btn-primary" id="pdAddToCart">
              <svg viewBox="0 0 24 24"><path d="M3 4h2l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.3"/><circle cx="17" cy="21" r="1.3"/></svg>
              Add to Cart
            </button>
            <button type="button" class="btn btn-outline wish-toggle" id="pdWishBtn">
              <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.65-9.5 9-9.5 9z"/></svg>
              <span id="pdWishLabel">${wishlist.includes(p.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
          <a href="shop.html" class="product-detail-back">&larr; Continue Shopping</a>
        </div>
      </div>
    `;

    let qty = 1;
    const qtyEl = document.getElementById('pdQty');
    root.querySelector('.qty-dec').addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      qtyEl.textContent = qty;
    });
    root.querySelector('.qty-inc').addEventListener('click', () => {
      qty = qty + 1;
      qtyEl.textContent = qty;
    });

    document.getElementById('pdAddToCart').addEventListener('click', () => {
      if (window.KHCart) window.KHCart.addItem(p, qty);
      showToast(`${p.name} added to cart`);
    });

    const wishBtn = document.getElementById('pdWishBtn');
    wishBtn.classList.toggle('active', wishlist.includes(p.id));
    wishBtn.addEventListener('click', () => {
      const active = toggleWishlist(p.id);
      wishBtn.classList.toggle('active', active);
      document.getElementById('pdWishLabel').textContent = active ? 'In Wishlist' : 'Add to Wishlist';
      showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
    });

    renderRelated(p, all);
  }

  const all = window.KHStore.getProducts();
  const product = all.find(p => p.id === id);
  if (!product) renderNotFound();
  else renderProduct(product, all);
})();
