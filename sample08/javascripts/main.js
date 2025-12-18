/*=====================================================================
  女性向けエステサロンサイト - メインスクリプト
  バニラ JS で実装（jQuery 不使用）
=====================================================================*/

(() => {
  "use strict";

  /*---------------------------------------------------------------
    ローディング画面（スプラッシュ）
  ---------------------------------------------------------------*/
  const initSplash = () => {
    const splash = document.getElementById("splash");
    const splashLogo = document.querySelector(".splash-logo");
    if (!splash) return;

    // ロゴをフェードアウト後、スプラッシュ全体を非表示に
    setTimeout(() => {
      if (splashLogo) {
        splashLogo.style.transition = "opacity 0.5s";
        splashLogo.style.opacity = "0";
      }
    }, 1200);

    setTimeout(() => {
      splash.style.transition = "opacity 0.5s";
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.display = "none";
        document.body.classList.add("appear");
        // グロウテキストの初期化
        initGlowText();
        // スクロールアニメーションを一度実行
        handleScrollAnimations();
      }, 500);
    }, 1500);
  };

  /*---------------------------------------------------------------
    ハンバーガーメニュー
  ---------------------------------------------------------------*/
  const initNavigation = () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const globalNav = document.getElementById("global-nav");
    const navLinks = globalNav?.querySelectorAll("a");
    const blurTargets = document.querySelectorAll(
      "#header, #container, #footer",
    );

    if (!menuToggle || !globalNav) return;

    // メニュートグル
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("is-active");
      globalNav.classList.toggle("is-active");
      blurTargets.forEach((el) => el.classList.toggle("is-blurred"));
    });

    // ナビリンククリックでメニューを閉じる
    navLinks?.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("is-active");
        globalNav.classList.remove("is-active");
        blurTargets.forEach((el) => el.classList.remove("is-blurred"));
      });
    });
  };

  /*---------------------------------------------------------------
    ページトップボタン
  ---------------------------------------------------------------*/
  const initPageTop = () => {
    const pageTop = document.getElementById("page-top");
    const blog = document.getElementById("blog");
    const footer = document.getElementById("footer");

    if (!pageTop) return;

    // スムーズスクロール
    pageTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 表示範囲のチェック
    const checkVisibility = () => {
      const scroll = window.scrollY;
      const windowH = window.innerHeight;

      const blogTop = blog?.offsetTop ?? Infinity;
      const blogH = blog?.offsetHeight ?? 0;
      const footerTop = footer?.offsetTop ?? Infinity;
      const footerH = footer?.offsetHeight ?? 0;

      const inBlogRange =
        scroll + windowH >= blogTop && scroll + windowH <= blogTop + blogH;
      const inFooterRange =
        scroll + windowH >= footerTop &&
        scroll + windowH <= footerTop + footerH;

      if (inBlogRange || inFooterRange) {
        pageTop.classList.add("is-visible");
        pageTop.classList.remove("is-hidden");
        pageTop.classList.remove("initially-hidden");
      } else if (!pageTop.classList.contains("initially-hidden")) {
        pageTop.classList.add("is-hidden");
        pageTop.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
  };

  /*---------------------------------------------------------------
    ヘッダー背景のパララックス効果
  ---------------------------------------------------------------*/
  const initHeaderParallax = () => {
    const headerBg = document.querySelector(".header-bg");
    if (!headerBg) return;

    const updateParallax = () => {
      const scroll = window.scrollY;
      const scale = (100 + scroll / 10) / 100;
      const top = -(scroll / 50);
      headerBg.style.transform = `scale(${scale})`;
      headerBg.style.top = `${top}%`;
    };

    window.addEventListener("scroll", updateParallax, { passive: true });
  };

  /*---------------------------------------------------------------
    スクロールアニメーション
  ---------------------------------------------------------------*/
  const handleScrollAnimations = () => {
    const windowH = window.innerHeight;
    const scroll = window.scrollY;

    // フェードインアニメーション
    document.querySelectorAll(".fade-trigger").forEach((el) => {
      const elemPos = el.offsetTop - 50;
      if (scroll >= elemPos - windowH) {
        el.classList.add("fade-in");
      } else {
        el.classList.remove("fade-in");
      }
    });

    // ズームアウトアニメーション
    document.querySelectorAll(".zoom-trigger").forEach((el) => {
      const elemPos = el.offsetTop;
      if (scroll >= elemPos - windowH) {
        el.classList.add("zoom-out");
      } else {
        el.classList.remove("zoom-out");
      }
    });

    // スライドアニメーション（左から）
    document.querySelectorAll(".slide-left").forEach((el) => {
      const elemPos = el.offsetTop - 50;
      if (scroll >= elemPos - windowH) {
        el.classList.add("is-animated");
      } else {
        el.classList.remove("is-animated");
      }
    });

    // ぼかしアニメーション
    document.querySelectorAll(".blur-trigger").forEach((el) => {
      const elemPos = el.offsetTop - 50;
      if (scroll >= elemPos - windowH) {
        el.classList.add("blur-in");
      } else {
        el.classList.remove("blur-in");
      }
    });

    // グロウアニメーション
    document.querySelectorAll(".glow-text").forEach((el) => {
      const elemPos = el.offsetTop - 50;
      if (scroll >= elemPos - windowH) {
        el.classList.add("is-glowing");
      } else {
        el.classList.remove("is-glowing");
      }
    });
  };

  /*---------------------------------------------------------------
    グロウテキストの初期化
    各文字を span で囲み、遅延アニメーションを設定
  ---------------------------------------------------------------*/
  const initGlowText = () => {
    document.querySelectorAll(".glow-text").forEach((el) => {
      const text = el.textContent ?? "";
      let html = "";
      text.split("").forEach((char, i) => {
        if (char !== " ") {
          const delay = i < 10 ? `.${i}s` : `${i / 10}s`;
          html += `<span style="animation-delay: ${delay}">${char}</span>`;
        } else {
          html += char;
        }
      });
      el.innerHTML = html;
    });
  };

  /*---------------------------------------------------------------
    スライダー
    CSS スクロールスナップベースのシンプルな実装
  ---------------------------------------------------------------*/
  const initSlider = () => {
    const container = document.querySelector(".slider-container");
    const track = document.querySelector(".slider-track");
    const prevBtn = document.querySelector(".slider-prev");
    const nextBtn = document.querySelector(".slider-next");
    const dotsContainer = document.querySelector(".slider-dots");

    if (!track) return;

    const slides = track.querySelectorAll(".menu-card");
    const slideCount = slides.length;

    // 表示枚数を画面幅に応じて決定
    const getSlidesToShow = () => {
      const width = window.innerWidth;
      if (width <= 426) return 1;
      if (width <= 769) return 2;
      if (width <= 1200) return 3;
      return 4;
    };

    let currentIndex = 0;

    // ドットを生成
    const createDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      const slidesToShow = getSlidesToShow();
      const dotCount = Math.ceil(slideCount / slidesToShow);

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement("button");
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", `スライド ${i + 1}`);
        if (i === 0) dot.classList.add("is-active");
        dot.addEventListener("click", () => goToSlide(i * slidesToShow));
        dotsContainer.appendChild(dot);
      }
    };

    // スライドへ移動
    const goToSlide = (index) => {
      const slidesToShow = getSlidesToShow();
      const maxIndex = Math.max(0, slideCount - slidesToShow);
      currentIndex = Math.max(0, Math.min(index, maxIndex));

      const slideWidth = slides[0]?.offsetWidth ?? 0;
      const gap = 20;
      track.scrollTo({
        left: currentIndex * (slideWidth + gap),
        behavior: "smooth",
      });

      updateDots();
    };

    // ドットの状態を更新
    const updateDots = () => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll(".slider-dot");
      const slidesToShow = getSlidesToShow();
      const activeIndex = Math.floor(currentIndex / slidesToShow);

      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
      });
    };

    // 前へ
    prevBtn?.addEventListener("click", () => {
      const slidesToShow = getSlidesToShow();
      goToSlide(currentIndex - slidesToShow);
    });

    // 次へ
    nextBtn?.addEventListener("click", () => {
      const slidesToShow = getSlidesToShow();
      goToSlide(currentIndex + slidesToShow);
    });

    // 自動スライド
    let autoSlideInterval = setInterval(() => {
      const slidesToShow = getSlidesToShow();
      const maxIndex = Math.max(0, slideCount - slidesToShow);
      if (currentIndex >= maxIndex) {
        goToSlide(0);
      } else {
        goToSlide(currentIndex + slidesToShow);
      }
    }, 5000);

    // ホバー時は自動スライド停止
    container?.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });

    container?.addEventListener("mouseleave", () => {
      autoSlideInterval = setInterval(() => {
        const slidesToShow = getSlidesToShow();
        const maxIndex = Math.max(0, slideCount - slidesToShow);
        if (currentIndex >= maxIndex) {
          goToSlide(0);
        } else {
          goToSlide(currentIndex + slidesToShow);
        }
      }, 5000);
    });

    // リサイズ時にドットを再生成
    window.addEventListener("resize", createDots);

    // 初期化
    createDots();
  };

  /*---------------------------------------------------------------
    初期化
  ---------------------------------------------------------------*/
  const init = () => {
    initNavigation();
    initPageTop();
    initHeaderParallax();
    initSlider();

    window.addEventListener("scroll", handleScrollAnimations, {
      passive: true,
    });
  };

  // ページ読み込み完了時
  window.addEventListener("load", () => {
    initSplash();
    init();
  });
})();
