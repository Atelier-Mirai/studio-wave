/*=====================================================================
 四季のエフェクト（桜・蛍・落ち葉・雪）
  - DOM パーティクルで四季の演出を切替 (sakura / hotaru / ochiba / yuki)
  - div のスタイル＆JSパラメータで挙動を制御
=====================================================================*/

(() => {
  const DEFAULT_SEASON = 'spring'
  const FPS = 24
  const BASE_Z = 10000

  // ウィンドウサイズとスクロール位置を追従
  let windowHeight = window.innerHeight
  let windowWidth = document.documentElement.clientWidth
  let scroll = document.documentElement.scrollTop || document.body.scrollTop

  // 画面リサイズ時に寸法を再取得
  window.addEventListener('resize', () => {
    windowHeight = window.innerHeight
    windowWidth = document.documentElement.clientWidth
  })

  // スクロール位置を監視して現在のスクロール量を保持
  document.addEventListener('scroll', () => {
    scroll = document.documentElement.scrollTop || document.body.scrollTop
  }, { passive: true })

  // ユーティリティ: min/max の整数/小数乱数を返す
  const rand = (min, max, type = 'integer') => {
    if (type === 'integer') {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    return Math.random() * (max - min) + min
  }

  // 季節ごとのパラメータ
  const SEASON_CONFIGS = {
    spring: {
      behavior: 'fall',
      count: 50,
      widthRange: [16, 24],
      heightRange: [12, 20],
      speedYRange: [1, 3],
      swayXRange: [0.2, 0.7],
      swayYRange: [0, 0],
      resetToTop: true,
      baseClass: 'sakura',
      cssVariants: ['t1', 't2', 't3', 't4', 't5'],
      animVariants: ['a1', 'a2', 'a3', 'a4', 'a5'],
    },
    summer: {
      behavior: 'float',
      count: 24,
      widthRange: [8, 12],
      heightRange: [8, 12],
      speedYRange: [0.1, 0.3],
      swayXRange: [0.25, 0.6],
      swayYRange: [0.15, 0.35],
      resetToTop: false,
      baseClass: 'hotaru',
      cssVariants: ['t1', 't2', 't3', 't4', 't5'],
      animVariants: ['a1', 'a2', 'a3', 'a4', 'a5'],
    },
    autumn: {
      behavior: 'fall',
      count: 36,
      widthRange: [12, 18],
      heightRange: [10, 14],
      speedYRange: [1.2, 2.6],
      swayXRange: [0.15, 0.45],
      swayYRange: [0, 0],
      resetToTop: true,
      baseClass: 'ochiba',
      cssVariants: ['t1', 't2', 't3', 't4', 't5'],
      animVariants: ['a1', 'a2', 'a3', 'a4', 'a5'],
    },
    winter: {
      behavior: 'fall',
      count: 70,
      widthRange: [6, 10],
      heightRange: [6, 10],
      speedYRange: [0.6, 1.4],
      swayXRange: [0.05, 0.2],
      swayYRange: [0, 0],
      resetToTop: true,
      baseClass: 'yuki',
      cssVariants: ['t1', 't2', 't3', 't4', 't5'],
      animVariants: ['a1', 'a2', 'a3', 'a4', 'a5'],
    },
  }

  // パーティクル1個分のモデル（DOM 反映は applyPositionToDom）
  class Particle {
    // 各パーティクルの初期状態をセット
    constructor(id, options) {
      this.id = id
      this.behavior = options.behavior
      this.x = options.x
      this.y = options.y
      this.z = options.z
      this.width = options.width
      this.height = options.height
      this.speedY = options.speedY
      this.swayX = options.swayX
      this.swayY = options.swayY
      this.resetToTop = options.resetToTop

      // fall 用
      this.tremorMax = options.tremorMax
      this.tremorCount = 0
      this.direction = rand(0, 1) === 0 ? 'right' : 'left'

      // float 用
      this.floatAngle = rand(0, Math.PI * 2, 'float')
      this.floatSpeed = rand(0.5, 1.2, 'float')
    }

    // 画面内にいるか判定
    isInTheAir() {
      const verticalInView = this.y < scroll + windowHeight - this.height
      const horizontalInView = (this.x + this.width) >= 0 && this.x <= windowWidth
      return verticalInView && horizontalInView
    }

    // 画面外に出たか判定
    isOnTheGround() {
      return !this.isInTheAir()
    }

    // 左右の揺れ方向を反転
    directionSwitch() {
      this.direction = this.direction === 'right' ? 'left' : 'right'
    }

    // 落下系の移動ロジック
    moveFall() {
      if (this.isInTheAir()) {
        if (this.tremorCount === this.tremorMax) {
          this.directionSwitch()
          this.tremorCount = 0
        }

        const deltaX = rand(this.swayX * 0.5, this.swayX, 'float')
        const signFlag = this.direction === 'right' ? 1 : -1
        this.x += signFlag * deltaX
        this.tremorCount++
        this.y += this.speedY
      } else if (this.resetToTop) {
        this.y = scroll
        this.x = rand(this.width, Math.max(this.width, windowWidth - this.width))
      }
    }

    // 蛍用：ゆらゆら移動＋明滅
    moveFloat() {
      // ゆらぎ移動（蛍）
      this.floatAngle += 0.02 * this.floatSpeed
      this.x += Math.cos(this.floatAngle) * this.swayX
      this.y += Math.sin(this.floatAngle * 0.7) * this.swayY

      // 画面外に出すぎたら戻す
      if (this.x < -this.width) this.x = windowWidth + this.width
      if (this.x > windowWidth + this.width) this.x = -this.width
      if (this.y < scroll - windowHeight * 0.3) this.y = scroll + windowHeight * 0.7
      if (this.y > scroll + windowHeight * 1.3) this.y = scroll + windowHeight * 0.3
    }

    // ビヘイビアに応じた移動を実行
    move() {
      if (this.behavior === 'float') {
        this.moveFloat()
      } else {
        this.moveFall()
      }
    }

    // 位置情報を DOM 要素へ反映
    applyPositionToDom(dom) {
      dom.style.top = `${this.y}px`
      dom.style.left = `${this.x}px`
      dom.style.zIndex = `${this.z}`
      dom.style.width = `${this.width}px`
      dom.style.height = `${this.height}px`
    }
  }

  let container = null
  let domParticles = []
  let jsParticles = []
  let rafId = null

  // ループ・DOMをまとめて後片付けする
  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (container) {
      container.remove()
      container = null
    }
    domParticles = []
    jsParticles = []
  }

  // パーティクルを1つ生成し、DOMに追加
  const createParticle = (season, config, id) => {
    const width = rand(config.widthRange[0], config.widthRange[1])
    const height = rand(config.heightRange[0], config.heightRange[1])

    const x = rand(width, Math.max(width, windowWidth - width))
    const y = config.behavior === 'float'
      ? rand(scroll, scroll + windowHeight, 'float')
      : rand(-windowHeight, 0) + scroll

    const z = BASE_Z + id
    const speedY = rand(config.speedYRange[0], config.speedYRange[1], 'float')
    const swayX = rand(config.swayXRange[0], config.swayXRange[1], 'float')
    const swayY = rand(config.swayYRange[0], config.swayYRange[1], 'float')
    const tremorMax = rand(15, 50)

    const baseClass = config.baseClass || 'sakura'
    const cssVariant = config.cssVariants[rand(0, config.cssVariants.length - 1)]
    const animVariant = config.animVariants[rand(0, config.animVariants.length - 1)]

    const particle = new Particle(id, {
      behavior: config.behavior,
      x,
      y,
      z,
      width,
      height,
      speedY,
      swayX,
      swayY,
      tremorMax,
      resetToTop: config.resetToTop,
    })

    const dom = document.createElement('div')
    dom.className = `shiki-particle ${baseClass} ${cssVariant} ${animVariant}`
    particle.applyPositionToDom(dom)

    container.appendChild(dom)
    domParticles[id] = dom
    jsParticles[id] = particle
  }

  // 季節ごとに構成を入れ替えて開始
  const startSeasonEffect = (season = DEFAULT_SEASON) => {
    const config = SEASON_CONFIGS[season] || SEASON_CONFIGS[DEFAULT_SEASON]
    cleanup()

    container = document.createElement('div')
    container.className = `shiki-container shiki-${season}`
    document.body.appendChild(container)

    for (let i = 0; i < config.count; i++) {
      createParticle(season, config, i)
    }

    const FRAME_INTERVAL = 1000 / FPS
    let lastTime = performance.now()

    const tick = (now) => {
      if (now - lastTime >= FRAME_INTERVAL) {
        for (const particle of jsParticles) {
          particle.move()
          particle.applyPositionToDom(domParticles[particle.id])
        }
        lastTime = now
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
  }


  // 生成済みのパーティクルとタイマーを全て破棄して停止
  const stopSeasonEffect = () => {
    cleanup()
  }

  // 公開（デバッグや季節切替用）
  window.startSeasonEffect = startSeasonEffect
  window.stopSeasonEffect = stopSeasonEffect

  // デフォルト起動
  startSeasonEffect(DEFAULT_SEASON)
})()
