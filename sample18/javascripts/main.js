(() => {
  'use strict'

  const initSplash = () => {
    const splash = document.getElementById('splash')
    if (!splash) return

    window.setTimeout(() => {
      splash.classList.add('is-hidden')
      document.body.classList.add('appear')
    }, 1500)
  }

  const initNavPopover = () => {
    const toggle = document.querySelector('.nav-toggle')
    const popover = document.getElementById('global-nav')
    if (!toggle || !popover) return

    const updateExpanded = () => {
      const isOpen = popover.matches(':popover-open')
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    }

    popover.addEventListener('toggle', updateExpanded)
    updateExpanded()

    popover.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        popover.hidePopover?.()
      })
    })
  }

  const initHeaderAutoHide = () => {
    const header = document.querySelector('[data-header]')
    if (!header) return

    let lastY = window.scrollY

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY

      if (currentY < 80) {
        header.classList.remove('is-hidden')
        lastY = currentY
        return
      }

      if (delta > 10) {
        header.classList.add('is-hidden')
      }

      if (delta < -10) {
        header.classList.remove('is-hidden')
      }

      lastY = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
  }

  const loadHeroSlide = slide => {
    if (!slide || slide.dataset.loaded === 'true') return

    const source = slide.querySelector('source[data-srcset]')
    if (source?.dataset.srcset) {
      source.srcset = source.dataset.srcset
      source.removeAttribute('data-srcset')
    }

    const img = slide.querySelector('img[data-src]')
    if (img?.dataset.src) {
      img.src = img.dataset.src
      img.removeAttribute('data-src')
    }

    slide.dataset.loaded = 'true'
  }

  const initHeroSlider = () => {
    const hero = document.querySelector('[data-hero]')
    if (!hero) return

    const slides = Array.from(hero.querySelectorAll('.hero-slide'))
    if (slides.length <= 1) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      slides.forEach(loadHeroSlide)
      return
    }

    let current = slides.findIndex(slide => slide.classList.contains('is-active'))
    if (current < 0) current = 0

    window.setInterval(() => {
      slides[current]?.classList.remove('is-active')
      current = (current + 1) % slides.length
      const next = slides[current]
      loadHeroSlide(next)
      next.classList.add('is-active')
    }, 9000)
  }

  const initReveal = () => {
    const targets = document.querySelectorAll('[data-reveal]')
    if (targets.length === 0) return

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        obs.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 })

    targets.forEach(target => observer.observe(target))
  }

  const initServiceRandomReveal = () => {
    const grid = document.querySelector('.service-grid')
    if (!grid) return

    const links = Array.from(grid.querySelectorAll('.service-link'))
    if (links.length === 0) return

    const shuffled = [...links].sort(() => Math.random() - 0.5)

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        shuffled.forEach((link, i) => {
          window.setTimeout(() => {
            link.classList.add('is-visible')
          }, i * 120)
        })

        observer.disconnect()
      })
    }, { threshold: 0.3 })

    observer.observe(grid)
  }

  const initTimelineReveal = () => {
    const items = document.querySelectorAll('.timeline-item')
    if (items.length === 0) return

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        obs.unobserve(entry.target)
      })
    }, { threshold: 0.4 })

    items.forEach(item => observer.observe(item))
  }

  const initPageTop = () => {
    const button = document.querySelector('[data-page-top]')
    if (!button) return

    const toggleVisibility = () => {
      button.classList.toggle('is-visible', window.scrollY > 500)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    toggleVisibility()

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  window.addEventListener('load', () => {
    initSplash()
    initNavPopover()
    initHeaderAutoHide()
    initHeroSlider()
    initReveal()
    initServiceRandomReveal()
    initTimelineReveal()
    initPageTop()
  })
})()
