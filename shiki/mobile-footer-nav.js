/*=====================================================================
  固定フッター（makuranosoushi 用）

  200px以上のスクロールで activeクラスを付与し、
  iPhone 用の固定フッターメニューを表示する。
=====================================================================*/

(() => {
  "use strict";

  // 発動要件となるスクロール量
  const TRIGGER_POSITION = 200;

  // ページ全体とメインコンテナの両方からスクロール量を取得
  const getScrollAmount = () => {
    const windowScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const main = document.querySelector(".parallax-wrapper");
    const mainScroll = main ? main.scrollTop : 0;

    return Math.max(windowScroll, mainScroll);
  };

  // スクロール量に応じて固定フッターの表示／非表示を切り替える
  const updateFixedFooter = () => {
    const footer = document.getElementById("mobile-footer-nav");
    if (!footer) return;

    const scroll = getScrollAmount();
    footer.classList.toggle("active", scroll > TRIGGER_POSITION);
  };

  const setup = () => {
    // 初期状態を反映
    updateFixedFooter();

    // 画面スクロールに反応
    window.addEventListener("scroll", updateFixedFooter, { passive: true });

    // メインコンテナ内のスクロールにも反応させる
    const main = document.querySelector(".parallax-wrapper");
    if (main) {
      main.addEventListener("scroll", updateFixedFooter, { passive: true });
    }
  };

  window.addEventListener("load", setup);
})();
