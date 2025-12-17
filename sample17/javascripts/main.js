/*=====================================================================
  ミニマルな企業サイト - メインスクリプト
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
    const links = nav?.querySelectorAll('a')

    if (!toggle || !nav) return

    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-active')
    })

    links?.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-active')
      })
    })
  }

  /* ニュースティッカー */
  const initNewsTicker = () => {
    const ticker = document.querySelector('.news-ticker ul')
    if (!ticker) return

    // コンテンツを複製して無限スクロール
    ticker.innerHTML += ticker.innerHTML
  }

  /* アコーディオン */
  const initAccordion = () => {
    const titles = document.querySelectorAll('.accordion-title')

    titles.forEach(title => {
      title.addEventListener('click', () => {
        const item = title.closest('.accordion-item')
        const isOpen = item?.classList.contains('is-open')

        // 他を閉じる
        document.querySelectorAll('.accordion-item').forEach(el => {
          el.classList.remove('is-open')
        })

        // クリックしたものを開く/閉じる
        if (!isOpen) {
          item?.classList.add('is-open')
        }
      })
    })

    // 最初のアイテムを開く
    document.querySelector('.accordion-item')?.classList.add('is-open')
  }

  /* スクロールアニメーション */
  const handleScrollAnimations = () => {
    const triggers = document.querySelectorAll('.bg-extend, .fade-up, .flip-in')
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

  /* スムーススクロール */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href')
        if (!href || href === '#') return

        e.preventDefault()
        const target = document.querySelector(href)
        target?.scrollIntoView({ behavior: 'smooth' })
      })
    })
  }

  /* 初期化 */
  window.addEventListener('load', () => {
    initSplash()
    initNavigation()
    initNewsTicker()
    initAccordion()
    initPageTop()
    initSmoothScroll()
    window.addEventListener('scroll', handleScrollAnimations, { passive: true })
  })
})()
