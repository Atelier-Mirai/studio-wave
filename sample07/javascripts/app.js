// javascripts/app.js は、このサイトの JavaScript の「入口」になるファイルです。
// HTML からはこの 1 ファイルだけを読み込み、必要な機能（モジュール）を import して初期化します。
//
// CSS の master.css が複数の CSS を @import で取り込むのと同じ発想で、JS も機能ごとに分割します。

import { initMobileNav } from "./nav.js";
import { initContactForm } from "./contact-form.js";

// ナビゲーション（モバイル）の開閉を初期化します。
initMobileNav();

// お問い合わせフォームの送信ボタン制御・疑似送信を初期化します。
initContactForm();
