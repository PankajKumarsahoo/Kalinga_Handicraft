(() => {
  'use strict';
  const KEY = 'kh_products';

  const DEFAULTS = [
    {id:'p1', name:'Pattachitra Folk Painting', price:1499, category:'Folk Paintings', type:'art', image:'images/folk-paintings.jpg'},
    {id:'p2', name:'Hand-Painted Wall Art Panel', price:1899, category:'Wall Art', type:'art', image:'images/wall-art.jpg'},
    {id:'p3', name:'Carved Wooden Art Piece', price:2199, category:'Wooden Art', type:'art', image:'images/wooden-art.jpg'},
    {id:'p4', name:'Terracotta Handmade Decor Set', price:899, category:'Handmade Decor', type:'craft', image:'images/handmade-decor.jpg'},
    {id:'p5', name:'Handwoven Ikat Textile', price:1299, category:'Textiles', type:'craft', image:'images/textiles.jpg'},
    {id:'p6', name:'Blue Pottery Vase', price:1099, category:'Pottery & Ceramics', type:'craft', image:'images/pottery-ceramics.jpg'},
    {id:'p7', name:'Tribal Silver Jewellery Set', price:1799, category:'Jewellery', type:'craft', image:'images/jewellery.jpg'},
    {id:'p8', name:'Golden Straw Craft Basket', price:699, category:'Straw Crafts', type:'craft', image:'images/Straw Crafts.jpg'},
    {id:'p9', name:'Jute Tote Bag', price:499, category:'Jute Products & Bags', type:'craft', image:'images/jute.jpg'},
    {id:'p10', name:'Palm Leaf Wall Hanging', price:799, category:'Palm Leaf Crafts', type:'craft', image:'images/palm-leaf-crafts.jpg'},
    {id:'p11', name:'Bamboo & Cane Fruit Basket', price:649, category:'Bamboo & Cane Crafts', type:'craft', image:'images/Bamboo & Cane Crafts  .jpg'},
    {id:'p12', name:'Curated Gift Hamper', price:1199, category:'Gift Items', type:'craft', image:'images/Gift Items.jpg'},
    {id:'p13', name:'Handcrafted Memento Award', price:549, category:'Mementos & Awards', type:'craft', image:'images/Mementos Awards.jpg'},
    {id:'p14', name:'Rustic Home Décor Set', price:999, category:'Home Décor', type:'craft', image:'images/home-decor.jpg'},
    {id:'p15', name:'Custom Engraved Keepsake', price:1399, category:'Custom Products', type:'craft', image:'images/Custom Products.jpg'}
  ];

  const CATEGORIES = [...new Set(DEFAULTS.map(p => p.category))];

  function getProducts() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { localStorage.setItem(KEY, JSON.stringify(DEFAULTS)); return DEFAULTS.slice(); }
      return JSON.parse(raw);
    } catch (e) { return DEFAULTS.slice(); }
  }
  function saveProducts(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
  function addProduct(p) { const list = getProducts(); p.id = 'p' + Date.now(); list.push(p); saveProducts(list); return p; }
  function updateProduct(id, data) { const list = getProducts(); const i = list.findIndex(x => x.id === id); if (i > -1) { list[i] = { ...list[i], ...data }; saveProducts(list); } }
  function deleteProduct(id) { saveProducts(getProducts().filter(p => p.id !== id)); }
  function resetProducts() { saveProducts(DEFAULTS.slice()); }

  window.KHStore = { getProducts, saveProducts, addProduct, updateProduct, deleteProduct, resetProducts, CATEGORIES };
})();
