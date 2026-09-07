(() => {
  'use strict';
  if (!window.KHWish) return;

  const rows = document.getElementById('wishRows');
  const emptyBox = document.getElementById('wishEmpty');
  const filledBox = document.getElementById('wishFilled');
  const toast = document.getElementById('toast');

  function money(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastT);
    window._toastT = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function allProducts() {
    return window.KHStore ? window.KHStore.getProducts() : [];
  }

  function render() {
    const ids = window.KHWish.getWishlist();
    const products = allProducts();
    const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

    if (!items.length) {
      if (emptyBox) emptyBox.style.display = 'block';
      if (filledBox) filledBox.style.display = 'none';
      return;
    }
    if (emptyBox) emptyBox.style.display = 'none';
    if (filledBox) filledBox.style.display = 'grid';

    rows.innerHTML = items.map(item => `
      <tr data-id="${item.id}">
        <td class="cart-prod">
          <a href="product.html?id=${encodeURIComponent(item.id)}">
            <img src="${item.image}" alt="${item.name}">
          </a>
          <a href="product.html?id=${encodeURIComponent(item.id)}" class="product-card-title-link"><span>${item.name}</span></a>
        </td>
        <td>${money(item.price)}</td>
        <td>
          <button type="button" class="btn btn-primary wish-add-cart" aria-label="Add to cart">Add to Cart</button>
        </td>
        <td><button type="button" class="cart-remove wish-remove" aria-label="Remove from wishlist">&times;</button></td>
      </tr>
    `).join('');
  }

  if (rows) {
    rows.addEventListener('click', (e) => {
      const tr = e.target.closest('tr[data-id]');
      if (!tr) return;
      const id = tr.dataset.id;

      if (e.target.closest('.wish-add-cart')) {
        const product = allProducts().find(p => p.id === id);
        if (product && window.KHCart) {
          window.KHCart.addItem(product);
          showToast(`${product.name} added to cart`);
        }
      } else if (e.target.closest('.wish-remove')) {
        window.KHWish.removeItem(id);
        showToast('Removed from wishlist');
        render();
      }
    });
  }

  render();
})();
