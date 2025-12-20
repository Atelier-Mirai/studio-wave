# ROADMAP (studio-wave)

## 目的

`studio-wave` を **HTML / CSS / JavaScript すべて「モダンな形」** にリライトするための作業計画（ロードマップ）です。

- **完成像**
  - HTML は構造が分かりやすく、クラス/IDは **kebab-case**
  - CSS は `stylesheets/master.css` を入口に、**CSS Layers + nested CSS + 論理プロパティ + range query** などを使って整理
  - JavaScript は `javascripts/app.js` を入口にした **ES Modules 構成**（機能ごとに分割して `import`）
  - 既存の古い実装（jQuery前提、ベンダープリフィックス、巨大CSS等）を整理し、コメントは初心者にも読める密度にする

参照: `docs/refactoring-notes.md`

## スコープ

- **対象**
  - `studio-wave/` 直下の HTML / CSS / JavaScript（これが最終的な完成形）
- **対象外**
  - `work*` ディレクトリ（学習用のステップ教材）

※ `work*` は、挙動・実装の変遷を確認するための参照として見ることはありますが、このロードマップの「改修対象」には含めません。

---

## 調査結果（2025-12-17 時点）

### JavaScript: どのページで何が読まれているか

現状はページごとに `defer` で複数ファイルを読み込む構成。

- `index.html`
  - `javascripts/hero-slideshow.js`
  - `javascripts/glow-text.js`
  - `javascripts/page-top.js`

（参考）`work*` ディレクトリでも同様の JavaScript を読み込んでいますが、学習用のため改修対象外です。

- 多くのページ（例: `about.html`, `blog.html`, `contact.html`, `post01.html`, `post02.html`, `success.html`）
  - `javascripts/page-top.js`

- `about.html`, `contact.html`
  - `micromodal` を CDN から読み込み（`MicroModal` が `window` に生える前提）
  - `javascripts/modal.js`

- `post02.html`
  - `javascripts/tabular.js`

- `zoo-sea.html`
  - Swiper を CDN から読み込み（`Swiper` が `window` に生える前提）
  - `javascripts/swiper-custom.js`
  - `javascripts/page-top.js`

#### 参考: Muuri の保守状況

