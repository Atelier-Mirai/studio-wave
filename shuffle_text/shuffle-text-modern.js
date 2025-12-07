/**
 * ShuffleText - DOM要素用ランダムテキストエフェクトクラス（モダン ES6+ 版）
 *
 * テキストがランダムな文字列でシャッフルされながら
 * 元の文字列に変化していくアニメーション効果を提供します。
 *
 * @author Yasunobu Ikeda（原作）
 * @license MIT
 * @see https://ics.media/entry/15498/
 */

class ShuffleText {
  // シャッフル時に表示するランダム文字列（宮沢賢治「ポラーノの広場」より）
  static DEFAULT_RANDOM_CHARS =
    'あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波';

  // 空白を表す文字
  static DEFAULT_EMPTY_CHAR = '-';

  // デフォルトのアニメーション時間（ミリ秒）
  static DEFAULT_DURATION = 600;

  #element;
  #originalStr = '';
  #originalLength = 0;
  #isRunning = false;
  #timeStart = 0;
  #randomIndex = [];
  #animationFrameId = 0;

  /**
   * @param {HTMLElement} element - シャッフル効果を適用するDOM要素
   * @param {object} options - オプション設定
   */
  constructor(element, options = {}) {
    this.#element = element;
    this.sourceRandomCharacter = options.randomChars ?? ShuffleText.DEFAULT_RANDOM_CHARS;
    this.emptyCharacter = options.emptyChar ?? ShuffleText.DEFAULT_EMPTY_CHAR;
    this.duration = options.duration ?? ShuffleText.DEFAULT_DURATION;

    this.setText(element?.textContent ?? '');
  }

  /**
   * 再生中かどうかを取得
   * @returns {boolean}
   */
  get isRunning() {
    return this.#isRunning;
  }

  /**
   * シャッフル対象となるテキストを設定
   * @param {string} text
   */
  setText(text) {
    this.#originalStr = text;
    this.#originalLength = text.length;
  }

  /**
   * シャッフルアニメーションを開始
   */
  start() {
    this.stop();

    // 各文字のランダムインデックスを生成
    this.#randomIndex = Array.from({ length: this.#originalLength }, (_, i) => {
      const rate = i / this.#originalLength;
      return Math.random() * (1 - rate) + rate;
    });

    // 初期表示（空白文字で埋める）
    if (this.#element) {
      this.#element.textContent = this.emptyCharacter.repeat(this.#originalLength);
    }

    this.#timeStart = performance.now();
    this.#isRunning = true;
    this.#animate();
  }

  /**
   * アニメーションを停止
   */
  stop() {
    this.#isRunning = false;
    cancelAnimationFrame(this.#animationFrameId);
  }

  /**
   * インスタンスを破棄してメモリを解放
   */
  dispose() {
    this.stop();
    this.#element = null;
    this.#originalStr = '';
    this.#originalLength = 0;
    this.#randomIndex = [];
  }

  /**
   * アニメーションフレームごとの処理
   */
  #animate = () => {
    const elapsed = performance.now() - this.#timeStart;
    const percent = elapsed / this.duration;

    // 各文字の状態を計算
    const str = Array.from({ length: this.#originalLength }, (_, i) => {
      if (percent >= this.#randomIndex[i]) {
        // 元の文字を表示
        return this.#originalStr.charAt(i);
      } else if (percent < this.#randomIndex[i] / 3) {
        // 空白文字を表示
        return this.emptyCharacter;
      } else {
        // ランダム文字を表示
        const randomCharIndex = Math.floor(
          Math.random() * this.sourceRandomCharacter.length
        );
        return this.sourceRandomCharacter.charAt(randomCharIndex);
      }
    }).join('');

    if (this.#element) {
      this.#element.textContent = str;
    }

    // アニメーション完了判定
    if (percent > 1) {
      if (this.#element) {
        this.#element.textContent = this.#originalStr;
      }
      this.#isRunning = false;
    } else if (this.#isRunning) {
      this.#animationFrameId = requestAnimationFrame(this.#animate);
    }
  };
}

// グローバルに公開（UMD互換）
if (typeof window !== 'undefined') {
  window.ShuffleText = ShuffleText;
}

// ES Modules 対応
export default ShuffleText;
