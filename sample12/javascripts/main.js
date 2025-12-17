/*=====================================================================
  男性向けカーディーラーサイト - メインスクリプト
  バニラ JS で実装（jQuery 不使用）
=====================================================================*/

(() => {
  'use strict'

  /*---------------------------------------------------------------
    ローディング画面（スプラッシュ）
  ---------------------------------------------------------------*/
  const initSplash = () => {
    const splash = document.getElementById('splash')
    const splashLogo = document.querySelector('.loader')
    if (!splash) return

    setTimeout(() => {
      if (splashLogo) {
        splashLogo.style.transition = 'opacity 0.5s'
        splashLogo.style.opacity = '0'
      }
    }, 1200)

    setTimeout(() => {
      splash.style.transition = 'opacity 0.5s'
      splash.style.opacity = '0'
      setTimeout(() => {
        splash.style.display = 'none'
        document.body.classList.add('appear')
        // アニメーションを初期化
        handleScrollAnimations()
        initTypingEffect()
      }, 500)
    }, 1500)
  }

  /*---------------------------------------------------------------
    ハンバーガーメニュー
  ---------------------------------------------------------------*/
  const initNavigation = () => {
    const menuToggle = document.querySelector('.menu-toggle')
    const globalNav = document.getElementById('global-nav')
    const navLinks = globalNav?.querySelectorAll('a')
    const hasChildItems = document.querySelectorAll('.has-child > a')

    if (!menuToggle || !globalNav) return

    // メニュートグル
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is-active')
      globalNav.classList.toggle('is-active')
    })

    // ナビリンククリックでメニューを閉じる
    navLinks?.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active')
        globalNav.classList.remove('is-active')
      })
    })

    // ドロップダウン
    hasChildItems.forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 960) {
          e.preventDefault()
          const parent = link.parentElement
          parent?.classList.toggle('is-open')
        }
      })
    })

    // リサイズ時にドロップダウンをリセット
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        document.querySelectorAll('.has-child').forEach(el => {
          el.classList.remove('is-open')
        })
      }
    })
  }

  /*---------------------------------------------------------------
    ヘッダーの表示/非表示
  ---------------------------------------------------------------*/
  const initHeaderScroll = () => {
    const header = document.getElementById('header')
    const service = document.getElementById('service')
    if (!header || !service) return

    let lastScroll = 0

    const updateHeader = () => {
      const scroll = window.scrollY
      const serviceTop = service.offsetTop

      if (scroll <= 20) {
        header.classList.add('is-visible')
      } else if (scroll >= serviceTop) {
        header.classList.remove('is-hidden')
        header.classList.add('is-visible')
      } else {
        if (header.classList.contains('is-visible')) {
          header.classList.remove('is-visible')
          header.classList.add('is-hidden')
        }
      }

      lastScroll = scroll
    }

    window.addEventListener('scroll', updateHeader, { passive: true })
  }

  /*---------------------------------------------------------------
    ヒーロースライドショー
  ---------------------------------------------------------------*/
  const initHeroSlideshow = () => {
    const container = document.querySelector('.hero-slideshow')
    if (!container) return

    const isMobile = window.innerWidth <= 768
    const images = isMobile
      ? [
          { src: 'images/hero01-sp.webp', alt: 'ヒーロー画像1' },
          { src: 'images/hero02-sp.webp', alt: 'ヒーロー画像2' },
          { src: 'images/hero03-sp.webp', alt: 'ヒーロー画像3' },
        ]
      : [
          { src: 'images/hero01.webp', alt: 'ヒーロー画像1' },
          { src: 'images/hero02.webp', alt: 'ヒーロー画像2' },
          { src: 'images/hero03.webp', alt: 'ヒーロー画像3' },
        ]

    // 画像を生成
    images.forEach((info, index) => {
      const img = document.createElement('img')
      img.alt = info.alt
      if (index === 0) {
        img.src = info.src
        img.classList.add('is-active')
        img.dataset.loaded = 'true'
      } else {
        img.dataset.src = info.src
        img.dataset.loaded = 'false'
      }
      container.appendChild(img)
    })

    const slides = container.querySelectorAll('img')
    if (slides.length <= 1) return

    let current = 0
    const interval = 4000

    setInterval(() => {
      slides[current].classList.remove('is-active')
      current = (current + 1) % slides.length

      const nextSlide = slides[current]
      if (nextSlide.dataset.loaded !== 'true') {
        const dataSrc = nextSlide.dataset.src
        if (dataSrc) nextSlide.src = dataSrc
        nextSlide.dataset.loaded = 'true'
      }
      nextSlide.classList.add('is-active')
    }, interval)
  }

  /*---------------------------------------------------------------
    ページトップボタン
  ---------------------------------------------------------------*/
  const initPageTop = () => {
    const pageTop = document.getElementById('page-top')
    const contact = document.getElementById('contact')
    const footer = document.getElementById('footer')

    if (!pageTop) return

    pageTop.addEventListener('click', (e) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    const checkVisibility = () => {
      const scroll = window.scrollY
      const windowH = window.innerHeight

      const contactTop = contact?.offsetTop ?? Infinity
      const contactH = contact?.offsetHeight ?? 0
      const footerTop = footer?.offsetTop ?? Infinity
      const footerH = footer?.offsetHeight ?? 0

      const inContactRange = scroll + windowH >= contactTop && scroll + windowH <= contactTop + contactH
      const inFooterRange = scroll + windowH >= footerTop && scroll + windowH <= footerTop + footerH

      if (inContactRange || inFooterRange) {
        pageTop.classList.add('is-visible')
        pageTop.classList.remove('is-hidden')
        pageTop.classList.remove('initially-hidden')
      } else if (!pageTop.classList.contains('initially-hidden')) {
        pageTop.classList.add('is-hidden')
        pageTop.classList.remove('is-visible')
      }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
  }

  /*---------------------------------------------------------------
    タブメニュー
  ---------------------------------------------------------------*/
  const initTabs = () => {
    const tabLinks = document.querySelectorAll('.tab-list a')
    const tabPanels = document.querySelectorAll('.tab-panel')

    if (tabLinks.length === 0) return

    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = link.getAttribute('href')
        if (!targetId) return

        // タブの切り替え
        tabLinks.forEach(l => l.parentElement?.classList.remove('is-active'))
        link.parentElement?.classList.add('is-active')

        // パネルの切り替え
        tabPanels.forEach(panel => panel.classList.remove('is-active'))
        document.querySelector(targetId)?.classList.add('is-active')
      })
    })

    // 初期状態
    tabLinks[0]?.parentElement?.classList.add('is-active')
    tabPanels[0]?.classList.add('is-active')

    // URLハッシュからタブを開く
    const hash = location.hash
    if (hash) {
      const targetLink = document.querySelector(`.tab-list a[href="${hash}"]`)
      targetLink?.click()
    }
  }

  /*---------------------------------------------------------------
    検索オーバーレイ
  ---------------------------------------------------------------*/
  const initSearch = () => {
    const openBtn = document.querySelector('.search-toggle')
    const closeBtn = document.querySelector('.search-close')
    const overlay = document.getElementById('search-overlay')
    const input = document.querySelector('.search-input')

    if (!openBtn || !overlay) return

    openBtn.addEventListener('click', () => {
      overlay.classList.add('is-active')
      input?.focus()
    })

    closeBtn?.addEventListener('click', () => {
      overlay.classList.remove('is-active')
    })

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        overlay.classList.remove('is-active')
      }
    })
  }

  /*---------------------------------------------------------------
    ライトボックス（ギャラリー）
  ---------------------------------------------------------------*/
  const initLightbox = () => {
    const galleryItems = document.querySelectorAll('.gallery-item a')
    const overlay = document.getElementById('lightbox-overlay')
    const content = document.querySelector('.lightbox-content img')
    const caption = document.querySelector('.lightbox-caption')
    const closeBtn = document.querySelector('.lightbox-close')
    const prevBtn = document.querySelector('.lightbox-prev')
    const nextBtn = document.querySelector('.lightbox-next')

    if (galleryItems.length === 0 || !overlay) return

    let currentIndex = 0
    const items = Array.from(galleryItems)

    const openLightbox = (index) => {
      currentIndex = index
      const link = items[index]
      const imgSrc = link.getAttribute('href')
      const imgCaption = link.dataset.title || ''

      if (content) content.src = imgSrc || ''
      if (caption) caption.textContent = imgCaption
      overlay.classList.add('is-active')
    }

    const closeLightbox = () => {
      overlay.classList.remove('is-active')
    }

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length
      openLightbox(currentIndex)
    }

    const showNext = () => {
      currentIndex = (currentIndex + 1) % items.length
      openLightbox(currentIndex)
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        openLightbox(index)
      })
    })

    closeBtn?.addEventListener('click', closeLightbox)
    prevBtn?.addEventListener('click', showPrev)
    nextBtn?.addEventListener('click', showNext)

    // キーボード操作
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('is-active')) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    })

    // オーバーレイクリックで閉じる
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox()
    })
  }

  /*---------------------------------------------------------------
    スクロールアニメーション
  ---------------------------------------------------------------*/
  const handleScrollAnimations = () => {
    const windowH = window.innerHeight
    const scroll = window.scrollY

    // 背景伸びアニメーション（左から）
    document.querySelectorAll('.bg-extend-left').forEach(el => {
      const elemPos = el.offsetTop - 50
      if (scroll >= elemPos - windowH) {
        el.classList.add('is-animated')
      }
    })

    // 背景伸びアニメーション（右から）
    document.querySelectorAll('.bg-extend-right').forEach(el => {
      const elemPos = el.offsetTop - 50
      if (scroll >= elemPos - windowH) {
        el.classList.add('is-animated')
      }
    })

    // コンテンツ出現
    document.querySelectorAll('.content-appear').forEach(el => {
      const elemPos = el.offsetTop - 50
      if (scroll >= elemPos - windowH) {
        el.classList.add('is-visible')
      }
    })

    // サービスエリアの背景
    document.querySelectorAll('.service-grid').forEach(el => {
      const elemPos = el.offsetTop - 50
      if (scroll >= elemPos - windowH) {
        el.classList.add('is-animated')
      }
    })

    // ズーム回転
    document.querySelectorAll('.zoom-rotate').forEach(el => {
      const elemPos = el.offsetTop - 50
      if (scroll >= elemPos - windowH) {
        el.classList.add('is-animated')
      }
    })
  }

  /*---------------------------------------------------------------
    タイピングエフェクト（シンプル版）
  ---------------------------------------------------------------*/
  const initTypingEffect = () => {
    const elements = document.querySelectorAll('.typing-text')

    elements.forEach(el => {
      const text = el.textContent || ''
      el.textContent = ''
      el.classList.add('is-typed')

      let i = 0
      const typeChar = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i)
          i++
          setTimeout(typeChar, 50)
        }
      }
      typeChar()
    })
  }

  const handleTypingOnScroll = () => {
    const windowH = window.innerHeight
    const scroll = window.scrollY

    document.querySelectorAll('.typing-text:not(.is-typed)').forEach(el => {
      const elemPos = el.offsetTop - 50
      if (scroll >= elemPos - windowH) {
        const text = el.textContent || ''
        el.textContent = ''
        el.classList.add('is-typed')

        let i = 0
        const typeChar = () => {
          if (i < text.length) {
            el.textContent += text.charAt(i)
            i++
            setTimeout(typeChar, 50)
          }
        }
        typeChar()
      }
    })
  }

  /*---------------------------------------------------------------
    初期化
  ---------------------------------------------------------------*/
  const init = () => {
    initNavigation()
    initHeaderScroll()
    initHeroSlideshow()
    initPageTop()
    initTabs()
    initSearch()
    initLightbox()

    window.addEventListener('scroll', () => {
      handleScrollAnimations()
      handleTypingOnScroll()
    }, { passive: true })
  }

  window.addEventListener('load', () => {
    initSplash()
    init()
  })
})()
