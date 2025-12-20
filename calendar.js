/* 暦 & 簡易ブログ のための JavaScript
 * 初心者向けに、役割を細かくコメントしています。
 * 参考: https://www.cssscript.com/basic-calendar-view/
 * 主な処理の流れ:
 *   1. 年月など現在の状態を保持
 *   2. カレンダーの枠・ヘッダー（年・月）を生成
 *   3. テーブル本体とブログ一覧を生成
 *   4. 前月/翌月ボタンで状態を更新 → 再描画
 *   5. クリックでブログ詳細を右側に表示
 */

// 祝日データを取り込む（holidays.js に日付文字列と名前が入っている）
import HOLIDAYS from "./holidays.js";

// ブログデータを取得（blog-data.js に日付をキーにした記事が入っている）
import BLOG_DATA from "./blog-data.js";

// 今日の日付オブジェクト
let today = new Date();
// 現在の表示対象の年・月（前月/翌月ボタンで書き換わる）
let currentYear = today.getFullYear();
let currentMonth = today.getMonth() + 1; // Dateでは0始まりなので +1

// 定数: 初期起動時の年・月・日（「今日」を判定するため保持）
const thisYear = currentYear;
const thisMonth = currentMonth;
const thisDay = today.getDate();
const MONTHS = ["", "睦月", "如月", "彌生", "卯月", "皐月", "水無月",
                    "文月", "葉月", "長月", "神無月", "霜月", "師走"];
const WDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const NAME_OF_DAY = ["sunday", "monday", "tuesday", "wednesday", 
                     "thursday", "friday", "saturday",];
const NUM_TO_KAN = ["〇", "一", "二", "三", "四",
                    "五", "六", "七", "八", "九", "十"];

// <title>タグに<h1>タグの文字を設定する
const h1 = document.querySelector("h1");
document.title = `${h1.textContent} - WAVE`;

// 暦の背景写真と暦本体の為の要素定義 & 生成
// data-month を付けて CSS 側の背景切り替えに使う
const wallpaper = document.getElementById("wallpaper");
wallpaper.setAttribute("data-month", currentMonth);
const calendar = document.getElementById("calendar");

const blogTitle = document.getElementById("title");
const blogHiduke = document.getElementById("hiduke");
const blogImage = document.getElementById("image");
const blogImageImg = blogImage ? blogImage.querySelector("img") : null;
const blogParagraph = document.getElementById("paragraph");

// 改行を <br> に変換して表示用文字列を作る
const renderParagraph = (text) => (text ? text.replaceAll("\n", "<br>") : "");

// ブログ詳細（右カラム）の表示更新
function renderBlogDetail({ title, hiduke, image, paragraph }) {
  if (!blogTitle || !blogHiduke || !blogImage || !blogParagraph) return;
  document.title = `${title} - WAVE`;
  blogTitle.textContent = title;
  blogHiduke.textContent = hiduke;
  if (image === "") {
    blogImage.style.display = "none";
  } else {
    blogImage.style.display = "block";
    if (blogImageImg) blogImageImg.src = `images/${image}`;
  }
  blogParagraph.innerHTML = renderParagraph(paragraph);
}

// 月ごとの暦の写真の為の要素生成（上部の写真エリア）
const calendarPhoto = document.createElement("div");
calendarPhoto.className = "photograph";
calendarPhoto.setAttribute("data-month", currentMonth);
calendar.appendChild(calendarPhoto);

// 前月翌月の操作盤（ナビゲーション）を生成
const panel = document.createElement("div");
panel.className = "panel";
// 前月
const prevButton = document.createElement("a");
prevButton.className = "prev";
prevButton.setAttribute("title", "前月");
prevButton.innerHTML = `<i class="fa-solid fa-angle-left"></i>`;
prevButton.addEventListener("click", previousMonth, false);
// 翌月
const nextButton = document.createElement("a");
nextButton.className = "next";
nextButton.setAttribute("title", "翌月");
nextButton.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;
nextButton.addEventListener("click", nextMonth, false);
// 年表示
const yearLabel = document.createElement("span");
yearLabel.className = "year";
yearLabel.setAttribute("data-year", currentYear);
yearLabel.innerHTML = `令和 ${NUM_TO_KAN[currentYear - 2018]} 年`;
// 月表示
const monthLabel = document.createElement("span");
monthLabel.className = "month";
monthLabel.setAttribute("data-month", currentMonth);
monthLabel.innerHTML = MONTHS[currentMonth];
panel.appendChild(prevButton);
panel.appendChild(nextButton);
panel.appendChild(yearLabel);
panel.appendChild(monthLabel);
calendar.appendChild(panel);

