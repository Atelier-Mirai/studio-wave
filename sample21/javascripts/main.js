/*=====================================================================
  ファッションサイト - メインスクリプト
=====================================================================*/

(() => {
  'use strict'

  /* ローディング画面 */
  const initSplash = () => {
    const splash = document.getElementById('splash')
    if (!splash) return

    setTimeout(() => {
      splash.style.opacity = '0'
      document.body.classList.add('appear')
      setTimeout(() => {
        splash.style.display = 'none'
        initSplitScroll()
      }, 800)
    }, 3500)
  }

  /* 分割スクロール（左右すれ違い） */
  const initSplitScroll = () => {
    const scrollWrapper = document.getElementById('scroll-wrapper')
    const leftContent = document.getElementById('left-content')
    const rightContent = document.getElementById('right-content')
    const lastHero = document.querySelector('.js-last-hero')

    if (!scrollWrapper || !leftContent || !rightContent) return

    // スクロール可能な最大量
    const maxScroll = scrollWrapper.offsetHeight - window.innerHeight
    // コンテンツの移動可能な最大量
    const contentHeight = leftContent.offsetHeight
    const maxMovement = contentHeight - window.innerHeight

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const scrollProgress = scrollPosition / maxScroll

      // 左側: 通常方向（上へ移動）
      const leftTranslateY = -scrollProgress * maxMovement
      leftContent.style.transform = `translateY(${leftTranslateY}px)`

      // 右側: 逆方向（下へ移動）
      const rightTranslateY = scrollProgress * maxMovement - maxMovement
      rightContent.style.transform = `translateY(${rightTranslateY}px)`

      // 最後のヒーローセクションは 90% 以降でフェードイン
      if (lastHero) {
        if (scrollProgress >= 0.9) {
          lastHero.classList.add('is-visible')
        } else {
          lastHero.classList.remove('is-visible')
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // 初期位置を設定
    handleScroll()
  }

  /* パーティクル生成 */
  const initParticles = () => {
    const containers = document.querySelectorAll('.particles')

    containers.forEach(container => {
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = `${Math.random() * 100}%`
        particle.style.animationDelay = `${Math.random() * 10}s`
        particle.style.animationDuration = `${8 + Math.random() * 4}s`
        container.appendChild(particle)
      }
    })
  }

  /* Contact セクション用の波線アニメーション */
  const initContactWave = () => {
    const canvas = document.getElementById('contact-wave')
    if (!canvas || !canvas.getContext) return

    const ctx = canvas.getContext('2d')
    const unit = 80
    let seconds = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resize()
    window.addEventListener('resize', resize)

    const drawWave = (color, alpha, zoom, delay) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.globalAlpha = alpha
      ctx.beginPath()

      const xAxis = Math.floor(canvas.height / 2)
      const yAxis = 0

      let x = seconds
      let y = Math.sin(x) / zoom
      ctx.moveTo(yAxis, unit * y + xAxis)

      for (let i = yAxis; i <= canvas.width + 10; i += 10) {
        x = seconds + (-yAxis + i) / unit / zoom
        y = Math.sin(x - delay) / 3
        ctx.lineTo(i, unit * y + xAxis)
      }

      ctx.stroke()
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 複数の波を重ねて描画（色と位相を少しずつ変える）
      drawWave('#ffffff', 0.5, 3, 0)
      drawWave('#ffffff', 0.8, 4, 0.5)
      drawWave('#ffffff', 0.4, 2, 1.0)

      seconds += 0.014
      requestAnimationFrame(render)
    }

    render()
  }

  /* 初期化 */
  window.addEventListener('load', () => {
    initSplash()
    initParticles()
    initContactWave()
  })
})()
