(() => {
  'use strict';
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMsg');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginMsg.textContent = 'Logged in! (demo only — connect your backend to enable real accounts)';
      loginMsg.style.color = 'var(--green-dark, #4a6b3a)';
    });
  }

  const registerForm = document.getElementById('registerForm');
  const registerMsg = document.getElementById('registerMsg');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      registerMsg.textContent = 'Account created! (demo only — connect your backend to enable real accounts)';
      registerMsg.style.color = 'var(--green-dark, #4a6b3a)';
    });
  }
})();
