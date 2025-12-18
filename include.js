/*=====================================================================
  部分ファイルを読み込むための include 関数

  [使い方]
  <nav id="navigation"></nav>
  <script>include("navigation")</script>
  navタグが、_navigation.html に置き換わる。

  <div id="sample_card"></div>
  <script>includeRange("sample_card", 1, 25)</script>
  divタグが、_sample_card.html を 01〜25 で展開した内容に置き換わる。

  [参考]
  HTMLで簡単インクルード！ https://jp-seemore.com/web/2408/
=====================================================================*/

// 指定した部分ファイル（_*.html）を読み込み、idが同名の要素を置換する
const include = (partial) => {
  // partial 名から読み込むファイル名（_*.html）を決定
  let filename = "";
  if (partial.startsWith("../")) {
    // 親ディレクトリを参照する
    partial = partial.slice(3);
    filename = `../_${partial}.html`;
  } else {
    filename = `_${partial}.html`;
  }
  // 置換対象要素の id は partial と同名
  let id = partial;

  // 部分HTMLを取得して、対象要素を丸ごと置換
  fetch(filename)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${filename} の取得に失敗しました`);
      }
      return response.text();
    })
    .then((data) => {
      const element = document.getElementById(id);
      if (!element) return;
      element.outerHTML = data;
    })
    .catch((error) => {
      console.error(error);
    });
};

// 1つのテンプレート（_*.html）を読み込み、{{n}}/{{nn}} を置換しながら範囲展開して置換する
const includeRange = (partial, start, end) => {
  // partial 名から読み込むファイル名（_*.html）を決定
  let filename = "";
  if (partial.startsWith("../")) {
    partial = partial.slice(3);
    filename = `../_${partial}.html`;
  } else {
    filename = `_${partial}.html`;
  }
  // 展開結果の挿入先（置換対象）の id は partial と同名
  let id = partial;

  // テンプレートを1回取得し、start..end の範囲で連結して置換
  fetch(filename)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${filename} の取得に失敗しました`);
      }
      return response.text();
    })
    .then((template) => {
      const element = document.getElementById(id);
      if (!element) return;

      // {{n}}: 1.., {{nn}}: 01.. のような0埋め2桁
      let html = "";
      for (let n = start; n <= end; n += 1) {
        const nn = String(n).padStart(2, "0");
        html += template
          .replaceAll("{{n}}", String(n))
          .replaceAll("{{nn}}", nn);
      }
      // 生成したHTMLで、元の要素を丸ごと置換
      element.outerHTML = html;
    })
    .catch((error) => {
      console.error(error);
    });
};
