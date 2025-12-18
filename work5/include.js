/*=====================================================================
  部分ファイルを読み込むための include 関数

  [使い方]
  <nav id="navigation"></nav>
  <script>include("navigation")</script>
  navタグが、_navigation.html に置き換わる。

  [参考]
  HTMLで簡単インクルード！ https://jp-seemore.com/web/2408/
=====================================================================*/
const include = (partial) => {
  let filename = "";
  if (partial.startsWith("../")) {
    // 親ディレクトリを参照する
    partial = partial.slice(3);
    filename = `../_${partial}.html`;
  } else {
    filename = `_${partial}.html`;
  }
  let id = partial;

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
