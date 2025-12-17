(() => {
  'use strict'

  const setPathLengths = svg => {
    if (!svg) return

    svg.querySelectorAll('path').forEach(path => {
      const length = Math.ceil(path.getTotalLength())
      path.style.setProperty('--path-length', String(length))
    })
  }

  const initSplash = () => {
    const splash = document.getElementById('splash')
    if (!splash) return

    setPathLengths(splash.querySelector('svg'))

    window.setTimeout(() => {
      splash.classList.add('is-hidden')
      document.body.classList.add('appear')
    }, 3000)
  }

  const initNavPopover = () => {
    const toggle = document.querySelector('.nav-toggle')
    const popover = document.getElementById('global-nav')
    const tel = document.querySelector('[data-reserve-tel]')

    if (!toggle || !popover) return

    const updateExpanded = () => {
      const isOpen = popover.matches(':popover-open')
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
      tel?.classList.toggle('is-active', isOpen)
    }

    popover.addEventListener('toggle', updateExpanded)
    updateExpanded()

    popover.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        popover.hidePopover?.()
      })
    })
  }

  const initHeroSlider = () => {
    const hero = document.querySelector('[data-hero]')
    if (!hero) return

    const slides = Array.from(hero.querySelectorAll('.hero-slide'))
    if (slides.length <= 1) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let current = slides.findIndex(slide => slide.classList.contains('is-active'))
    if (current < 0) current = 0

    window.setInterval(() => {
      slides[current]?.classList.remove('is-active')
      current = (current + 1) % slides.length
      slides[current]?.classList.add('is-active')
    }, 3200)
  }

  const initParallax = () => {
    const targets = Array.from(document.querySelectorAll('.menu-bg, .access-bg'))
    if (targets.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const speed = 0.18
    let ticking = false

    const update = () => {
      for (const el of targets) {
        const rect = el.getBoundingClientRect()
        const maxShift = rect.height * 0.18
        const raw = rect.top * speed
        const clamped = Math.max(-maxShift, Math.min(maxShift, raw))
        el.style.setProperty('--parallax-y', `${Math.round(clamped)}px`)
      }
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
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
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.25 })

    targets.forEach(el => observer.observe(el))
  }

  const initPageTop = () => {
    const button = document.querySelector('[data-page-top]')
    if (!button) return

    const toggleVisibility = () => {
      button.classList.toggle('is-visible', window.scrollY > 200)
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
    initHeroSlider()
    initParallax()
    initReveal()
    initPageTop()

    setPathLengths(document.querySelector('.lead-mark svg'))
  })
})()
