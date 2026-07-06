(function () {
  'use strict';

  function initHeaderMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('mobile-drawer');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const eventsToggle = document.getElementById('events-toggle');
    const eventsSubmenu = document.getElementById('events-submenu');

    if (!hamburgerBtn || !drawer) {
      return;
    }

    if (hamburgerBtn.dataset.headerMenuInitialized === 'true') {
      return;
    }

    hamburgerBtn.dataset.headerMenuInitialized = 'true';

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');

      hamburgerBtn.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');

      document.documentElement.classList.add('is-menu-open');
      document.body.classList.add('is-menu-open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');

      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'メニューを開く');

      document.documentElement.classList.remove('is-menu-open');
      document.body.classList.remove('is-menu-open');
      document.body.style.overflow = '';

      if (eventsToggle && eventsSubmenu) {
        eventsToggle.classList.remove('is-active');
        eventsToggle.setAttribute('aria-expanded', 'false');
        eventsSubmenu.classList.remove('is-open');
      }
    }

    function toggleDrawer(event) {
      event.preventDefault();
      event.stopPropagation();

      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    hamburgerBtn.addEventListener('click', toggleDrawer);

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', function (event) {
        event.preventDefault();
        closeDrawer();
      });
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', function (event) {
        event.preventDefault();
        closeDrawer();
      });
    }

    if (eventsToggle && eventsSubmenu) {
      eventsToggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = eventsSubmenu.classList.toggle('is-open');
        eventsToggle.classList.toggle('is-active', isOpen);
        eventsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    drawer.querySelectorAll('.drawer-link[href], .drawer-sublink[href]').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderMenu);
  } else {
    initHeaderMenu();
  }
})();