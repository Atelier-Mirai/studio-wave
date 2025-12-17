/*=====================================================================
  ポートフォリオサイト - メインスクリプト
=====================================================================*/

(() => {
  'use strict'

  /* ローディング画面 */
  const initSplash = () => {
    const splash = document.getElementById('splash')
    if (!splash) return

    setTimeout(() => {
      document.body.classList.add('loaded')
      setTimeout(() => {
        initSectionAnimations()
      }, 800)
    }, 1500)
  }

  /* セクションナビ */
  const initSectionNav = () => {
    const sections = document.querySelectorAll('.section, #header')
    const navLinks = document.querySelectorAll('.section-nav a')

    const updateNav = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2

      sections.forEach((section, i) => {
        const top = section.offsetTop
        const bottom = top + section.offsetHeight

        if (scrollPos >= top && scrollPos < bottom) {
          navLinks.forEach(link => link.classList.remove('is-active'))
          navLinks[i]?.classList.add('is-active')
        }
      })
    }

    window.addEventListener('scroll', updateNav, { passive: true })
    updateNav()

    navLinks.forEach((link, i) => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        sections[i]?.scrollIntoView({ behavior: 'smooth' })
      })
    })
  }

  /* セクションアニメーション */
  const initSectionAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.blur-in, .text-animate').forEach((el, i) => {
            setTimeout(() => el.classList.add('is-visible'), i * 200)
          })
        }
      })
    }, { threshold: 0.3 })

    document.querySelectorAll('.section, #header').forEach(section => {
      observer.observe(section)
    })
  }

  /* テキストアニメーション準備 */
  const initTextAnimate = () => {
    document.querySelectorAll('.text-animate').forEach(el => {
      const text = el.textContent || ''
      el.innerHTML = text.split('').map((char, i) => 
        `<span style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('')
    })
  }

  /* モーダル */
  const initModals = () => {
    const triggers = document.querySelectorAll('[data-modal]')
    const closeButtons = document.querySelectorAll('.modal-close')

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault()
        const modalId = trigger.dataset.modal
        const modal = document.getElementById(modalId)
        modal?.classList.add('is-active')
        document.body.style.overflow = 'hidden'
      })
    })

    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay')
        modal?.classList.remove('is-active')
        document.body.style.overflow = ''
      })
    })

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-active')
          document.body.style.overflow = ''
        }
      })
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.is-active').forEach(modal => {
          modal.classList.remove('is-active')
          document.body.style.overflow = ''
        })
      }
    })
  }

  /* 初期化 */
  window.addEventListener('load', () => {
    initTextAnimate()
    initSplash()
    initSectionNav()
    initModals()
  })
})()
