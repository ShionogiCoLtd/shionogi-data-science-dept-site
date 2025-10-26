document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.hero-badge');
  const banner = document.querySelector('.banner');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll < lastScrollTop) {
      header.classList.add('fixed-header-show');
      header.classList.remove('fixed-header-hide');
    } else {
      header.classList.remove('fixed-header-show');
      header.classList.add('fixed-header-hide');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

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

  // 削除: 古い showYear 関数は新しいタブ形式では不要
  // 新しい switchYear 関数は presentations.html 内で定義済み

});

// toggleAboutDetail は外側で定義してOK
function toggleAboutDetail() {
  const el = document.getElementById("aboutus-detail-text");
  if (el) {
    el.classList.toggle("open");
  }
}