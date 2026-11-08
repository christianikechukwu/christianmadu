/* Homepage: audio transcript toggle and FAQ accordion. */
(function () {
  "use strict";

  var toggle = document.querySelector(".transcript-toggle");
  var transcript = document.getElementById("audio-transcript");
  if (toggle && transcript) {
    toggle.addEventListener("click", function () {
      var open = !transcript.classList.contains("is-open");
      transcript.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Hide Audio Transcript" : "Read Audio Transcript";
    });
  }

  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-question");
    btn.addEventListener("click", function () {
      var wasOpen = item.classList.contains("is-open");
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
