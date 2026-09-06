(() => {
  'use strict';
  const grid = document.getElementById('blogGrid');
  if (!grid || !window.KHBlog) return;

  function fmtDate(d) {
    try { return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch (e) { return d; }
  }

  function render() {
    const posts = window.KHBlog.getPosts();
    grid.innerHTML = posts.length ? posts.map(p => `
      <article class="blog-card fx-card">
        <div class="blog-card-img"><img src="${p.image || 'images/home-decor.jpg'}" alt="${p.title}" loading="lazy"></div>
        <div class="blog-card-body">
          <span class="blog-card-cat">${p.category || 'Stories'}</span>
          <h3>${p.title}</h3>
          <p>${p.excerpt || (p.content || '').slice(0, 140)}</p>
          <span class="blog-card-date">${fmtDate(p.date)}</span>
        </div>
      </article>
    `).join('') : '<p class="product-empty">No blog posts yet — check back soon.</p>';
  }

  render();
})();