// 暦本体（テーブルヘッダー）を生成
const table = document.createElement("table");
const thead = document.createElement("thead");
let tr = document.createElement("tr");
for (const wday of WDAYS) {
  const th = document.createElement("th");
  th.textContent = wday;
  tr.appendChild(th);
}
thead.appendChild(tr);
table.appendChild(thead);
calendar.appendChild(table);

// 今月投稿したブログの一覧の見出し
const blogHeader = document.createElement("p");
blogHeader.className = "blog header";
blogHeader.innerHTML = "今月の投稿";
calendar.appendChild(blogHeader);

// ブログ一覧 (nav > ul) を生成し、再描画のたびに作り直す
function createBlogNav() {
  let nav = document.getElementById("nav");
  if (nav) nav.remove();

  nav = document.createElement("nav");
  nav.id = "nav";

  const ul = document.createElement("ul");
  ul.id = "ul";
  nav.appendChild(ul);
  calendar.appendChild(nav);

  return ul;
}

// td (日付セル) に入っているデータ属性から右カラムを更新
function renderBlogDetailFromTd(dayCell) {
  if (!blogTitle || !blogHiduke || !blogImage || !blogParagraph) return;

  renderBlogDetail({
    title: dayCell.title,
    hiduke: dayCell.dataset.hiduke,
    image: dayCell.dataset.image,
    paragraph: dayCell.dataset.paragraph,
  });
}

// ブログデータをセルに反映し、ブログ一覧の <li> も生成
function applyBlogDataToCell(dayCell, blogEntry, reiwaDate, blogListUl) {
  dayCell.className = `${dayCell.className} blogday`;

  if (dayCell.getAttribute("title")) {
    dayCell.setAttribute(
      "title",
      `${dayCell.getAttribute("title")} ${blogEntry.title}`,
    );
  } else {
    dayCell.setAttribute("title", blogEntry.title);
  }

  dayCell.dataset.date = reiwaDate;
  dayCell.dataset.hiduke = blogEntry.hiduke;
  dayCell.dataset.image = blogEntry.image;
  dayCell.dataset.paragraph = blogEntry.paragraph;

  const li = document.createElement("li");
  const blogLink = document.createElement("a");
  blogLink.textContent = blogEntry.title;
  blogLink.dataset.date = reiwaDate;
  li.appendChild(blogLink);
  blogListUl.appendChild(li);
}

// 1ヶ月分の tbody を作る（カレンダー本体の行・セル生成）
function createMonthTableBody(year, month, blogListUl) {
  const tbody = document.createElement("tbody");
  tbody.id = "tbody";

  let firstDay = zeller(year, month, 1);
  let wday = 0;
  let tr = document.createElement("tr");
  let firstBlogCell = null;

  for (let date = 1 - firstDay; date < 1; date++, wday++) {
    let dayCell = document.createElement("td");
    tr.appendChild(dayCell);
  }

  for (let date = 1; date <= daysInMonth(year, month); date++) {
    let dayCell = document.createElement("td");
    dayCell.className = NAME_OF_DAY[wday];
    let a = document.createElement("a");
    a.setAttribute("href", "#");
    a.textContent = date;

    if (
      date === thisDay &&
      currentMonth === thisMonth &&
      currentYear === thisYear
    ) {
      dayCell.className = `${dayCell.className} today`;
    }

    // 祝日ならクラス付与 & titleに祝日名
    let name;
    if ((name = holidayName(currentYear, currentMonth, date))) {
      dayCell.className = `${dayCell.className} holiday`;
      dayCell.setAttribute("title", name);
    }

    // ブログがある日ならクラス付与 & data属性に記事情報
    let blogEntry;
    let reiwaDate = stringifyDate(currentYear, currentMonth, date);
    if ((blogEntry = blogData(reiwaDate))) {
      applyBlogDataToCell(dayCell, blogEntry, reiwaDate, blogListUl);
      if (!firstBlogCell) firstBlogCell = dayCell;
    }

    dayCell.appendChild(a);
    tr.appendChild(dayCell);

    if (wday === 6) {
      tbody.appendChild(tr);
      tr = document.createElement("tr");
      wday = 0;
    } else {
      wday++;
    }
  }
  tbody.appendChild(tr);

  return { tbody, firstBlogCell };
}

