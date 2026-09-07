(() => {
  'use strict';
  const KEY = 'kh_wishlist';

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function saveWishlist(list) { localStorage.setItem(KEY, JSON.stringify(list)); updateBadge(); }

  function isWished(id) { return getWishlist().includes(id); }

  function toggleWishlist(id) {
    const list = getWishlist();
    const already = list.includes(id);
    const next = already ? list.filter(x => x !== id) : [...list, id];
    saveWishlist(next);
    return !already;
  }

  function removeItem(id) { saveWishlist(getWishlist().filter(x => x !== id)); }
  function clearWishlist() { saveWishlist([]); }
  function count() { return getWishlist().length; }

  function updateBadge() {
    const badge = document.getElementById('wishCount');
    const btn = document.getElementById('wishBtn');
    const n = count();
    if (badge) badge.textContent = n;
    if (btn) {
      btn.setAttribute('aria-label', `Wishlist, ${n} item${n === 1 ? '' : 's'}`);
      btn.classList.toggle('active', n > 0);
    }
  }

  document.addEventListener('DOMContentLoaded', updateBadge);
  window.KHWish = { getWishlist, toggleWishlist, isWished, removeItem, clearWishlist, count, updateBadge };
})();
