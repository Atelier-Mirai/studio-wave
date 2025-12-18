/*=====================================================================
  Swiper スライドショー（モダン ES6+ 版）

  Swiper v11.x 対応
  https://swiperjs.com/
=====================================================================*/

/**
 * Swiper 設定
 */
const SWIPER_CONFIG = {
  // 基本設定
  loop: true,
  grabCursor: true,
  keyboard: {
    enabled: true,
  },

  // 自動再生
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  // ページネーション（ドットインジケーター）
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // ナビゲーション矢印
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // アクセシビリティ
  a11y: {
    prevSlideMessage: "前のスライド",
    nextSlideMessage: "次のスライド",
  },

  // レスポンシブブレークポイント
  breakpoints: {
    // モバイル (480px以上)
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // タブレット (768px以上)
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    // デスクトップ (1024px以上)
    1024: {
      slidesPerView: 5,
      spaceBetween: 50,
    },
  },
};

/**
 * Swiper を初期化
 */
const initSwiper = () => {
  const swiperContainer = document.querySelector(".swiper");
  if (!swiperContainer) return null;

  return new Swiper(".swiper", SWIPER_CONFIG);
};

// DOM 読み込み完了後に初期化
let swiperInstance = null;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    swiperInstance = initSwiper();
  });
} else {
  swiperInstance = initSwiper();
}
