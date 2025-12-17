// お問い合わせフォームの挙動（送信ボタンの有効/無効、疑似送信）を担当するモジュール。
//
// 仕様の概要：
// - `.contact-form` の制約検証（required など）に合わせて submit ボタンを disabled にします。
// - 送信時は実際の送信を行わず、入力が有効なら `thanks.html` へ遷移します（サンプル用）。

export const initContactForm = () => {
  // 対象フォームを取得します。
  const contactForm = document.querySelector(".contact-form");

  // フォームが存在しないページでは処理しません。
  if (!(contactForm instanceof HTMLFormElement)) return;

  // 送信ボタンを取得します。
  const submitButton = contactForm.querySelector('button[type="submit"]');

  // 万一ボタンが取れない場合は処理しません（安全のため）。
  if (!(submitButton instanceof HTMLButtonElement)) return;

  // HTMLの制約検証（required など）の結果に応じて、送信ボタンの状態を同期します。
  // - checkValidity(): 入力が有効なら true / 無効なら false
  const syncSubmitState = () => {
    submitButton.disabled = !contactForm.checkValidity();
  };

  // 初期表示時にもボタン状態を正しくしておきます。
  syncSubmitState();

  // 入力中に状態が変わるので、入力イベント（input / change）のたびに同期します。
  contactForm.addEventListener("input", syncSubmitState);
  contactForm.addEventListener("change", syncSubmitState);

  contactForm.addEventListener("submit", (event) => {
    // ブラウザのデフォルト送信（ページ遷移）を止め、ここで挙動を制御します。
    event.preventDefault();

    // 入力が無効なら、ブラウザ標準のエラーメッセージを表示して終了します。
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      syncSubmitState();
      return;
    }

    // 入力が有効なら、送信成功とみなしてサンクスページへ遷移します。
    window.location.href = "thanks.html";
  });
};
