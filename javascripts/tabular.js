/*=====================================================================
  タブ切り替え機能を実現する

  タブの動作の仕組み
  タブの見出しをクリックすると、activeクラス付与
  タブの内容部分にも、activeクラス付与

  <!-- タブの見出し部分 -->
  <ul class="tab menu">
    <li><a href="#midori" class="active">緑のアクセント</a></li>
    <li><a href="#komono">小物と飾り棚</a></li>
  </ul>

  <!-- タブの内容部分 -->
  <article id="midori" class="tab segument active">
  </article>
=====================================================================*/

// 任意のタブにURLからリンクするための関数
const showSegumentByHashLink = (locationHashLink) => {
  if (!locationHashLink) { return false } // 引数が与えられないときは戻る。

  // タブの見出し
  let tabMenus    = document.querySelectorAll(".tab.menu li a")

  // タブ内のaタグ全てを取得
  tabMenus.forEach((a, index) => {
    let id = a.getAttribute("href") // aタグのhref属性値を取得
                                    // (=表示させたいタブセグメントのID)

    // タブの見出し部分、内容部分から active クラスを取り除く
    let li = a.parentNode           // タブ内のaタグの親要素liを取得
    li.classList.remove("active")   // activeクラスを削除
    let tabSegment = document.querySelector(id) // タブセグメントを取得
    tabSegment.classList.remove("active")       // タブセグメントからも削除

    // もしタブの見出しののhref属性が、
    // リンク元の指定されたURLのハッシュリンクと等しければ、
    if(id === locationHashLink){
      li.classList.add("active")          // タブ見出しにactiveクラス付与
      tabSegment = document.querySelector(id)
      tabSegment.classList.add("active")  // タブセグメントにもactiveクラス付与
    }
  })
}

// タブをクリックした際に、以下が実行される。
let tabMenus = document.querySelectorAll(".tab.menu li a")
tabMenus.forEach((element, index) => {
  element.addEventListener("click", (event) => {
    // 親要素へのバブリング（伝達）を保ちつつ
    // aタグのリンク機能を無効化する
    event.preventDefault()
    let id = element.getAttribute("href") // リンクのhref属性を取得
                                          // (=表示させたいタブセグメントのID)
    showSegumentByHashLink(id)            // タブセグメントを表示する
  })
})

// ページ読み込み完了時に、以下が実行される。
window.addEventListener("load", (event) => {
  let locationHashLink = location.hash     // URLのフラグメント識別子(ハッシュリンク)を取得
  showSegumentByHashLink(locationHashLink) // 設定したタブセグメントの読み込み
})
