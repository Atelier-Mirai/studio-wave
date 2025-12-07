(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ShuffleText = factory());
}(this, (function () {
  'use strict';
  /**
   * ShuffleTextはDOMエレメント用ランダムテキストクラスです。
   * @author Yasunobu Ikeda
   * @since 2012-02-07
   */
  let ShuffleText = (function () {
    // DOMエレメントです。
    function ShuffleText(element) {
      let _a;
      // シャッフル効果が日本語になるよう ポラーノの広場(宮沢賢治)に変更
      this.sourceRandomCharacter = "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波";
      // this.sourceRandomCharacter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      this.emptyCharacter           = "-"; // 空白に用いる文字列です
      this.duration                 = 600; // エフェクトの実行時間（ミリ秒）
      this._isRunning               = false;
      this._originalStr             = "";
      this._originalLength          = 0;
      this._timeCurrent             = 0;
      this._timeStart               = 0;
      this._randomIndex             = [];
      this._element                 = null;
      this._requestAnimationFrameId = 0;
      this._element                 = element;
      this.setText((_a = element.textContent) !== null && _a !== void 0 ? _a : "");
    }

    // シャッフル対象となるテキストを設定します。
    ShuffleText.prototype.setText = function (text) {
      this._originalStr    = text;
      this._originalLength = text.length;
    };
    Object.defineProperty(ShuffleText.prototype, "isRunning", {
      get: function () {
        return this._isRunning; // 再生中かどうかを示すブール値です。
      },
      enumerable: false,
      configurable: true
    });

    // Play effect. 再生を開始します。
    ShuffleText.prototype.start = function () {
      let _this = this;
      this.stop();
      this._randomIndex = [];
      let str = "";
      for (let i = 0; i < this._originalLength; i++) {
        let rate = i / this._originalLength;
        this._randomIndex[i] = Math.random() * (1 - rate) + rate;
        str += this.emptyCharacter;
      }
      this._timeStart = new Date().getTime();
      this._isRunning = true;
      this._requestAnimationFrameId = requestAnimationFrame(function () {
        _this._onInterval();
      });
      if (this._element) {
        this._element.textContent = str;
      }
    };

    // Stop effect. 停止します。
    ShuffleText.prototype.stop = function () {
      this._isRunning = false;
      cancelAnimationFrame(this._requestAnimationFrameId);
    };

    // メモリ解放のためインスタンスを破棄します。
    ShuffleText.prototype.dispose = function () {
      cancelAnimationFrame(this._requestAnimationFrameId);
      this._isRunning               = false;
      this.duration                 = 0;
      this._originalStr             = "";
      this._originalLength          = 0;
      this._timeCurrent             = 0;
      this._timeStart               = 0;
      this._randomIndex             = [];
      this._element                 = null;
      this._requestAnimationFrameId = 0;
    };

    // インターバルハンドラーです。
    ShuffleText.prototype._onInterval = function () {
      let _this = this;
      this._timeCurrent = new Date().getTime() - this._timeStart;
      let percent = this._timeCurrent / this.duration;
      let str = "";
      for (let i = 0; i < this._originalLength; i++) {
        if (percent >= this._randomIndex[i]) {
          str += this._originalStr.charAt(i);
        } else if (percent < this._randomIndex[i] / 3) {
          str += this.emptyCharacter;
        } else {
          str += this.sourceRandomCharacter.charAt(Math.floor(Math.random() * this.sourceRandomCharacter.length));
        }
      }
      if (percent > 1) {
        str = this._originalStr;
        this._isRunning = false;
      }
      if (this._element) {
        this._element.textContent = str;
      }
      if (this._isRunning) {
        this._requestAnimationFrameId = requestAnimationFrame(function () {
          _this._onInterval();
        });
      }
    };
    return ShuffleText;
  }());
  return ShuffleText;
})));
