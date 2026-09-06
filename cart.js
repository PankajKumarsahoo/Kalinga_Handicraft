(() => {
  'use strict';
  const KEY = 'kh_cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function saveCart(cart) { localStorage.setItem(KEY, JSON.stringify(cart)); updateBadge(); }

  function addItem(product, qty = 1) {
    const cart = getCart();
    const i = cart.findIndex(x => x.id === product.id);
    if (i > -1) cart[i].qty += qty;
    else cart.push({ id: product.id, name: product.name, price: Number(product.price), image: product.image, qty });
    saveCart(cart);
  }
  function updateQty(id, qty) {
    let cart = getCart();
    if (qty <= 0) { cart = cart.filter(x => x.id !== id); }
    else { const i = cart.findIndex(x => x.id === id); if (i > -1) cart[i].qty = qty; }
    saveCart(cart);
  }
  function removeItem(id) { saveCart(getCart().filter(x => x.id !== id)); }
  function clearCart() { saveCart([]); }
  function itemCount() { return getCart().reduce((s, x) => s + x.qty, 0); }
  function subtotal() { return getCart().reduce((s, x) => s + x.qty * x.price, 0); }

  function updateBadge() {
    const badge = document.getElementById('cartCount');
    const btn = document.getElementById('cartBtn');
    const n = itemCount();
    if (badge) badge.textContent = n;
    if (btn) btn.setAttribute('aria-label', `Cart, ${n} item${n === 1 ? '' : 's'}`);
  }

  document.addEventListener('DOMContentLoaded', updateBadge);
  window.KHCart = { getCart, addItem, updateQty, removeItem, clearCart, itemCount, subtotal, money: n => '₹' + Number(n).toLocaleString('en-IN') };
})();
