/*=====================================================================
 🌸の花びらが舞い散るJavaScript
 https://actyway.com/8351 を元に作成
=====================================================================*/

(
() => {
  // =========================================================================
  // 定数宣言等
  // =========================================================================
  const NUMBER_OF_HANABIRAS = 50 // 花びらの枚数
  const FPS                 = 24 // 一秒間に24回 動かす
  const HANABIRA_HEIGHT     = 30 // 花びらの高さ 回転するので最大値は 30px
  const HANABIRA_WIDTH      = 30 // 花びらの幅 回転するので最大値は 30px
  const HANABIRA_Z_BASE     = 10000 // 花びらの z-index の基準値

  // ウィンドウの高さ
  let windowHeight = window.innerHeight
  // ウィンドウの幅(スクロールバー除く)
  let windowWidth  = document.documentElement.clientWidth
  // スクロール位置とイベントリスナの登録
  // (画面スクロールした鴇に花びらがウィンドウ内に納まるようにする為)
  let scroll       = document.documentElement.scrollTop || document.body.scrollTop

  window.addEventListener('resize', () => {
    windowHeight = window.innerHeight
    windowWidth  = document.documentElement.clientWidth
  })

  document.addEventListener('scroll', () => {
    scroll = document.documentElement.scrollTop || document.body.scrollTop
  }, { passive: true })

  // =========================================================================
  // 乱数関数
  // min 以上 max 以下の乱数を返す (integer)
  // min 以上 max 未満の乱数を返す (float)
  // =========================================================================
  const rand = (min, max, type = "integer") => {
    if(type === "integer"){
      return Math.floor(Math.random() * (max-min+1)) + min
    } else {
      return Math.random() * (max-min) + min
    }
  }

  // =========================================================================
  // 花びらクラスの宣言
  // =========================================================================
  class Hanabira {
    // コンストラクタ(構築子)
    constructor(id, x, y, z, tremorMax, fallingSpeed, cssClassName) {
      this.id           = id
      this.x            = x
      this.y            = y
      this.z            = z
      this.tremorMax    = tremorMax
      this.tremorCount  = 0
      this.direction    = "right"
      this.fallingSpeed = fallingSpeed
      this.cssClassName = cssClassName
    }

    // 際大揺らぎ回数に達しているか？
    isTremorMax() {
      return this.tremorCount === this.tremorMax
    }

    // 揺らぎ方向転換
    directionSwitch() {
      if (this.direction === "right") {
        this.direction = "left"
      } else {
        this.direction = "right"
      }
    }

    // 花びらの位置に関して
    // 空中にいるか？(ウィンドウ内か？)
    isInTheAir() {
      const verticalInView   = this.y < scroll + windowHeight - HANABIRA_HEIGHT
      const horizontalInView = (this.x + HANABIRA_WIDTH) >= 0 && this.x <= windowWidth
      return verticalInView && horizontalInView
    }

    // 地面に着いたか？
    isOnTheGround() {
      return !this.isInTheAir()
    }

    // 右端にいるか？
    isOnTheRightEdge() {
      return this.x + HANABIRA_WIDTH >= windowWidth
    }

    // 左端にいるか？
    isOnTheLeftEdge() {
      // 花びら幅の半分の位置なら、左端と見做す。
      return this.x <= HANABIRA_WIDTH / 2
    }

    // 花びらの x, y 座標を更新する
    move() {
      // 花びらの位置がウィンドウ内なら
      if (this.isInTheAir()) {
        // 同一方向へtremorMax回移動したなら、移動方向を反転させる
        if (this.isTremorMax()) {
          this.directionSwitch()
          this.tremorCount = 0
        }

        // 左右に移動する（端に達しても画面外へそのまま流れていく）
        let deltaX   = rand(0.2, 0.7, "float")
        let signFlag = (this.direction === "right" ? +1 : -1)
        this.x      += signFlag * deltaX

        // 移動回数を増やす
        this.tremorCount++

        // 落下速度分を加える
        this.y += this.fallingSpeed

      // もし地面に着いているなら、上に戻す
      } else if (this.isOnTheGround()) {
        this.y = scroll
        this.x = rand(0, windowWidth - HANABIRA_WIDTH)
      }
    }

    // 位置情報を DOM に反映させる
    applyPositionToDom(domHanabira) {
      domHanabira.setAttribute('style', `top: ${this.y}px; left: ${this.x}px; z-index: ${this.z};`)
    }
  }

  // =========================================================================
  // 花びらクラスから、50枚の花びらインスタンスを生成、HTML文書に追加する
  // =========================================================================

  // 櫻の花びらのための新しい div 要素を作成し、body の末尾に追加
  const divHanabira = document.createElement("div")
  divHanabira.style.position = 'fixed'
  divHanabira.style.inset = '0'
  divHanabira.style.pointerEvents = 'none'
  document.body.after(divHanabira)

  // 花びらインスタンスを生成、
  // それぞれの花びらについて、位置等の初期設定を行う
  const domHanabiras = [] // 花びら要素の配列
  const jsHanabiras  = [] // 花びらjsオブジェクトの配列
  for (let i = 0; i < NUMBER_OF_HANABIRAS; i++) {
    // 各種属性の初期値の準備
    const id           = i
    const x            = rand(HANABIRA_WIDTH / 2, windowWidth - HANABIRA_WIDTH)
    const y            = rand(-500, 0) + scroll
    const z            = HANABIRA_Z_BASE + i
    const tremorMax    = rand(15, 50)
    const fallingSpeed = rand(1, 3)
    const cssClassName = `hana t${rand(1, 5)} a${rand(1, 5)}`
    // 各種属性の初期値を与え、花びらクラスのインスタンスを生成
    const jsHanabira   = new Hanabira(id, x, y, z, tremorMax, fallingSpeed, cssClassName)
    // 生成したインスタンスを、あとから扱いやすいよう、配列に格納する
    jsHanabiras[i]   = jsHanabira

    // 花びらの div を作る
    const domHanabira = document.createElement('div')
    // 初期表示位置を設定する
    jsHanabira.applyPositionToDom(domHanabira)
    // ID や 花びらの色とアニメーションのための css class を設定する
    domHanabira.id = i
    domHanabira.className = jsHanabira.cssClassName
    // 作成した花びらをDOMに追加、ブラウザ画面に表示されるようにする
    divHanabira.appendChild(domHanabira)
    // 扱いやすくするために、花びら要素達を配列に格納
    domHanabiras[i] = domHanabira
  }

  // =========================================================================
  // メイン処理
  // 生成したそれぞれの花びらの位置情報を更新し、画面に反映する。
  // =========================================================================
  const FRAME_INTERVAL = 1000 / FPS
  let lastTime = performance.now()

  const tick = (now) => {
    if (now - lastTime >= FRAME_INTERVAL) {
      for (const jsHanabira of jsHanabiras) {
        // 各花びらに対し、位置情報の更新処理を行う
        jsHanabira.move()

        // js オブジェクトの位置情報を、dom の位置に反映する。
        const id          = jsHanabira.id
        const domHanabira = domHanabiras[id]
        jsHanabira.applyPositionToDom(domHanabira)
      }
      lastTime = now
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}
)()
