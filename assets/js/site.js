/* =========================================================
   site.js - ITO CITY WEB 共通スクリプト
   brands.json を読み込み、ヘッダー・フッター・ブランドカードを描画する。
   使い方（各ページの末尾）:
     <script src="../assets/js/site.js" data-root=".." defer></script>
   data-root にはサイトルートへの相対パスを指定する。
   ========================================================= */

(function () {
  "use strict";

  var script = document.currentScript;
  var ROOT = (script && script.dataset.root) ? script.dataset.root.replace(/\/$/, "") : ".";
  var url = function (path) { return ROOT + "/" + String(path).replace(/^\//, ""); };

  var SECTION_LABEL = {
    museum: "デジタル展示室",
    instagram: "Instagram提案",
    furusato: "ふるさと納税"
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function externalLink(href, label) {
    var a = el("a", "c-btn", label);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }

  /* --- ヘッダー --- */
  function renderHeader(data, mount) {
    var header = el("header", "c-header");
    var logo = el("a", "c-header__logo", "伊東 ITO CITY");
    logo.href = url("index.html");
    header.appendChild(logo);

    var nav = el("nav", "c-header__nav");
    nav.setAttribute("aria-label", "サイト内メニュー");
    data.sections.forEach(function (section) {
      var a = el("a", null, SECTION_LABEL[section.slug] || section.name);
      a.href = url(section.path);
      nav.appendChild(a);
    });
    header.appendChild(nav);
    mount.replaceWith(header);
  }

  /* --- フッター --- */
  function renderFooter(mount) {
    var footer = el("footer", "c-footer");
    var year = new Date().getFullYear();
    footer.appendChild(el("p", null, "伊東 ITO CITY 事業者ポータル"));
    footer.appendChild(el("p", null, "運営：伊東市 地域おこし協力隊"));
    footer.appendChild(el("small", null, "© " + year + " Ito City"));
    mount.replaceWith(footer);
  }

  /* --- ブランドカード --- */
  function renderBrands(data, mount) {
    var grid = el("div", "l-grid");
    data.brands.forEach(function (brand) {
      var card = el("article", "c-card");
      card.style.borderTop = "4px solid var(" + brand.colorVar + ")";

      var body = el("div", "c-card__body");
      body.appendChild(el("p", "c-eyebrow", brand.nameEn));
      body.appendChild(el("h3", null, brand.name));
      body.appendChild(el("p", "u-mute", brand.summary));
      card.appendChild(body);

      var links = el("div", "c-card__links");
      var internal = el("a", "c-btn c-btn--primary", "展示室を見る");
      internal.href = url(brand.pages.museum);
      links.appendChild(internal);

      var proposal = el("a", "c-btn", "Instagram提案");
      proposal.href = url(brand.pages.instagram);
      links.appendChild(proposal);

      if (brand.links.map) links.appendChild(externalLink(brand.links.map, "マップ"));
      if (brand.links.official) links.appendChild(externalLink(brand.links.official, "公式サイト"));
      if (brand.links.shop) links.appendChild(externalLink(brand.links.shop, "楽天で見る"));
      if (brand.links.instagram) links.appendChild(externalLink(brand.links.instagram, "Instagram"));
      card.appendChild(links);

      grid.appendChild(card);
    });
    mount.replaceWith(grid);
  }

  /* --- 初期化 --- */
  function init(data) {
    var header = document.querySelector("[data-site-header]");
    if (header) renderHeader(data, header);

    var brands = document.querySelector("[data-brand-cards]");
    if (brands) renderBrands(data, brands);

    var footer = document.querySelector("[data-site-footer]");
    if (footer) renderFooter(footer);
  }

  fetch(url("assets/data/brands.json"))
    .then(function (res) {
      if (!res.ok) throw new Error("brands.json の読み込みに失敗しました");
      return res.json();
    })
    .then(init)
    .catch(function (err) {
      console.error("[site.js]", err);
    });
})();
