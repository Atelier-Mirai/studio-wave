// モバイルナビゲーションの開閉を担当するモジュール。
//
// 仕様の概要：
// - HTML側の `.nav-btn`（ボタン）と `.nav`（メニュー）に依存します。
// - CSS側は `html.is-nav-open` の有無で表示を切り替えます。
// - 背景スクロール抑止は `body.is-scroll-locked` の有無で制御します。

export const initMobileNav = () => {
  // `html` 要素：メニューの開閉状態をクラスで持たせます。
  const root = document.documentElement;

  // `body` 要素：メニュー表示中はスクロールを止めます。
  const body = document.body;

  // 開閉トリガーとなるボタン。
  const navButton = document.querySelector(".nav-btn");

  // ナビボタンがないページでは処理しません。
  if (!(navButton instanceof HTMLButtonElement)) return;

  // メニュー本体（全面オーバーレイ）。
  const nav = document.querySelector(".nav");

  // 実メニュー（ul）：クリック判定に使います（存在しない場合もあるので optional）。
  const navList = nav?.querySelector("ul");

  // `html` に付くクラス：メニューが開いている状態。
  const openClass = "is-nav-open";

  // `body` に付くクラス：背景スクロールを止める状態。
  const scrollLockClass = "is-scroll-locked";

  // 開閉状態をDOMへ反映（CSS側の表示制御・スクロール固定・ARIA状態の更新）。
  const setOpen = (isOpen) => {
    // CSSの表示切り替え用（例: `.nav` を表示する）。
    root.classList.toggle(openClass, isOpen);

    // 背景がスクロールしないように固定します。
    body.classList.toggle(scrollLockClass, isOpen);

    // 支援技術向け：ボタンが「開いている状態か」を aria-expanded で伝えます。
    navButton.setAttribute("aria-expanded", String(isOpen));
  };

  // ボタンクリックで開閉します。
  navButton.addEventListener("click", () => {
    // 現在の状態を見て反転させます（開→閉 / 閉→開）。
    setOpen(!root.classList.contains(openClass));
  });

  // Escape キーで閉じます。
  document.addEventListener("keydown", (event) => {
    // Escape キー以外は無視します。
    if (event.key !== "Escape") return;

    // すでに閉じている場合は何もしません。
    if (!root.classList.contains(openClass)) return;

    // 開いている時だけ閉じます。
    setOpen(false);
  });

  // メニューが開いている時のクリック挙動：
  // - メニューリンクのクリック：閉じる
  // - オーバーレイ（メニュー外）のクリック：閉じる
  document.addEventListener("click", (event) => {
    // メニューが閉じている時は判定不要です。
    if (!root.classList.contains(openClass)) return;

    // クリックされた要素を取得します。
    const target = event.target;

    // `event.target` は Element 以外の可能性もあるので型ガードします。
    if (!(target instanceof Element)) return;

    // ナビボタンのクリックは、ボタンの click ハンドラに任せます。
    const clickedButton = navButton.contains(target);
    if (clickedButton) return;

    // メニュー内リンクをクリックしたら閉じます。
    const clickedNavLink = Boolean(target.closest(".nav a"));
    if (clickedNavLink) {
      setOpen(false);
      return;
    }

    // `.nav` は全面固定オーバーレイなので、実メニュー（ul）内かどうかで判定します。
    const clickedInNavList = navList ? navList.contains(target) : false;

    // メニュー外（背景）をクリックしたら閉じます。
    if (!clickedInNavList) {
      setOpen(false);
    }
  });
};
