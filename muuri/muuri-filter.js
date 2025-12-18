/*=====================================================================
  Muuri 絞り込み用（モダン ES6+ 版）

  検索ボックスとフィルター選択でグリッドアイテムを絞り込みます。
=====================================================================*/

/**
 * 設定値
 */
const CONFIG = {
  selectors: {
    wrapper: ".grid-wrapper",
    searchField: ".search-field",
    filterField: ".filter-field",
    grid: ".grid",
  },
  attributes: {
    search: "data-title",
    filter: "data-color",
  },
};

/**
 * Muuri グリッドとフィルター機能を初期化
 */
const initMuuriGrid = () => {
  const wrapper = document.querySelector(CONFIG.selectors.wrapper);
  if (!wrapper) return;

  const searchField = wrapper.querySelector(CONFIG.selectors.searchField);
  const filterField = wrapper.querySelector(CONFIG.selectors.filterField);
  const gridElem = wrapper.querySelector(CONFIG.selectors.grid);

  if (!gridElem) return;

  // Muuri グリッドを初期化
  const grid = new Muuri(gridElem, {
    dragEnabled: false,
    layout: {
      horizontal: false,
      alignRight: false,
      alignBottom: false,
      fillGaps: false,
    },
  });

  // 現在のフィルター値を保持
  let currentSearchValue = searchField?.value.toLowerCase() ?? "";
  let currentFilterValue = filterField?.value ?? "";

  /**
   * グリッドアイテムをフィルタリング
   */
  const applyFilter = () => {
    currentFilterValue = filterField?.value ?? "";

    grid.filter((item) => {
      const element = item.getElement();
      const titleText = element.getAttribute(CONFIG.attributes.search) ?? "";
      const colorValue = element.getAttribute(CONFIG.attributes.filter) ?? "";

      // 検索マッチ判定
      const isSearchMatch =
        !currentSearchValue ||
        titleText.toLowerCase().includes(currentSearchValue);

      // フィルターマッチ判定
      const isFilterMatch =
        !currentFilterValue || colorValue === currentFilterValue;

      return isSearchMatch && isFilterMatch;
    });
  };

  // 検索フィールドのイベント（デバウンス付き）
  let searchTimeout = null;
  searchField?.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const newValue = e.target.value.toLowerCase();
      if (currentSearchValue !== newValue) {
        currentSearchValue = newValue;
        applyFilter();
      }
    }, 150); // 150ms のデバウンス
  });

  // フィルター選択のイベント
  filterField?.addEventListener("change", applyFilter);
};

// DOM 読み込み完了後に初期化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMuuriGrid);
} else {
  initMuuriGrid();
}
