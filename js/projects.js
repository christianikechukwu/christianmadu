/* Projects page: open project modals and run the live GPA calculator. */
(function () {
  "use strict";

  // Buttons carry data-open="<modal title id>"
  document.querySelectorAll("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = document.getElementById(btn.getAttribute("data-open"));
      if (title) window.Modal.open(title.closest(".project-modal"));
    });
  });

  // GPA calculator (Nigerian 5-point scale)
  function standingFor(gpa) {
    if (gpa >= 4.5) return { key: "first", text: "Status: First Class Honors Standing (4.50 – 5.00)" };
    if (gpa >= 3.5) return { key: "upper", text: "Status: Second Class Upper (3.50 – 4.49)" };
    if (gpa >= 2.4) return { key: "lower", text: "Status: Second Class Lower (2.40 – 3.49)" };
    return { key: "low", text: "Status: Needs Academic Improvement" };
  }

  var selects = document.querySelectorAll(".gpa-select");
  var pointsEl = document.querySelector(".gpa-output-points span");
  var gpaEl = document.querySelector('[data-testid="gpa-result"]');
  var standingEl = document.querySelector(".gpa-standing");

  function recalc() {
    var totalPoints = 0;
    var totalUnits = 0;
    selects.forEach(function (sel) {
      var row = sel.closest("tr");
      var units = Number(row.children[1].textContent);
      var points = units * Number(sel.value);
      row.children[3].textContent = String(points);
      totalPoints += points;
      totalUnits += units;
    });
    var gpa = totalUnits > 0 ? Number((totalPoints / totalUnits).toFixed(2)) : 0;
    var standing = standingFor(gpa);
    pointsEl.textContent = String(totalPoints);
    gpaEl.textContent = gpa.toFixed(2);
    standingEl.className = "gpa-standing is-" + standing.key;
    standingEl.textContent = standing.text;
  }

  selects.forEach(function (sel) { sel.addEventListener("change", recalc); });
  if (selects.length) recalc();
})();
