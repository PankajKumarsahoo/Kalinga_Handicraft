(() => {
  'use strict';
  const grid = document.getElementById('productGrid');
  const filterBar = document.getElementById('filterBar');
  if (!grid || !window.KHStore) return;

  const typeFilter = grid.dataset.type || 'all'; // 'all' | 'art' | 'craft'
  let activeCategory = 'All';

  function money(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  function baseList() {
    const all = window.KHStore.getProducts();
    return typeFilter === 'all' ? all : all.filter(p => p.type === typeFilter);
  }

  function render() {
    const list = baseList().filter(p => activeCategory === 'All' || p.category === activeCategory);
    grid.innerHTML = list.length ? list.map(p => `
      <div class="category-card fx-card product-card">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <h3>${p.name}</h3>
        <p class="product-price">${money(p.price)}</p>
        <button type="button" class="btn btn-primary product-add" data-name="${p.name}">Add to Cart</button>
      </div>
    `).join('') : '<p class="product-empty">No products in this category yet.</p>';
  }

  function renderFilters() {
    if (!filterBar) return;
    const cats = ['All', ...new Set(baseList().map(p => p.category))];
    filterBar.innerHTML = cats.map(c =>
      `<button type="button" class="chip${c === activeCategory ? ' active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
    filterBar.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => { activeCategory = btn.dataset.cat; renderFilters(); render(); });
    });
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-add');
    if (!btn) return;
    const cartCount = document.getElementById('cartCount');
    const cartBtn = document.getElementById('cartBtn');
    if (cartCount) {
      cartCount.textContent = (parseInt(cartCount.textContent, 10) || 0) + 1;
      if (cartBtn) cartBtn.setAttribute('aria-label', `Cart, ${cartCount.textContent} items`);
    }
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = `${btn.dataset.name} added to cart`;
      toast.classList.add('show');
      clearTimeout(window._toastT);
      window._toastT = setTimeout(() => toast.classList.remove('show'), 2400);
    }
  });

  renderFilters();
  render();
})();
