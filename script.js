(function () {
  "use strict";

  // ---------- Copy buttons ----------
  function selectText(el) {
    try {
      var range = document.createRange();
      range.selectNodeContents(el);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {}
  }

  function flash(button, message) {
    button.textContent = message;
    setTimeout(function () { button.textContent = "Copy"; }, 1600);
  }

  document.querySelectorAll("button.copy[data-target]").forEach(function (button) {
    button.setAttribute("aria-live", "polite");
    button.addEventListener("click", function () {
      var target = document.getElementById(button.getAttribute("data-target"));
      if (!target) { return; }
      var text = target.textContent.trim();

      var fallback = function () {
        selectText(target);
        flash(button, "Selected");
      };

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            flash(button, "Copied");
          }, fallback);
        } else {
          fallback();
        }
      } catch (e) {
        fallback();
      }
    });
  });

  // ---------- Enlarged certificate and resume ----------
  var dialog = document.getElementById("lightbox");
  var dialogImg = document.getElementById("lightbox-img");

  if (dialog && dialogImg && typeof dialog.showModal === "function") {
    document.querySelectorAll(".cert-open, .open-lightbox").forEach(function (button) {
      button.addEventListener("click", function () {
        var thumb = button.querySelector("img");
        dialogImg.src = button.getAttribute("data-full");
        dialogImg.alt = thumb ? thumb.alt : (button.getAttribute("data-alt") || "");
        dialog.showModal();
      });
    });

    dialog.addEventListener("click", function (event) {
      var r = dialog.getBoundingClientRect();
      var outside = event.clientX < r.left || event.clientX > r.right ||
                    event.clientY < r.top || event.clientY > r.bottom;
      if (outside) { dialog.close(); }
    });
  }

  // ---------- Highlight the current section in the navigation ----------
  var links = document.querySelectorAll('.bar nav a[href^="#"]');
  if (!("IntersectionObserver" in window) || !links.length) { return; }

  var sections = Array.prototype.map.call(links, function (link) {
    return document.querySelector(link.getAttribute("href"));
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      links.forEach(function (link) {
        var active = link.getAttribute("href") === "#" + entry.target.id;
        if (active) { link.setAttribute("aria-current", "true"); }
        else { link.removeAttribute("aria-current"); }
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(function (section) {
    if (section) { observer.observe(section); }
  });
})();