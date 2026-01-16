document.addEventListener('DOMContentLoaded', () => {
  // ヘッダーのスクロール制御
  const header = document.querySelector('.hero-badge');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (header) {
      if (currentScroll < lastScrollTop) {
        header.classList.add('fixed-header-show');
        header.classList.remove('fixed-header-hide');
      } else {
        header.classList.remove('fixed-header-show');
        header.classList.add('fixed-header-hide');
      }
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
});

// About詳細の表示/非表示を切り替える
function toggleAboutDetail() {
  const el = document.getElementById("aboutus-detail-text");
  if (el) {
    el.classList.toggle("open");
  }
}