// ブログセルとブログ一覧のクリックにイベントを付与
function bindBlogEvents(tbody) {
  tbody.querySelectorAll(".blogday").forEach((dayCell) => {
    dayCell.querySelector("a").addEventListener("click", (event) => {
      event.preventDefault();
      renderBlogDetailFromTd(dayCell);
    });
  });

  document.querySelectorAll("#nav #ul li a").forEach((a) => {
    a.addEventListener("click", (event) => {
      event.preventDefault();
      const date = a.dataset.date;
      const dayCell = document.querySelector(`[data-date="${date}"]`);
      if (!dayCell) return;
      renderBlogDetailFromTd(dayCell);
    });
  });
}

// ヘッダーの年/月・背景写真を現在の state に合わせて更新
function updateMonthDisplays() {
  yearLabel.setAttribute("data-year", currentYear);
  yearLabel.innerText = `令和 ${NUM_TO_KAN[currentYear - 2018]} 年`;
  monthLabel.setAttribute("data-month", currentMonth);
  monthLabel.innerText = MONTHS[currentMonth];
  wallpaper.setAttribute("data-month", currentMonth);
  calendarPhoto.setAttribute("data-month", currentMonth);
}

// 月を +1 / -1 して再描画（前月/翌月ボタンから呼ばれる）
function changeMonth(diff) {
  const next = currentMonth + diff;
  if (next < 1) {
    currentYear -= 1;
    currentMonth = 12;
  } else if (next > 12) {
    currentYear += 1;
    currentMonth = 1;
  } else {
    currentMonth = next;
  }
  renderCurrentMonth();
}

// 現在の state (year/month) に合わせてヘッダーを更新し、カレンダー本体を再生成
function renderCurrentMonth() {
  updateMonthDisplays();
  renderCalendar(currentYear, currentMonth);
}

// 当月の暦生成&表示（tbody・ブログ一覧を作り直す）
function renderCalendar(year, month) {
  const oldTbody = document.getElementById("tbody");
  if (oldTbody) oldTbody.remove();

  const blogListUl = createBlogNav();
  const { tbody, firstBlogCell } = createMonthTableBody(year, month, blogListUl);

  table.appendChild(tbody);
  bindBlogEvents(tbody);

  if (firstBlogCell) {
    renderBlogDetailFromTd(firstBlogCell);
  }
}

// 前月操作（ナビゲーションのクリックイベント）
function previousMonth() {
  changeMonth(-1);
}

// 翌月操作
function nextMonth() {
  changeMonth(1);
}

// その月の日数を返す
function daysInMonth(year, month) {
  if (leapYear(year)) {
    // 閏年      1   2   3   4   5   6   7   8   9  10  11  12月
    return [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  } else {
    // 平年
    return [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }
}

// 閏年判定
function leapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// ツェラーの公式（曜日を計算）
// 参考: https://ja.wikipedia.org/wiki/ツェラーの公式
function zeller(year, month, day) {
  if (month === 1 || month === 2) {
    month += 12;
    year -= 1;
  }

  let d = day;
  let m = month;
  let C = Math.floor(year / 100);
  let Y = year % 100;
  let gamma = -2 * C + Math.floor(C / 4);

  let h =
    (d + Math.floor((26 * (m + 1)) / 10) + Y + Math.floor(Y / 4) + gamma) % 7;
  let wday = (h + 6) % 7;
  // 曜日 日  月  火  水  木  金  土
  // h    1   2   3   4   5   6   0
  // wday 0   1   2   3   4   5   6

  return wday;
}

// これで求めることが出来るが、基本を学んで欲しいので、自作している。
// const firstDay = new Date(year, month - 1, 1).getDay();   // 0(日)〜6(土)
// const lastDate = new Date(year, month, 0).getDate();      // その月の日数

// 祝日名を返す
function holidayName(year, month, day) {
  // 日付文字列へ変換
  let yyyy = `${year}`;
  let mm = month.toString().padStart(2, "0");
  let dd = day.toString().padStart(2, "0");
  let stringifyDate = `${yyyy}-${mm}-${dd}`;

  return HOLIDAYS[stringifyDate];
}

// 日付文字列へ変換
function stringifyDate(year, month, day) {
  let reiwa = (year - 2018).toString().padStart(2, "0");
  let mm = month.toString().padStart(2, "0");
  let dd = day.toString().padStart(2, "0");
  return `R${reiwa}-${mm}-${dd}`;
}

// ブログ表題を返す
function blogData(reiwaDate) {
  return BLOG_DATA[reiwaDate];
}

// 初回ロード時に現在の月を描画する
renderCurrentMonth();

