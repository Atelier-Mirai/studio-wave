/*=============================================================================
  モーダルウィンドウの初期化
=============================================================================*/

document.addEventListener("DOMContentLoaded", () => {
  if (typeof MicroModal !== "undefined") {
    MicroModal.init({
      disableScroll: true,
    });
  }
});
