/*=====================================================================
  ShuffleText カスタマイズ（モダン ES6+ 版）

  .shuffle クラスを持つ要素にシャッフルエフェクトを適用します。
  - ページ読み込み時に自動再生
  - マウスホバー時に再生
=====================================================================*/

/**
 * シャッフルエフェクトを初期化
 */
const initShuffleEffects = () => {
  const elements = document.querySelectorAll(".shuffle");
  if (elements.length === 0) return;

  // 各要素に ShuffleText インスタンスを紐付け
  const effects = [...elements].map((element) => {
    const effect = new ShuffleText(element);

    // マウスイベントでエフェクトを再生
    element.addEventListener("mouseenter", () => effect.start());
    element.addEventListener("mouseleave", () => effect.start());

    return effect;
  });

  // 初回再生（順番にスタートさせるために少し遅延）
  effects.forEach((effect, index) => {
    setTimeout(() => effect.start(), index * 100);
  });
};

// DOM 読み込み完了後に初期化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShuffleEffects);
} else {
  initShuffleEffects();
}