- `muuri/index.html` ではドラッグ＆ソートレイアウトに [Muuri](https://muuri.dev/) v0.9.5 を使用中。
- GitHub 公式リポジトリの最新安定リリースは **2021-07-09 公開の v0.9.5** で、それ以降は新しいタグが出ておらず、積極的なメンテナンスは停止状態と見られる。
- 新機能追加やブラウザ仕様変更への追随は期待しにくいため、今後も使い続ける場合は以下を想定しておく。
  - 自前でフォークしてバグ修正・調整ができる体制を用意する。
  - 代替ライブラリ（Shuffle.js、Gridstack、Sortable + Masonry 等）の調査を並行して進める。
  - 重要な画面では E2E/UI テストを用意し、将来のブラウザアップデートによる破綻を早期に検知する。

### JavaScript: 各ファイルがやっていること（概要）

- `javascripts/hero-slideshow.js`
  - `window.load` で `.hero` を取得し、`HERO_IMAGES` 配列の画像を `img` として DOM 生成
  - 1枚目だけ最初から `src` を入れて表示し、2枚目以降は `data-src` で遅延ロード
  - `setInterval` で `is-active` を付け替えてスライドショーを実現

- `javascripts/glow-text.js`
  - `window.load` で `.glow.text` のテキストを 1 文字ずつ `span` に分割し、`animation-delay` を inline style で付与
  - `addShineClassName()` により、スクロール位置に応じて `.shine` を付け外し

- `javascripts/page-top.js`
  - スクロール量に応じて `#page_top` のクラス（`upward` / `downward`）と、`.site-header` の `is-visible` を付け外し

- `javascripts/modal.js`
  - `DOMContentLoaded` で `MicroModal` が存在する場合のみ `MicroModal.init()`

- `javascripts/tabular.js`
  - `.tab.menu li a` のクリックで `event.preventDefault()`
  - `href` の `#id` に対応する「タブ見出し」と「タブ内容」へ `active` を付け替え
  - `window.load` で URL の `location.hash` を見て初期表示を切り替え

- `javascripts/swiper-custom.js`
  - Swiper v11 を前提とした設定で `new Swiper('.swiper', SWIPER_CONFIG)`
  - `DOMContentLoaded` 相当で初期化（`document.readyState` を見て分岐）

### include: 部分テンプレート読み込み

- `include.js`
  - `include("navigation")` のように呼ぶ前提
  - `fetch(_navigation.html)` を取得し、`id="navigation"` の要素を `outerHTML` で差し替え
  - `../` 参照にも対応

注意: `fetch()` と ES Modules は **`file://` 直開き**だと制限（CORS 等）で動かないことがあるため、モダン化するほど **ローカルサーバ前提**になりやすい。

---

## 方針（このプロジェクトの「モダン」の定義）

### JavaScript

- `javascripts/app.js` を **唯一の入口**にする
- 機能ごとに `javascripts/features/*.js`（または同階層）へ分割
- 各機能は `export function initXxx()` を提供し、入口がそれを呼ぶ
- どのページでも `app.js` を読み込んで良いように、各 `initXxx()` は
  - 対象要素が存在しなければ **何もしない（no-op）**
  - 依存ライブラリ（MicroModal / Swiper）が無ければ **何もしない**
    を徹底する

- `contact.html` のフォームバリデーションは `initContactForm()` で扱う
  - 入口（`app.js`）では **静的 import** する（案A）
  - `contact.html` 以外ではフォーム要素が存在しないため **no-op** で終了する

### CSS

- `stylesheets/master.css` を入口に
  - `@acab/reset.css` を **layer(reset)** で読み込む
  - base/layout/components/utilities のレイヤ設計を維持しつつ整理
- 色は `_wa-no-iro.css` を参照し、`:_root` に設計トークンとして定義する

### HTML

- クラス/ID を kebab-case に統一
- JS は inline を廃止し、`type="module"` の入口（`javascripts/app.js`）へ集約
- Font Awesome は v7.1.0 を使用し、X アイコンへ移行

---

## ロードマップ（段階的に進める）

### Phase 0: ベースライン整備（動作確認の土台）

- ローカルサーバで閲覧できる状態を用意（ESM + fetch のため）
- 対象ページ範囲を決める（`studio-wave/` 直下の主要ページ）

成果物:

- 「どのページを今回の対象にするか」の確定

### Phase 1: JavaScript を ES Modules 入口方式へ

- `javascripts/app.js` を作成
- 既存 JS を **機能別の `init...()`** にリライト
  - `initHeroSlideshow()`
  - `initGlowText()`
  - `initPageTop()`
  - `initModal()`
  - `initTabular()`
  - `initSwiper()`
  - `initContactForm()`
- HTML の `<script ... defer>` を基本 1 本へ（`type="module"`）
  - MicroModal / Swiper を CDN のまま残す場合は読み込み順を注意（ライブラリ → app.js）

成果物:

- `javascripts/app.js`（入口）
- `javascripts/features/*`（機能モジュール群）
- 対象 HTML の script タグの統一

### Phase 2: HTML のモダン化（構造・命名・共通化）

- `index.html` / `content.html` を中心に、クラス/ID を kebab-case に統一
- `include.js` を今後どうするか決める
  - そのまま使う（ただし module 化）
  - もしくはビルド/テンプレート導入（要検討）

成果物:

- HTML の命名規約統一
- 共通ヘッダー/フッターの扱い方針の確定

### Phase 3: CSS の整理（layers / modules / tokens）

- `reset.css` を `@acab/reset.css` へ置換
- `_wa-no-iro.css` から色を選び、root 変数へ整理
- ベンダープリフィックス除去
- モバイルナビの表示・幅などの不具合修正（要件に含まれる）

成果物:

- `stylesheets/master.css` の import/layer 構造が意図通りに整理されている
- 主要コンポーネントCSSが役割ごとに分割されている

### Phase 4: アセット整理（画像・アイコン）

- `img/` → `images/` へのリネーム（存在する場合）
- 画像ファイル名の kebab-case 化
- Font Awesome v7.1.0 へ統一
- Twitter → X アイコンへ移行

成果物:

- 画像パス/ファイル名が規約に統一
- SNS アイコンの更新が完了

---

## 受け入れ条件（Done の定義）

- 対象ページがローカルサーバ上でエラーなく表示できる
- JS は `javascripts/app.js`（ES Modules）に集約され、機能別に分割されている
- CSS は `stylesheets/master.css` を入口に layers で整理されている
- クラス/ID は kebab-case、JS 変数は camelCase
- Font Awesome v7.1.0 / X アイコンが反映されている
