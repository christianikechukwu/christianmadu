/* Shared behaviour for every page: mobile menu, footer year, scroll reveal. */
(function () {
  "use strict";

  // Mobile navigation toggle
  var nav = document.querySelector(".main-nav");
  var toggle = document.querySelector(".mobile-nav-toggle");
  if (nav && toggle) {
    var label = toggle.querySelector(".nav-icon-bars");
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains("is-open"));
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });
  }

  // Footer year
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Scroll reveal
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.setAttribute("data-revealed", ""); });
  } else {
    document.documentElement.classList.add("reveal-ready");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });
  }
})();

/* Simple modal helper used by the projects and contact pages. */
window.Modal = (function () {
  var lastFocus = null;
  var prevOverflow = "";

  function open(modal) {
    if (!modal) return;
    lastFocus = document.activeElement;
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
  }

  function close(modal) {
    if (!modal || !modal.classList.contains("is-active")) return;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = prevOverflow;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function activeModal() {
    return document.querySelector(".project-modal.is-active, .receipt-modal.is-active");
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close(activeModal());
  });

  document.addEventListener("click", function (e) {
    var target = e.target;
    var modal = activeModal();
    if (!modal) return;
    if (target === modal || target.closest(".modal-close-btn, .modal-close-btn-bottom")) {
      close(modal);
    }
  });

  return { open: open, close: close };
})();
