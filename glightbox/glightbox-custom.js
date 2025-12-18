/*=====================================================================
  GLightbox 設定用（モダン ES6+ 版）

  各ギャラリータイプごとにセレクタと設定をまとめて定義し、
  DOMContentLoaded 後に一括初期化します。
=====================================================================*/

/**
 * ギャラリー設定の定義
 * @type {Array<{selector: string, options?: object}>}
 */
const galleryConfigs = [
  {
    selector: ".glightbox",
    options: {
      touchNavigation: true,
      loop: true,
    },
  },
  {
    selector: ".glightbox-with-description",
    options: {
      touchNavigation: true,
      loop: true,
    },
  },
  {
    selector: ".glightbox-videos-gallery",
    options: {
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
    },
  },
  {
    selector: ".glightbox-inline",
    options: {
      touchNavigation: true,
    },
  },
];

/**
 * 全ギャラリーを初期化
 */
const initGalleries = () => {
  galleryConfigs.forEach(({ selector, options = {} }) => {
    // 対象要素が存在する場合のみ初期化
    if (document.querySelector(selector)) {
      GLightbox({ selector, ...options });
    }
  });
};

// DOM 読み込み完了後に初期化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGalleries);
} else {
  initGalleries();
}
