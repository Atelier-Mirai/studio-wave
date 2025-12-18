/*=====================================================================
  Chart.js レーダーチャート（モダン ES6+ 版）

  Chart.js v4.x 対応
  https://www.chartjs.org/docs/latest/charts/radar.html
=====================================================================*/

/**
 * カラーパレットの定義
 * 半透明色は CSS の rgb() 関数で記述
 */
const COLORS = {
  // メインカラー（線の色）
  red: "#ff251e",
  orange: "#f19072",
  yellow: "#ffec47",
  green: "#67a70c",
  blue: "#2ca9e1",
  purple: "#674196",
  grey: "#9ea1a3",
};

/**
 * 半透明色を生成するヘルパー
 * @param {string} hex - 16進数カラーコード
 * @param {number} alpha - 透明度 (0-1)
 * @returns {string} rgba 形式の色
 */
const hexToRgba = (hex, alpha = 0.5) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * チャートデータの定義
 */
const chartData = {
  labels: [
    "麺の味",
    "汁の味",
    "具の味",
    "ラーメンの量",
    "価格",
    "雰囲気",
    "立地",
  ],
  datasets: [
    {
      label: "櫻幕ラーメン",
      data: [75, 79, 90, 70, 100, 55, 40],
      fill: true,
      backgroundColor: hexToRgba(COLORS.orange, 0.5),
      borderColor: COLORS.orange,
      pointBackgroundColor: COLORS.orange,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: COLORS.orange,
    },
    {
      label: "平均",
      data: [58, 48, 40, 65, 56, 47, 50],
      fill: false,
      backgroundColor: hexToRgba(COLORS.blue, 0.5),
      borderColor: COLORS.blue,
      pointBackgroundColor: COLORS.blue,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: COLORS.blue,
    },
  ],
};

/**
 * チャート設定
 */
const chartConfig = {
  type: "radar",
  data: chartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: "transparent",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        angleLines: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
      },
    },
  },
};

/**
 * チャートを初期化
 */
const initChart = () => {
  const canvas = document.getElementById("myChart");
  if (!canvas) return;

  new Chart(canvas, chartConfig);
};

// DOM 読み込み完了後に初期化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChart);
} else {
  initChart();
}
