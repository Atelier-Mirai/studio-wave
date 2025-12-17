/*=====================================================================
  音楽サイト - メインスクリプト
=====================================================================*/

(() => {
  'use strict'

  /* ローディング画面（SVG描画） */
  const initSplash = () => {
    const splash = document.getElementById('splash')
    if (!splash) return

    setTimeout(() => {
      splash.style.opacity = '0'
      document.body.classList.add('appear')
      setTimeout(() => {
        splash.style.display = 'none'
        initAnimations()
      }, 800)
    }, 3500)
  }

  /* ナビゲーション */
  const initNavigation = () => {
    const toggle = document.querySelector('.menu-toggle')
    const nav = document.getElementById('global-nav')
    const links = nav?.querySelectorAll('a')

    if (!toggle || !nav) return

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active')
      nav.classList.toggle('is-active')
    })

    links?.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-active')
        nav.classList.remove('is-active')
      })
    })
  }

  /* 動画モーダル */
  const initVideoModal = () => {
    const playBtn = document.querySelector('.play-button')
    const modal = document.getElementById('video-modal')
    const closeBtn = modal?.querySelector('.modal-close')
    const video = modal?.querySelector('video')

    if (!playBtn || !modal) return

    playBtn.addEventListener('click', () => {
      modal.classList.add('is-active')
      video?.play()
    })

    closeBtn?.addEventListener('click', () => {
      modal.classList.remove('is-active')
      video?.pause()
    })

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-active')
        video?.pause()
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        modal.classList.remove('is-active')
        video?.pause()
      }
    })
  }

  /* アニメーション初期化 */
  const initAnimations = () => {
    document.querySelectorAll('.fade-down, .slide-in').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * 150)
    })
  }

  /* 初期化 */
  window.addEventListener('load', () => {
    initSplash()
    initNavigation()
    initVideoModal()
  })
})()
