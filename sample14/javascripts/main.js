/*=====================================================================
  科学的なサイト - メインスクリプト
=====================================================================*/

(() => {
  'use strict'

  /* ローディング画面（テキストアニメーション） */
  const initSplash = () => {
    const splash = document.getElementById('splash')
    const textEl = document.querySelector('.splash-text')
    if (!splash || !textEl) return

    const text = 'Science Labo'
    textEl.innerHTML = text.split('').map((char, i) => 
      `<span style="animation-delay: ${i * 0.1}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('')

    setTimeout(() => {
      document.body.classList.add('loaded')
      setTimeout(() => {
        splash.style.display = 'none'
        initParticles()
        initWave()
      }, 500)
    }, 2000)
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

  /* ヘッダースクロール */
  const initHeaderScroll = () => {
    const header = document.getElementById('header')
    if (!header) return

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('is-scrolled')
      } else {
        header.classList.remove('is-scrolled')
      }
    }, { passive: true })
  }

  /* パーティクル背景 */
  const initParticles = () => {
    const container = document.getElementById('particles-js')
    if (!container) return

    const canvas = document.createElement('canvas')
    container.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = []
    const particleCount = 80

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 191, 255, 0.5)'
        ctx.fill()

        // 近い粒子を線で繋ぐ
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 191, 255, ${0.2 * (1 - dist / 150)})`
            ctx.stroke()
          }
        }
      })

      requestAnimationFrame(animate)
    }
    animate()
  }

  /* 波形アニメーション */
  const initWave = () => {
    const canvas = document.getElementById('wave-canvas')
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = 150
    }
    resize()
    window.addEventListener('resize', resize)

    let phase = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      for (let x = 0; x <= canvas.width; x++) {
        const y = Math.sin((x * 0.01) + phase) * 20 +
                  Math.sin((x * 0.02) + phase * 1.5) * 15 + 50
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(0, 191, 255, 0.1)'
      ctx.fill()

      phase += 0.02
      requestAnimationFrame(draw)
    }
    draw()
  }

  /* カウントアップ */
  const initCountUp = () => {
    const countEl = document.querySelector('.count-number')
    if (!countEl) return

    const target = parseInt(countEl.dataset.count || '0', 10)
    let current = 0
    let hasAnimated = false

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true
          const duration = 2000
          const step = target / (duration / 16)

          const animate = () => {
            current += step
            if (current < target) {
              countEl.textContent = Math.floor(current)
              requestAnimationFrame(animate)
            } else {
              countEl.textContent = target
            }
          }
          animate()
        }
      })
    }, { threshold: 0.5 })

    observer.observe(countEl)
  }

  /* チャート */
  const initCharts = () => {
    const pieCanvas = document.getElementById('chart-pie')
    const barCanvas = document.getElementById('chart-bar')

    if (pieCanvas) {
      const ctx = pieCanvas.getContext('2d')
      drawPieChart(ctx, pieCanvas)
    }

    if (barCanvas) {
      const ctx = barCanvas.getContext('2d')
      drawBarChart(ctx, barCanvas)
    }
  }

  const drawPieChart = (ctx, canvas) => {
    const data = [
      { value: 40, color: '#00bfff', label: '基礎研究' },
      { value: 30, color: '#48929b', label: '応用研究' },
      { value: 20, color: '#1e3a5f', label: '開発' },
      { value: 10, color: '#adb5bd', label: 'その他' }
    ]

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    let startAngle = -Math.PI / 2
    const total = data.reduce((sum, d) => sum + d.value, 0)

    data.forEach(d => {
      const sliceAngle = (d.value / total) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = d.color
      ctx.fill()
      startAngle += sliceAngle
    })
  }

  const drawBarChart = (ctx, canvas) => {
    const data = [
      { label: '2020', value: 150 },
      { label: '2021', value: 220 },
      { label: '2022', value: 280 },
      { label: '2023', value: 350 },
      { label: '2024', value: 395 }
    ]

    const padding = 40
    const barWidth = (canvas.width - padding * 2) / data.length - 20
    const maxValue = Math.max(...data.map(d => d.value))

    ctx.fillStyle = '#adb5bd'
    ctx.font = '12px sans-serif'

    data.forEach((d, i) => {
      const barHeight = (d.value / maxValue) * (canvas.height - padding * 2)
      const x = padding + i * (barWidth + 20) + 10
      const y = canvas.height - padding - barHeight

      ctx.fillStyle = '#00bfff'
      ctx.fillRect(x, y, barWidth, barHeight)

      ctx.fillStyle = '#adb5bd'
      ctx.textAlign = 'center'
      ctx.fillText(d.label, x + barWidth / 2, canvas.height - 10)
      ctx.fillText(d.value, x + barWidth / 2, y - 10)
    })
  }

  /* スクロールアニメーション */
  const handleScrollAnimations = () => {
    const triggers = document.querySelectorAll('.fade-down, .smooth-appear, .zoom-out, .random-text')
    const windowH = window.innerHeight

    triggers.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top < windowH - 50) {
        el.classList.add('is-visible')
      }
    })
  }

  /* ランダムテキスト */
  const initRandomText = () => {
    document.querySelectorAll('.random-text').forEach(el => {
      const text = el.textContent || ''
      el.innerHTML = text.split('').map(char => 
        `<span style="animation-delay: ${Math.random() * 0.5}s">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('')
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
    initHeaderScroll()
    initCountUp()
    initCharts()
    initRandomText()
    initPageTop()
    window.addEventListener('scroll', handleScrollAnimations, { passive: true })
    handleScrollAnimations()
  }

  window.addEventListener('load', () => {
    initSplash()
    init()
  })
})()
