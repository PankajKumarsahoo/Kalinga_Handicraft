(() => {
  'use strict';
  const KEY = 'kh_posts';

  const DEFAULTS = [
    { id: 'b1', title: 'The Art of Pattachitra', excerpt: 'A look into the centuries-old scroll painting tradition of Odisha and the artisans keeping it alive.', category: 'Traditions', date: '2026-06-12', image: 'images/folk-paintings.jpg', content: 'A look into the centuries-old scroll painting tradition of Odisha and the artisans keeping it alive.' },
    { id: 'b2', title: 'Behind the Wheel: Blue Pottery', excerpt: 'How Jaipur\u2019s blue pottery artisans shape clay-free ceramics using a technique found nowhere else in the world.', category: 'Artisans', date: '2026-05-20', image: 'images/pottery-ceramics.jpg', content: 'How Jaipur\u2019s blue pottery artisans shape clay-free ceramics using a technique found nowhere else in the world.' },
    { id: 'b3', title: 'Why Handmade Matters', excerpt: 'Every handcrafted piece supports a family, a tradition and a more sustainable way of making things.', category: 'Sustainability', date: '2026-04-02', image: 'images/home-decor.jpg', content: 'Every handcrafted piece supports a family, a tradition and a more sustainable way of making things.' }
  ];

  function getPosts() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { localStorage.setItem(KEY, JSON.stringify(DEFAULTS)); return DEFAULTS.slice(); }
      return JSON.parse(raw);
    } catch (e) { return DEFAULTS.slice(); }
  }
  function savePosts(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
  function addPost(p) { const list = getPosts(); p.id = 'b' + Date.now(); list.unshift(p); savePosts(list); return p; }
  function updatePost(id, data) { const list = getPosts(); const i = list.findIndex(x => x.id === id); if (i > -1) { list[i] = { ...list[i], ...data }; savePosts(list); } }
  function deletePost(id) { savePosts(getPosts().filter(p => p.id !== id)); }

  window.KHBlog = { getPosts, savePosts, addPost, updatePost, deletePost };
})();
