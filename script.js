(() => {
  'use strict';

  /* =========================================================
     Toast helper
  ========================================================= */

  const toastEl = document.getElementById('toast');
  let toastTimer;

  function showToast(msg) {
    if (!toastEl) return;

    clearTimeout(toastTimer);

    toastEl.textContent = msg;
    toastEl.classList.add('show');

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2400);
  }


  /* =========================================================
     Sticky header shadow
  ========================================================= */

  const header = document.getElementById('siteHeader');

  if (header) {
    const onScroll = () => {
      header.classList.toggle(
        'scrolled',
        window.scrollY > 8
      );
    };

    document.addEventListener(
      'scroll',
      onScroll,
      { passive: true }
    );

    onScroll();
  }


  /* =========================================================
     Mobile Navigation
  ========================================================= */

  const hamburger =
    document.getElementById('hamburger');

  const mainNav =
    document.getElementById('mainNav');

  if (hamburger && mainNav) {

    hamburger.addEventListener(
      'click',
      () => {

        const open =
          mainNav.classList.toggle('open');

        hamburger.setAttribute(
          'aria-expanded',
          String(open)
        );

        hamburger.setAttribute(
          'aria-label',
          open ? 'Close menu' : 'Open menu'
        );

      }
    );


    mainNav
      .querySelectorAll('a')
      .forEach((a) => {

        a.addEventListener(
          'click',
          () => {

            mainNav.classList.remove('open');

            hamburger.setAttribute(
              'aria-expanded',
              'false'
            );

            hamburger.setAttribute(
              'aria-label',
              'Open menu'
            );

          }
        );

      });

  }


  /* =========================================================
     Search Panel
  ========================================================= */

  const searchToggle =
    document.getElementById('searchToggle');

  const searchPanel =
    document.getElementById('searchPanel');

  if (searchToggle && searchPanel) {

    searchToggle.addEventListener(
      'click',
      () => {

        const open =
          searchPanel.classList.toggle('open');

        searchToggle.setAttribute(
          'aria-expanded',
          String(open)
        );

        if (open) {

          const input =
            searchPanel.querySelector('input');

          if (input) {
            input.focus();
          }

        }

      }
    );

  }


  /* =========================================================
     Search Form
  ========================================================= */

  const searchForm =
    document.getElementById('searchForm');

  if (searchForm) {

    searchForm.addEventListener(
      'submit',
      (e) => {

        e.preventDefault();

        const input =
          e.target.querySelector('input');

        const q =
          input ? input.value.trim() : '';

        showToast(
          q
            ? `Searching for "${q}"...`
            : 'Type something to search'
        );

      }
    );

  }


  /* =========================================================
     HOME PAGE AUTOMATIC BANNER SLIDER
     
     Banner files:
       images/banner-1.jpg
       images/banner-2.jpg
       images/banner-3.jpg

     Automatically changes every 5 seconds.
  ========================================================= */

  const heroSlides =
    document.querySelectorAll('.hero-slide');

  const heroDots =
    document.querySelectorAll('.hero-dot');

  const heroPrev =
    document.querySelector('.hero-prev');

  const heroNext =
    document.querySelector('.hero-next');

  let currentHeroSlide = 0;

  let heroTimer = null;


  /* ---------------------------------------------------------
     Show selected banner
  --------------------------------------------------------- */

  function showHeroSlide(index) {

    if (!heroSlides.length) {
      return;
    }


    /* Loop back to first banner */

    if (index >= heroSlides.length) {
      index = 0;
    }


    /* Loop back to last banner */

    if (index < 0) {
      index = heroSlides.length - 1;
    }


    currentHeroSlide = index;


    /* Update banners */

    heroSlides.forEach(
      (slide, slideIndex) => {

        slide.classList.toggle(
          'active',
          slideIndex === currentHeroSlide
        );

      }
    );


    /* Update dots */

    heroDots.forEach(
      (dot, dotIndex) => {

        const active =
          dotIndex === currentHeroSlide;

        dot.classList.toggle(
          'active',
          active
        );

        dot.setAttribute(
          'aria-current',
          active ? 'true' : 'false'
        );

      }
    );

  }


  /* ---------------------------------------------------------
     Next Banner
  --------------------------------------------------------- */

  function nextHeroSlide() {

    showHeroSlide(
      currentHeroSlide + 1
    );

  }


  /* ---------------------------------------------------------
     Previous Banner
  --------------------------------------------------------- */

  function previousHeroSlide() {

    showHeroSlide(
      currentHeroSlide - 1
    );

  }


  /* ---------------------------------------------------------
     Start Automatic Slider
  --------------------------------------------------------- */

  function startHeroSlider() {

    if (heroSlides.length <= 1) {
      return;
    }

    clearInterval(heroTimer);

    heroTimer = setInterval(
      () => {

        nextHeroSlide();

      },
      5000
    );

  }


  /* ---------------------------------------------------------
     Next Button
  --------------------------------------------------------- */

  if (heroNext) {

    heroNext.addEventListener(
      'click',
      () => {

        nextHeroSlide();

        startHeroSlider();

      }
    );

  }


  /* ---------------------------------------------------------
     Previous Button
  --------------------------------------------------------- */

  if (heroPrev) {

    heroPrev.addEventListener(
      'click',
      () => {

        previousHeroSlide();

        startHeroSlider();

      }
    );

  }


  /* ---------------------------------------------------------
     Banner Dots
  --------------------------------------------------------- */

  heroDots.forEach(
    (dot, index) => {

      dot.addEventListener(
        'click',
        () => {

          showHeroSlide(index);

          startHeroSlider();

        }
      );

    }
  );


  /* ---------------------------------------------------------
     Start Slider
  --------------------------------------------------------- */

  if (heroSlides.length) {

    showHeroSlide(0);

    startHeroSlider();

  }


  /* =========================================================
     Pause Slider on Mouse Hover
  ========================================================= */

  const heroBanner =
    document.getElementById('home');

  if (heroBanner) {

    heroBanner.addEventListener(
      'mouseenter',
      () => {

        clearInterval(heroTimer);

      }
    );


    heroBanner.addEventListener(
      'mouseleave',
      () => {

        startHeroSlider();

      }
    );

  }


  /* =========================================================
     Touch / Swipe Support
  ========================================================= */

  if (heroBanner) {

    let touchStartX = 0;
    let touchEndX = 0;


    heroBanner.addEventListener(
      'touchstart',
      (e) => {

        if (!e.changedTouches.length) {
          return;
        }

        touchStartX =
          e.changedTouches[0].clientX;

      },
      {
        passive: true
      }
    );


    heroBanner.addEventListener(
      'touchend',
      (e) => {

        if (!e.changedTouches.length) {
          return;
        }

        touchEndX =
          e.changedTouches[0].clientX;

        const difference =
          touchStartX - touchEndX;


        /* Swipe left */

        if (difference > 50) {

          nextHeroSlide();

          startHeroSlider();

        }


        /* Swipe right */

        if (difference < -50) {

          previousHeroSlide();

          startHeroSlider();

        }

      },
      {
        passive: true
      }
    );

  }


  /* =========================================================
     Category / Product Cards
  ========================================================= */

  const categoryGrid =
    document.getElementById(
      'categoryGrid'
    );

  if (categoryGrid) {

    categoryGrid.addEventListener(
      'click',
      (e) => {

        const card =
          e.target.closest(
            '.category-card'
          );

        if (!card) {
          return;
        }

        const name =
          card
            .querySelector('h3')
            ?.textContent
            ?.trim();

        if (name) {

          showToast(
            `Browsing "${name}"...`
          );

        }

      }
    );

  }


  /* =========================================================
     Interactive Card Glow
  ========================================================= */

  document
    .querySelectorAll('.fx-card')
    .forEach((card) => {

      card.addEventListener(
        'pointermove',
        (e) => {

          const rect =
            card.getBoundingClientRect();

          if (!rect.width || !rect.height) {
            return;
          }

          const x =
            ((e.clientX - rect.left) /
              rect.width) * 100;

          const y =
            ((e.clientY - rect.top) /
              rect.height) * 100;

          card.style.setProperty(
            '--mx',
            `${x}%`
          );

          card.style.setProperty(
            '--my',
            `${y}%`
          );

        }
      );

    });


  /* =========================================================
     Cart Demo Counter
  ========================================================= */

  const cartCount =
    document.getElementById(
      'cartCount'
    );

  const cartBtn =
    document.getElementById(
      'cartBtn'
    );

  if (cartCount && cartBtn) {

    let count = 0;

    cartBtn.addEventListener(
      'click',
      () => {

        count++;

        cartCount.textContent =
          count;

        cartCount.classList.remove(
          'bump'
        );

        void cartCount.offsetWidth;

        cartCount.classList.add(
          'bump'
        );

        cartBtn.setAttribute(
          'aria-label',
          `Cart, ${count} item${
            count === 1 ? '' : 's'
          }`
        );

        showToast(
          'Cart updated'
        );

      }
    );

  }


  /* =========================================================
     Newsletter
  ========================================================= */

  const newsletterForm =
    document.getElementById(
      'newsletterForm'
    );

  const newsletterNote =
    document.getElementById(
      'newsletterNote'
    );

  if (
    newsletterForm &&
    newsletterNote
  ) {

    newsletterForm.addEventListener(
      'submit',
      (e) => {

        e.preventDefault();

        const input =
          newsletterForm.querySelector(
            'input'
          );

        if (!input) {
          return;
        }

        const email =
          input.value.trim();

        const valid =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);


        if (!valid) {

          newsletterNote.textContent =
            'Please enter a valid email address.';

          newsletterNote.style.color =
            '#E07856';

          return;

        }


        newsletterNote.textContent =
          `Thanks -- we'll write to ${email}.`;

        newsletterNote.style.color =
          'var(--gold)';

        input.value = '';

      }
    );

  }


  /* =========================================================
     Contact Form
  ========================================================= */

  const contactForm =
    document.getElementById(
      'contactForm'
    );

  if (contactForm) {

    contactForm.addEventListener(
      'submit',
      (e) => {

        e.preventDefault();

        showToast(
          'Message sent -- we will get back to you soon.'
        );

        contactForm.reset();

      }
    );

  }


  /* =========================================================
     Explore Collection
     
     Smooth scroll to categories
  ========================================================= */

  document
    .querySelectorAll(
      'a[href="#categories"]'
    )
    .forEach((btn) => {

      btn.addEventListener(
        'click',
        (e) => {

          const target =
            document.getElementById(
              'categories'
            );

          if (!target) {
            return;
          }

          e.preventDefault();

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

        }
      );

    });


  /* =========================================================
     Placeholder Buttons
  ========================================================= */

  document
    .querySelectorAll(
      '.btn-primary, .btn-outline'
    )
    .forEach((btn) => {

      btn.addEventListener(
        'click',
        (e) => {

          const href =
            btn.getAttribute('href');

          if (
            !href ||
            href === '#'
          ) {

            e.preventDefault();

          }

        }
      );

    });

})();