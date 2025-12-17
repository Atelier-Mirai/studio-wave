/*=====================================================================
  キッズサイト（学習塾） - メインスクリプト
=====================================================================*/

(() => {
  'use strict'

  /* ローディング画面 */
  const initSplash = () => {
    const splash = document.getElementById('splash')
    if (!splash) return

    setTimeout(() => {
      splash.style.transition = 'opacity 0.5s'
      splash.style.opacity = '0'
      setTimeout(() => {
        splash.style.display = 'none'
        document.body.classList.add('appear')
        handleScrollAnimations()
      }, 500)
    }, 1500)
  }

  /* ナビゲーション */
  const initNavigation = () => {
    const toggle = document.querySelector('.menu-toggle')
    const nav = document.getElementById('global-nav')
    const circleBg = document.querySelector('.circle-bg')
    const links = nav?.querySelectorAll('a')

    if (!toggle || !nav) return

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active')
      nav.classList.toggle('is-active')
      circleBg?.classList.toggle('is-active')
    })

    links?.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-active')
        nav.classList.remove('is-active')
        circleBg?.classList.remove('is-active')
      })
    })
  }

  /* ヒーロースライダー */
  const initHeroSlider = () => {
    const slides = document.querySelectorAll('.hero-slide')
    if (slides.length <= 1) return

    let current = 0
    slides[0]?.classList.add('is-active')

    setInterval(() => {
      slides[current].classList.remove('is-active')
      current = (current + 1) % slides.length
      slides[current].classList.add('is-active')
    }, 4000)
  }

  /* ギャラリースライダー（無限スクロール） */
  const initGallerySlider = () => {
    const track = document.querySelector('.gallery-track')
    if (!track) return

    // 画像を複製して無限スクロール
    const items = track.innerHTML
    track.innerHTML = items + items
  }

  /* スクロールアニメーション */
  const handleScrollAnimations = () => {
    const triggers = document.querySelectorAll('.fade-in, .fade-up, .zoom-in, .flip-in')
    const windowH = window.innerHeight

    triggers.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top < windowH - 50) {
        el.classList.add('is-visible')
      }
    })
  }

  /* ページトップ */
  const initPageTop = () => {
    const btn = document.getElementById('page-top')
    if (!btn) return

    btn.addEventListener('click', (e) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  /* 初期化 */
  const init = () => {
    initNavigation()
    initHeroSlider()
    initGallerySlider()
    initPageTop()
    window.addEventListener('scroll', handleScrollAnimations, { passive: true })
  }

  window.addEventListener('load', () => {
    initSplash()
    init()
  })
})()
