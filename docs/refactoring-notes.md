# Refactoring Notes

## 1. 全般的な方針

- HTML / CSS / JavaScript をモダンな形でリファクタリングしてください。
- 対象環境は、最新〜過去 1〜2 年のモダンブラウザのみで OK です（古い環境のためのベンダープリフィックス等は不要）。
- HTML はセマンティクス（意味）を優先し、最低限のアクセシビリティを満たすようにしてください。
  - 可能な限り `header` / `nav` / `main` / `footer` などのセマンティック要素を用いる
  - 見出し（`h1`〜`h6`）のレベルを飛ばさない（`h2` の次が `h4` などにならないようにする）
  - アイコンだけのリンク（SNS 等）は `aria-label` などで意味が伝わるようにする
  - フォームは `label` と `for` の対応を基本とし、プレースホルダだけに頼らない

## 2. CSS

- CSS Nesting / range query / 論理プロパティ / `rgb(rr gg bb / aa%)` などモダンな記法を用いてください。
- CSS Nesting は、従来 `&` が必要だった書き方から、不要な `&` を省けるようになっています。
  - 例（古い記法）: `body { & h1 { color: red; } }`
  - 例（現在の仕様）: `body { h1 { color: red; } }`
- 色については、プロジェクト内の色見本ファイル（例: `stylesheets/_wa-no-iro.css`）から似ている色を探して、`:root` のカスタムプロパティとして定義してください。
- `reset.css` については、CSS Layers を用いて次の import に置き換えてください。
  - `@import url('https://cdn.jsdelivr.net/npm/@acab/reset.css@0.11.0/index.min.css') layer(reset);`
- CSS は、巨大な 1 ファイルに集約せず、機能ごと・部品ごとに分割し、入口となる `stylesheets/master.css` から `@import` するようにしてください（CSS Layers を用いて綺麗に整理してください）。
- CSS Layers のレイヤー順は、次のように揃えると破綻しにくくなります。
  - `reset` → `base` → `layout` → `components` → `utilities` → `overrides`
- ベンダープリフィックスは基本的に不要なので外してください（ここ 1〜2 年のモダンブラウザのみ対応で OK）。
- `!important` の多用は避けてください（どうしても必要な場合のみ、理由が分かる形で最小限にする）。
- `z-index: 9999;` などの場当たり的な積み増しが存在する場合は、可能であれば `popover` などモダンな機能を用いてください。
- レイアウトは `display: flex` ではなく（極力）`display: grid` で実装してください。
- `position: absolute` / `position: relative` は細かい装飾では使用しても良いですが、レイアウト調整の目的には（極力）`display: grid` を用いてください。
- :root のカスタムプロパティ（デザイントークン）は、色だけでなく次も定義すると統一しやすくなります。
  - 余白（spacing）
  - 文字サイズ
  - 角丸
  - シャドウ
  - `z-index` の段階（スケール）

## 3. JavaScript

- もし jQuery を前提として書かれていれば、バニラ JS で書き直してください。
- `vegas` については、既存のスライドショー実装（例: `javascripts/hero-slideshow.js`）を改良する形で置き換え可能です。
- JavaScript を整理する場合は、次の方針を推奨します。
  - `javascripts/app.js` を入口にする
  - 入口から各機能を **static import** する
  - 各機能は対象要素が存在しないページでは **no-op**（何もしない）で終了する
  - 例: `contact.html` にだけフォームバリデーションが必要な場合でも、`app.js` 側は静的 import のままにし、フォーム要素が存在するページでのみ有効化する
- JavaScript のフック（要素の取得）には、可能であれば `data-*` 属性を優先してください（CSS の見た目用クラスと、JS の動作用フックを分離する）。
- アニメーションや演出がある場合は、`prefers-reduced-motion` に配慮して無効化できるようにしてください。

## 4. クラス名 / ID / 命名

- CSS のクラス名、ID は kebab-case を使ってください。
- JavaScript の変数名は camelCase を使ってください。
- JavaScript で付与するクラス名も kebab-case に統一してください（例: `UpMove` のようなパスカルケースは避ける）。
- ファイル名やディレクトリ名も kebab-case に揃えてください。
- ただし、Ruby ファイル（`.rb`）のファイル名は snake_case にしてください。

## 5. コメント

- 適宜コメントを付与してください。
- 既存のコメントが「事実の言い換え」になっていて意味がない場合は削除し、必要なら「意図が伝わるコメント」に書き換えてください。
  - NG 例: `font-size: 12px; /* 12pxにする */`
  - OK 例: `/* 読みやすい大きさ・書体にする */`
- すでにブロック単位で意図が説明されている場合、重複する行コメントは削除して OK です（コメント過多で読みにくくしない）。

## 6. 画像

- `img/` ディレクトリは `images/` ディレクトリにリネームしてください。
- 画像ファイル名も kebab-case を用いるようにリネームしてください。
  - ここでは画像ファイル名を例にしていますが、kebab-case の考え方自体はクラス名や（Ruby ファイルを除く）ファイル名・ディレクトリ名にも適用してください。

  - kebab-case の本来の目的: 複数の単語を `-` で区切って読みやすくすること
    - 例: `red-flower.webp`
    - 例: `spring-flower-collection.webp`
  - 数字の扱い方
    - ルール: 連番の数字は「単語の区切り」ではないため、数字の直前に `-` を入れない
    - 推奨される命名
      - `flower01.webp`（単語が 1 つ + 連番）
      - `red-flower01.webp`（複数単語は `-` で区切るが、連番は末尾にそのまま付ける）
      - `flower-image01.webp`（アンダースコアは `-` に置換し、連番は末尾にそのまま付ける）
    - 避けるべき命名
      - `flower-01.webp`（意味のない分割）
      - `red-flower-01.webp`（連番の直前に `-` を入れている）
      - `flower-image-01.webp`（連番の直前に `-` を入れている）
- 可能な限り、画像の表示品質とパフォーマンスにも配慮してください。
  - `img` には `width` / `height` を指定してレイアウトシフトを防ぐ
  - 適切に `loading="lazy"` を利用する（ただしファーストビューの画像は例外）

## 7. Font Awesome

```html
<!-- Font Awesome -->
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v7.1.0/css/all.css">
```

を用いて、v7.1.0 にしてください。

## 8. SNS

- Twitter は X に名称が変更になっています。Twitter のアイコンは X のアイコンに変更してください。
- Font Awesome が使われている場面では、SNS アイコンも Font Awesome のアイコンを使ってください。
- `twitter.svg` のように SVG 画像を用いている場合は、`x.svg` 画像を用いてください（`x.svg` が存在しない場合は、適宜 SVG コードを生成して `x.svg` を作成してください）。
- SNS の表示順（メニュー、フッター、プロフィール等）は次の順番に揃えてください。
  - X
  - Instagram
  - Facebook
