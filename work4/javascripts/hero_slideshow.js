const HERO_IMAGES = [
  { src: "images/sea01.webp", alt: "海の写真1" },
  { src: "images/sea02.webp", alt: "海の写真2" },
  { src: "images/sea03.webp", alt: "海の写真3" },
  { src: "images/sea04.webp", alt: "海の写真4" },
  { src: "images/sea05.webp", alt: "海の写真5" },
  { src: "images/sea06.webp", alt: "海の写真6" },
  { src: "images/sea07.webp", alt: "海の写真7" },
]

const HERO_SLIDE_INTERVAL = 5000 // ミリ秒: 1枚あたりの表示時間

window.addEventListener("load", () => {
  const hero = document.querySelector(".hero")
  if (!hero || HERO_IMAGES.length === 0) return

  // 既存の静的画像はスライドショーに置き換える
  hero.innerHTML = ""

  HERO_IMAGES.forEach((info, index) => {
    const img = document.createElement("img")
    img.alt = info.alt
    if (index === 0) {
      // 1枚目だけ最初から読み込んで表示
      img.src = info.src
      img.classList.add("is-active")
      img.dataset.loaded = "true"
    } else {
      // 2枚目以降は data-src に入れておき、必要になったタイミングで読み込む
      img.dataset.src = info.src
      img.dataset.loaded = "false"
    }
    hero.appendChild(img)
  })

  const slides = hero.querySelectorAll("img")
  if (slides.length <= 1) return

  let current = 0
  setInterval(() => {
    const currentSlide = slides[current]
    currentSlide.classList.remove("is-active")
    current = (current + 1) % slides.length
    const nextSlide = slides[current]
    // 初めて表示するときにだけ src を設定して読み込む
    if (nextSlide.dataset.loaded !== "true") {
      const dataSrc = nextSlide.dataset.src
      if (dataSrc) {
        nextSlide.src = dataSrc
      }
      nextSlide.dataset.loaded = "true"
    }
    nextSlide.classList.add("is-active")
  }, HERO_SLIDE_INTERVAL)
})
