/*=====================================================================
  枕草子ページ用 四季エフェクト制御

  - shiki.js の startSeasonEffect を、メニュークリックとスクロール位置に
    あわせて呼び分ける。
  - 季節セクション:
      #haru  -> spring
      #natsu -> summer
      #aki   -> autumn
      #fuyu  -> winter
=====================================================================*/

(() => {
  'use strict'

  // セクションIDと shiki.js に渡す season 名の対応表
  const SECTION_TO_SEASON = {
    haru: 'spring',
    natsu: 'summer',
    aki: 'autumn',
    fuyu: 'winter',
  }

  let currentSeason = 'spring'

  const setSeason = (season) => {
    if (!season || season === currentSeason) return
    if (typeof window.startSeasonEffect !== 'function') return
    window.startSeasonEffect(season)
    currentSeason = season
  }

  // スクロール位置から、画面中央に最も近い季節セクションを探して季節を決定
  const detectSeasonByScroll = () => {
    const container = document.querySelector('.parallax-wrapper')
    if (!container) return

    const sections = Array.from(container.querySelectorAll('.kisetsu'))
    if (sections.length === 0) return

    // ビューポートの垂直方向中央位置（ここに最も近いセクションを「現在の季節」とみなす）
    const viewportCenterY = window.innerHeight / 2

    let bestSeason = currentSeason
    let bestDistance = Infinity

    // 各季節セクションの中心とビューポート中央との距離を比較し、最も近いものを採用
    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      const sectionCenterY = rect.top + rect.height / 2
      const distance = Math.abs(sectionCenterY - viewportCenterY)

      const id = section.id
      const season = SECTION_TO_SEASON[id]
      if (!season) continue

      if (distance < bestDistance) {
        bestDistance = distance
        bestSeason = season
      }
    }

    setSeason(bestSeason)
  }

  // スクロールに応じて detectSeasonByScroll を呼び出す設定
  const setupScrollSync = () => {
    const container = document.querySelector('.parallax-wrapper')
    if (!container) return

    // requestAnimationFrame で 1 フレームごとに処理するためのフラグ
    // （スクロールイベントの連発による過剰な再計算を防ぐ）
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        detectSeasonByScroll()
        ticking = false
      })
    }

    container.addEventListener('scroll', onScroll, { passive: true })

    // 初期位置に応じた季節を反映
    detectSeasonByScroll()
  }

  // 春・夏・秋・冬メニューのクリックと季節エフェクトを連動
  const setupMenuSync = () => {
    // モバイルフッター／デスクトップ follow メニューの両方をまとめて取得するセレクタ
    const selector = [
      'a[href="#haru"]',
      'a[href="#natsu"]',
      'a[href="#aki"]',
      'a[href="#fuyu"]',
    ].join(', ')

    const links = document.querySelectorAll(selector)
    links.forEach((link) => {
      link.addEventListener('click', () => {
        // クリックされたリンクの href からセクション ID を取り出し、対応する季節へ切り替え
        const href = link.getAttribute('href') || ''
        const id = href.replace('#', '')
        const season = SECTION_TO_SEASON[id]
        if (!season) return
        setSeason(season)
      })
    })
  }

  // ページ読み込み完了時に、一度だけ初期化を行う
  const init = () => {
    // shiki.js がまだ読み込まれていない場合は何もしない
    if (typeof window.startSeasonEffect !== 'function') return

    currentSeason = 'spring'
    setupMenuSync()
    setupScrollSync()
  }

  document.addEventListener('DOMContentLoaded', init)
})()
