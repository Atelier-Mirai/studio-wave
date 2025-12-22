/*=====================================================================
  Shuffle.js 絞り込み
=====================================================================*/

const CONFIG = {
  selectors: {
    wrapper: ".grid-wrapper",
    searchField: ".search-field",
    filterField: ".filter-field",
    priceMin: ".price-min",
    priceMax: ".price-max",
    priceReset: ".price-reset",
    grid: ".grid",
  },
  attributes: {
    search: "data-title",
    filter: "data-groups",
    price: "data-price",
  },
};

const parsePriceFromText = (text) => {
  if (!text) return NaN;
  const match = text.match(/(\d+)\s*円/);
  return match ? Number(match[1]) : NaN;
};

const initShuffleGrid = () => {
  const wrapper = document.querySelector(CONFIG.selectors.wrapper);
  if (!wrapper) return;

  const searchField = wrapper.querySelector(CONFIG.selectors.searchField);
  const filterField = wrapper.querySelector(CONFIG.selectors.filterField);
  const priceMinField = wrapper.querySelector(CONFIG.selectors.priceMin);
  const priceMaxField = wrapper.querySelector(CONFIG.selectors.priceMax);
  const priceResetButton = wrapper.querySelector(CONFIG.selectors.priceReset);
  const gridElem = wrapper.querySelector(CONFIG.selectors.grid);
  if (!gridElem) return;

  const sizerElem = gridElem.querySelector(".grid-sizer");

  // Shuffle.js を初期化
  const shuffleInstance = new window.Shuffle(gridElem, {
    itemSelector: ".item",
    sizer: sizerElem ?? null,
    buffer: 1,
  });

  let currentSearchValue = "";
  let currentFilterValue = "";
  let currentPriceMin = null;
  let currentPriceMax = null;

  const getPriceCache = (element) => {
    const cached = element.getAttribute(CONFIG.attributes.price);
    if (cached) return Number(cached);
    const titleText = element.getAttribute(CONFIG.attributes.search) ?? "";
    const parsed = parsePriceFromText(titleText);
    if (!Number.isNaN(parsed)) {
      element.setAttribute(CONFIG.attributes.price, String(parsed));
      return parsed;
    }
    return NaN;
  };

  const filterByBoth = () => {
    shuffleInstance.filter((element) => {
      const title = (element.getAttribute("data-title") ?? "").toLowerCase();
      const groups = element.getAttribute("data-groups");
      const price = getPriceCache(element);

      const matchesSearch =
        !currentSearchValue || title.includes(currentSearchValue);
      const matchesCategory =
        !currentFilterValue || (groups && groups.includes(currentFilterValue));
      const matchesPrice =
        (currentPriceMin === null || (!Number.isNaN(price) && price >= currentPriceMin)) &&
        (currentPriceMax === null || (!Number.isNaN(price) && price <= currentPriceMax));
      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  searchField?.addEventListener("input", (event) => {
    currentSearchValue = event.target.value.trim().toLowerCase();
    window.clearTimeout(searchField._timeout);
    searchField._timeout = window.setTimeout(filterByBoth, 150);
  });

  filterField?.addEventListener("change", (event) => {
    currentFilterValue = event.target.value;
    filterByBoth();
  });

  const handlePriceInput = () => {
    const minRaw = priceMinField?.value ?? "";
    const maxRaw = priceMaxField?.value ?? "";

    const minValue =
      minRaw === "" ? 0 : Number.isFinite(Number(minRaw)) ? Number(minRaw) : 0;
    const maxValue =
      maxRaw === "" ? 1000 : Number.isFinite(Number(maxRaw)) ? Number(maxRaw) : 1000;

    currentPriceMin = minValue;
    currentPriceMax = maxValue;
    filterByBoth();
  };

  priceMinField?.addEventListener("input", handlePriceInput);
  priceMaxField?.addEventListener("input", handlePriceInput);
  priceResetButton?.addEventListener("click", () => {
    if (priceMinField) priceMinField.value = "";
    if (priceMaxField) priceMaxField.value = "";
    currentPriceMin = 0;
    currentPriceMax = 1000;
    filterByBoth();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShuffleGrid);
} else {
  initShuffleGrid();
}
