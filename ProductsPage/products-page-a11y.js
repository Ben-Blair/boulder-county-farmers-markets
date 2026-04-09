/**
 * Products page: keyboard access for onclick-only cards, filter checkbox names,
 * and modal image alt sync (avoids duplicate alt next to grid thumbnail).
 */
(function () {
  function trim(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  function labelFromCard(card) {
    var title = card.querySelector(".product-grid-title");
    var producer = card.querySelector(".product-grid-producer");
    var parts = [];
    if (title) parts.push(trim(title.textContent));
    if (producer) parts.push(trim(producer.textContent));
    return parts.filter(Boolean).join(", ") || "Product";
  }

  function enhanceProductCards() {
    document.querySelectorAll(".product-grid-card, .product-grid-card-alt").forEach(function (card) {
      if (card.getAttribute("data-a11y-card") === "1") return;
      card.setAttribute("data-a11y-card", "1");
      card.setAttribute("role", "button");
      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", labelFromCard(card) + ", open product details");
    });
  }

  function onCardKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var card = e.target.closest(".product-grid-card, .product-grid-card-alt");
    if (!card || !document.body.contains(card)) return;
    if (e.target.closest("a, button, input, select, textarea")) return;
    e.preventDefault();
    card.click();
  }

  function labelFilterCheckboxes() {
    document.querySelectorAll("input.filter-checkbox.uk-checkbox").forEach(function (cb) {
      if (cb.getAttribute("aria-label") || cb.getAttribute("aria-labelledby")) return;
      var li = cb.closest("li");
      if (!li) return;
      var t = trim(li.textContent);
      if (t) cb.setAttribute("aria-label", t);
    });
  }

  function enhanceFavoriteButton() {
    document.querySelectorAll(".favorite-button[onclick]").forEach(function (el) {
      if (el.getAttribute("data-a11y-fav") === "1") return;
      el.setAttribute("data-a11y-fav", "1");
      el.setAttribute("role", "button");
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
      var t = document.querySelector("#favorite-button-text");
      if (t && trim(t.textContent)) el.setAttribute("aria-label", trim(t.textContent));
      else el.setAttribute("aria-label", "Add or remove from favorites");
    });
  }

  function onFavoriteKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var fav = e.target.closest(".favorite-button[onclick]");
    if (!fav || !document.body.contains(fav)) return;
    e.preventDefault();
    fav.click();
  }

  function syncModalImageAlt() {
    var img = document.getElementById("product-modal-image");
    if (!img) return;
    var titleEl =
      document.querySelector("#product-modal-info .product-grid-title") ||
      document.querySelector("#product-modal .product-grid-title");
    var name = titleEl ? trim(titleEl.textContent) : "";
    if (name) img.setAttribute("alt", "Large photo: " + name);
    else img.setAttribute("alt", "Large product photo in details panel");
  }

  function init() {
    enhanceProductCards();
    labelFilterCheckboxes();
    enhanceFavoriteButton();
    syncModalImageAlt();

    var mo = new MutationObserver(function () {
      enhanceProductCards();
      labelFilterCheckboxes();
      syncModalImageAlt();
    });
    var root = document.getElementById("product-display-area") || document.body;
    mo.observe(root, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("keydown", onCardKeydown);
  document.addEventListener("keydown", onFavoriteKeydown);
})();
