  const header = document.querySelector('.hero-badge');
  const banner = document.querySelector('.banner');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // ナビバー表示制御：スクロール方向で切り替え
    if (currentScroll < lastScrollTop) {
      // 上にスクロール → 表示
      header.classList.add('fixed-header-show');
      header.classList.remove('fixed-header-hide');
    } else {
      // 下にスクロール → 非表示
      header.classList.remove('fixed-header-show');
      header.classList.add('fixed-header-hide');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

    // バナー透明度制御（スクロール量で薄く）
    if (banner) {
      const opacity = 1 - window.scrollY / 1500;
      banner.style.opacity = Math.max(0, opacity);
    }
  });

  
  setTimeout(() => {
    const regText = document.querySelector('.reg-text');
    const letters = document.querySelectorAll('.letter');

    if (regText) {
      regText.classList.add('loaded');
    }

    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('loaded');
      }, index * 50); 
    });
  }, 800);

  
  function showYear(target) {
    const allBlocks = document.querySelectorAll(".presentation-block");
    allBlocks.forEach((block) => {
      block.style.display = (target === "all" || block.id === `year-${target}`) ? "block" : "none";
    });
  }

  // 初期表示
  showYear("all");

  
  window.showYear = showYear;
});


function toggleAboutDetail() {
  const el = document.getElementById("aboutus-detail-text");
  el.classList.toggle("open");
}
