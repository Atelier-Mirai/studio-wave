/*=====================================================================
  ECサイト（フラワーショップ） - メインスクリプト
=====================================================================*/

(() => {
  "use strict";

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

  /* セールモーダル */
  const initSaleModal = () => {
    const trigger = document.querySelector(".sale-trigger");
    const modal = document.getElementById("sale-modal");
    const closeBtn = modal?.querySelector(".modal-close");

    if (!trigger || !modal) return;

    // 初回訪問時に自動表示（セッションストレージで制御）
    if (!sessionStorage.getItem("saleModalShown")) {
      setTimeout(() => {
        modal.classList.add("is-active");
        sessionStorage.setItem("saleModalShown", "true");
      }, 1000);
    }

    trigger.addEventListener("click", () => {
      modal.classList.add("is-active");
    });

    closeBtn?.addEventListener("click", () => {
      modal.classList.remove("is-active");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("is-active");
      }
    });
  };

  /* タブ切替 */
  const initTabs = () => {
    const tabs = document.querySelectorAll(".tab-item");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("is-active"));
        contents.forEach((c) => c.classList.remove("is-active"));
        tab.classList.add("is-active");
        contents[i]?.classList.add("is-active");
      });
    });
  };

  /* アコーディオン */
  const initAccordion = () => {
    const titles = document.querySelectorAll(".accordion-title");

    titles.forEach((title) => {
      title.addEventListener("click", () => {
        const item = title.closest(".accordion-item");
        item?.classList.toggle("is-open");
      });
    });
  };

  /* サムネイルギャラリー */
  const initGallery = () => {
    const thumbs = document.querySelectorAll(".thumb-item");
    const mainImages = document.querySelectorAll(".gallery-main img");

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener("click", () => {
        thumbs.forEach((t) => t.classList.remove("is-active"));
        mainImages.forEach((img) => img.classList.remove("is-active"));
        thumb.classList.add("is-active");
        mainImages[i]?.classList.add("is-active");
      });
    });
  };

  /* スクロールアニメーション */
  const handleScrollAnimations = () => {
    const triggers = document.querySelectorAll(
      ".fade-up, .fade-down, .rotate-in",
    );
    const windowH = window.innerHeight;

    triggers.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH - 50) {
        el.classList.add("is-visible");
      }
    });
  };

  /* ページトップ */
  const initPageTop = () => {
    const btn = document.getElementById("page-top");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  /* 初期化 */
  window.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSaleModal();
    initTabs();
    initAccordion();
    initGallery();
    initPageTop();
    handleScrollAnimations();
    window.addEventListener("scroll", handleScrollAnimations, {
      passive: true,
    });
  });
})();
