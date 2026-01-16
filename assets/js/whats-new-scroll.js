/**
 * What's New セクション - スクロール連動背景拡大アニメーション
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // デバッグ用ログ
  console.log('What\'s New スクロールアニメーション: 初期化開始');

  // Intersection Observer で要素が表示されたかを検知
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.8 // 20%表示されたら発火
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        console.log('What\'s New セクションが表示されました');
        
        // What's New セクションが表示されたら背景を拡大
        const bgElements = entry.target.querySelectorAll('.expanding-bg');
        console.log('背景要素の数:', bgElements.length);
        
        bgElements.forEach(function(bg, index) {
          bg.classList.add('is-visible');
          console.log('背景', index + 1, 'に is-visible クラスを追加');
        });
        
        // 一度表示したら監視を解除（リピートしない）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // What's New セクションを監視開始
  const whatsNewSection = document.querySelector('.whats-new-section');
  if (whatsNewSection) {
    console.log('What\'s New セクションを検出しました');
    observer.observe(whatsNewSection);
  } else {
    console.error('What\'s New セクションが見つかりませんでした');
  }

});