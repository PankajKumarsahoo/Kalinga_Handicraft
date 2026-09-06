(() => {
  'use strict';
  if (!window.KHCart) return;
  const rows = document.getElementById('cartRows');
  const emptyBox = document.getElementById('cartEmpty');
  const filledBox = document.getElementById('cartFilled');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastT);
    window._toastT = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function render() {
    const cart = window.KHCart.getCart();
    if (!cart.length) {
      emptyBox.style.display = 'block';
      filledBox.style.display = 'none';
      return;
    }
    emptyBox.style.display = 'none';
    filledBox.style.display = 'grid';

    rows.innerHTML = cart.map(item => `
      <tr data-id="${item.id}">
        <td class="cart-prod">
          <img src="${item.image}" alt="${item.name}">
          <span>${item.name}</span>
        </td>
        <td>${window.KHCart.money(item.price)}</td>
        <td>
          <div class="qty-stepper">
            <button type="button" class="qty-btn qty-dec" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.qty}</span>
            <button type="button" class="qty-btn qty-inc" aria-label="Increase quantity">+</button>
          </div>
        </td>
        <td>${window.KHCart.money(item.price * item.qty)}</td>
        <td><button type="button" class="cart-remove" aria-label="Remove item">&times;</button></td>
      </tr>
    `).join('');

    const subtotal = window.KHCart.subtotal();
    subtotalEl.textContent = window.KHCart.money(subtotal);
    totalEl.textContent = window.KHCart.money(subtotal);
  }

  rows.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-id]');
    if (!tr) return;
    const id = tr.dataset.id;
    const cart = window.KHCart.getCart();
    const item = cart.find(x => x.id === id);
    if (!item) return;

    if (e.target.closest('.qty-inc')) window.KHCart.updateQty(id, item.qty + 1);
    else if (e.target.closest('.qty-dec')) window.KHCart.updateQty(id, item.qty - 1);
    else if (e.target.closest('.cart-remove')) { window.KHCart.removeItem(id); showToast('Item removed'); }
    else return;

    render();
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!window.KHCart.getCart().length) return;
      showToast('Checkout coming soon — connect your backend to enable orders');
    });
  }

  render();
})();
