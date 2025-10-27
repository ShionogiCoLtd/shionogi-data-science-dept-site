
class FeaturedArticlesCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        
        if (!this.track) {
            console.log('Carousel track not found - skipping initialization');
            return;
        }
        
        console.log('Featured Articles Carousel: Initializing...');
        
        this.init();
    }
    
    init() {
        // レスポンシブ対応: 画面サイズによってスクロール速度を調整
        this.adjustScrollSpeed();
        
        // ウィンドウリサイズ時の調整
        window.addEventListener('resize', () => {
            this.adjustScrollSpeed();
        });
        
        console.log('Featured Articles Carousel: Initialized successfully');
    }
    
    adjustScrollSpeed() {
        if (!this.track) return;
        
        const width = window.innerWidth;
        let duration;
        
        if (width > 1024) {
            duration = '10s';  // デスクトップ: ゆっくり
        } else if (width > 768) {
            duration = '15s';  // タブレット: やや速く
        } else if (width > 480) {
            duration = '15s';  // スマホ（横向き）
        } else {
            duration = '10s';  // スマホ（縦向き）: 速く
        }
        
        this.track.style.animationDuration = duration;
        console.log(`Carousel speed adjusted to ${duration} for screen width ${width}px`);
    }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Featured Articles Carousel...');
    
    // 小さい遅延でCSSアニメーションとの競合を回避
    setTimeout(() => {
        new FeaturedArticlesCarousel();
    }, 100);
});