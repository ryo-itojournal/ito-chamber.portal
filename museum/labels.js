/* ==============================================================
   ITO PEOPLE MUSEUM 共通ラベルユーティリティ
   A-Frame 標準フォント（MSDF）は和文グリフを含まないため、
   <a-text> を canvas で描画したテクスチャ（<a-image>）へ
   差し替えて日本語を表示する。
   WebGL が使えない環境では #fallback を表示する。
   ============================================================== */
(function () {
  'use strict';

  var BASE_FONT = 96; /* canvas 上の基準フォントサイズ（px） */
  var DEFAULT_FAMILY = "'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif";
  var DEFAULT_CHARS = 12; /* width 内に収める想定文字数（小さいほど文字が大きい） */

  function makeLabelTexture(lines, options) {
    var opts = options || {};
    var family = opts.fontFamily || DEFAULT_FAMILY;
    var weight = opts.weight || 700;
    var color = opts.color || '#ffffff';
    var letterSpacing = (opts.letterSpacing == null) ? 0.04 : opts.letterSpacing;
    var lineHeight = opts.lineHeight || 1.42;
    var shadow = opts.shadow || 'rgba(0, 0, 0, 0.45)';
    var pad = BASE_FONT * 0.35;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = weight + ' ' + BASE_FONT + 'px ' + family;

    var widths = lines.map(function (line) {
      var total = 0;
      Array.from(line).forEach(function (ch) {
        total += ctx.measureText(ch).width + letterSpacing * BASE_FONT;
      });
      return Math.max(total - letterSpacing * BASE_FONT, 1);
    });
    var textWidth = Math.max.apply(null, widths);

    canvas.width = Math.ceil(textWidth + pad * 2);
    canvas.height = Math.ceil(lines.length * BASE_FONT * lineHeight + pad * 2);

    /* canvas のサイズ変更で描画状態が初期化されるため再設定する */
    ctx = canvas.getContext('2d');
    ctx.font = weight + ' ' + BASE_FONT + 'px ' + family;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.shadowColor = shadow;
    ctx.shadowBlur = BASE_FONT * 0.14;

    lines.forEach(function (line, index) {
      var x = (canvas.width - widths[index]) / 2;
      var y = pad + BASE_FONT * lineHeight * (index + 0.5);
      Array.from(line).forEach(function (ch) {
        ctx.fillText(ch, x, y);
        x += ctx.measureText(ch).width + letterSpacing * BASE_FONT;
      });
    });

    return { src: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
  }

  function rawAttribute(el, name) {
    var node = el.attributes.getNamedItem(name);
    return node ? node.value : null;
  }

  function parseVector(value) {
    if (!value) { return null; }
    var parts = String(value).trim().split(/\s+/).map(Number);
    return { x: parts[0] || 0, y: parts[1] || 0, z: parts[2] || 0 };
  }

  /* <a-text> を canvas テクスチャの <a-image> に置き換える */
  function convertTexts(scope) {
    var targets = (scope || document).querySelectorAll('a-text');
    var converted = 0;

    Array.prototype.forEach.call(targets, function (el) {
      var value = rawAttribute(el, 'value');
      if (!value) { return; }

      var lines = String(value).split(/\r?\n/);
      var boxWidth = parseFloat(rawAttribute(el, 'width') || 4);
      var align = rawAttribute(el, 'align') || 'center';
      var chars = parseFloat(rawAttribute(el, 'data-chars') || DEFAULT_CHARS);

      var texture = makeLabelTexture(lines, {
        color: rawAttribute(el, 'color') || '#ffffff',
        weight: parseFloat(rawAttribute(el, 'data-weight') || 700),
        fontFamily: rawAttribute(el, 'data-font') || DEFAULT_FAMILY
      });

      /* 板の大きさ：文字を大きくしつつ、元の width をはみ出さない */
      var unit = Math.min(boxWidth / chars / BASE_FONT, boxWidth / texture.width);
      var planeWidth = texture.width * unit;
      var planeHeight = texture.height * unit;

      var position = parseVector(rawAttribute(el, 'position')) || { x: 0, y: 0, z: 0 };
      var offsetX = (align === 'left') ? planeWidth / 2 : ((align === 'right') ? -planeWidth / 2 : 0);

      var image = document.createElement('a-image');
      image.setAttribute('width', planeWidth.toFixed(4));
      image.setAttribute('height', planeHeight.toFixed(4));
      image.setAttribute('material', 'shader: flat; transparent: true; alphaTest: 0.01');
      image.setAttribute('position', (position.x + offsetX) + ' ' + position.y + ' ' + position.z);

      var rotation = rawAttribute(el, 'rotation');
      if (rotation) { image.setAttribute('rotation', rotation); }
      var scale = rawAttribute(el, 'scale');
      if (scale) { image.setAttribute('scale', scale); }

      image.setAttribute('src', texture.src);

      el.parentNode.insertBefore(image, el);
      el.parentNode.removeChild(el);
      converted += 1;
    });

    return converted;
  }

  /* WebGL が使えない環境向けの一覧表示 */
  function setupFallback() {
    var fallback = document.getElementById('fallback');
    if (!fallback) { return; }

    var supported = false;
    try {
      var canvas = document.createElement('canvas');
      supported = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      supported = false;
    }
    if (supported) { return; }

    fallback.style.display = 'block';
    var scene = document.querySelector('a-scene');
    if (scene) { scene.style.display = 'none'; }
    var guide = document.getElementById('guide');
    if (guide) { guide.style.display = 'none'; }
  }

  function boot() {
    var run = function () {
      try { convertTexts(document); } catch (e) { /* 変換失敗時も表示を継続 */ }
      setupFallback();
    };

    if (document.fonts && document.fonts.ready) {
      var loading = [];
      try {
        loading.push(document.fonts.load("700 96px 'Zen Kaku Gothic New'"));
        loading.push(document.fonts.load("700 96px 'Shippori Mincho'"));
      } catch (e) { /* フォント指定が無い場合は既定フォントで描画 */ }
      Promise.all(loading).catch(function () {}).then(function () {
        return document.fonts.ready;
      }).catch(function () {}).then(run, run);
    } else {
      run();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.ITOMuseumLabels = { makeLabelTexture: makeLabelTexture, convertTexts: convertTexts };
})();
