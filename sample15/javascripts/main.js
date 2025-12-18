/*=====================================================================
  ギャラリーサイト - メインスクリプト
=====================================================================*/

(() => {
  "use strict";

  /* ローディング画面 */
  const initSplash = () => {
    const splash = document.getElementById("splash");
    const textEl = document.querySelector(".splash-text");
    if (!splash || !textEl) return;

    const text = "Ryoko Kubota";
    textEl.innerHTML = text
      .split("")
      .map(
        (char, i) =>
          `<span style="animation-delay: ${i * 0.1}s">${char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("");

    setTimeout(() => {
      document.body.classList.add("loaded");
      setTimeout(() => {
        splash.style.display = "none";
        initHeroSlideshow();
        initGalleryAnimation();
      }, 800);
    }, 2000);
  };

  /* ナビゲーション */
  const initNavigation = () => {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("global-nav");
    const links = nav?.querySelectorAll("a");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      toggle.classList.toggle("is-active");
      nav.classList.toggle("is-active");
    });

    links?.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("is-active");
        nav.classList.remove("is-active");
      });
    });
  };

  /* ヒーロースライドショー */
  const initHeroSlideshow = () => {
    const container = document.querySelector(".hero-slideshow");
    if (!container) return;

    const images = container.querySelectorAll("img");
    if (images.length <= 1) return;

    let current = 0;
    images[0]?.classList.add("is-active");

    setInterval(() => {
      images[current].classList.remove("is-active");
      current = (current + 1) % images.length;
      images[current].classList.add("is-active");
    }, 5000);
  };

  /* ギャラリーフィルター */
  const initGalleryFilter = () => {
    const buttons = document.querySelectorAll(".filter-buttons button");
    const items = document.querySelectorAll(".gallery-item");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        items.forEach((item) => {
          if (filter === "all" || item.dataset.category === filter) {
            item.hidden = false;
            setTimeout(() => item.classList.add("is-visible"), 50);
          } else {
            item.classList.remove("is-visible");
            setTimeout(() => {
              item.hidden = true;
            }, 300);
          }
        });
      });
    });
  };

  /* ギャラリー出現アニメーション */
  const initGalleryAnimation = () => {
    const items = document.querySelectorAll(".gallery-item");
    items.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add("is-visible");
      }, i * 50);
    });
  };

  /* ライトボックス */
  const initLightbox = () => {
    const galleryLinks = document.querySelectorAll(".gallery-item a");
    const overlay = document.getElementById("lightbox-overlay");
    const content = overlay?.querySelector(".lightbox-content img");
    const caption = overlay?.querySelector(".lightbox-caption");
    const closeBtn = overlay?.querySelector(".lightbox-close");
    const prevBtn = overlay?.querySelector(".lightbox-nav.prev");
    const nextBtn = overlay?.querySelector(".lightbox-nav.next");

    if (!overlay || galleryLinks.length === 0) return;

    let currentIndex = 0;
    const items = Array.from(galleryLinks);

    const open = (index) => {
      currentIndex = index;
      const link = items[index];
      if (content) content.src = link.href;
      if (caption) caption.textContent = link.dataset.caption || "";
      overlay.classList.add("is-active");
    };

    const close = () => overlay.classList.remove("is-active");
    const prev = () => open((currentIndex - 1 + items.length) % items.length);
    const next = () => open((currentIndex + 1) % items.length);

    galleryLinks.forEach((link, i) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        open(i);
      });
    });

    closeBtn?.addEventListener("click", close);
    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);

    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("is-active")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
  };

  /* スクロール / ページトップ */
  const initScrollLinks = () => {
    const scrollLink = document.querySelector(".scroll-link");
    const pageTopLink = document.querySelector(".page-top-link");

    window.addEventListener(
      "scroll",
      () => {
        const scrolled = window.scrollY > 300;

        scrollLink?.classList.toggle("is-hidden", scrolled);
        pageTopLink?.classList.toggle("is-visible", scrolled);
      },
      { passive: true },
    );

    pageTopLink?.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  /* 初期化 */
  window.addEventListener("load", () => {
    initSplash();
    initNavigation();
    initGalleryFilter();
    initLightbox();
    initScrollLinks();
  });
})();
