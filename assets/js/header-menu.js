/**
 * モバイルハンバーガーメニュー制御
 * デスクトップ（768px超）では動作しない
 */

(function() {
  'use strict';

  // DOM要素の取得
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const eventsToggle = document.getElementById('events-toggle');
  const eventsSubmenu = document.getElementById('events-submenu');

  // メニューを開く
  function openDrawer() {
    drawer.classList.add('is-open');
    hamburgerBtn.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // スクロール無効化
    hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');
  }

  // メニューを閉じる
  function closeDrawer() {
    drawer.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-active');
    document.body.style.overflow = ''; // スクロール有効化
    hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
  }

  // Eventsサブメニューのトグル
  function toggleEventsSubmenu() {
    eventsToggle.classList.toggle('is-active');
    eventsSubmenu.classList.toggle('is-open');
  }

  // イベントリスナーの設定
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function() {
      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  if (eventsToggle) {
    eventsToggle.addEventListener('click', toggleEventsSubmenu);
  }

  // ESCキーでメニューを閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // ウィンドウリサイズ時にデスクトップサイズならメニューを閉じる
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    }, 250);
  });

  // ドロワー内のリンクをクリックしたらメニューを閉じる
  const drawerLinks = drawer.querySelectorAll('.drawer-link[href], .drawer-sublink[href]');
  drawerLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeDrawer();
    });
  });

})();