/* Study planner: add, complete, filter, search and delete tasks saved in localStorage. */
(function () {
  "use strict";

  var STORAGE_KEY = "miva_academic_planner_tasks_v3";
  var DEFAULT_COURSE = "COS 102";
  var DAY = 86400000;

  function initialTasks() {
    var now = Date.now();
    return [
      { id: "task-1", title: "Finalize CSC 106 Practical Term Project Code & Structure", course: "CSC 106", dueDate: "2026-11-15", completed: true, createdAt: now - DAY * 3 },
      { id: "task-2", title: "Complete COS 102 Problem Solving Flowchart & Pseudocode Exercise", course: "COS 102", dueDate: "2026-11-20", completed: false, createdAt: now - DAY * 2 },
      { id: "task-3", title: "Review MTH 102 Elementary Mathematics II Calculus Problem Set", course: "MTH 102", dueDate: "2026-11-22", completed: false, createdAt: now - DAY },
      { id: "task-4", title: "Complete PHY 108 General Physics Practical II Lab Worksheet", course: "PHY 108", dueDate: "2026-11-25", completed: false, createdAt: now },
      { id: "task-5", title: "Study PHY 102 Electromagnetism Notes & Circuit Theory", course: "PHY 102", dueDate: "2026-11-28", completed: false, createdAt: now }
    ];
  }

  function parseLocalDate(s) {
    var p = (s || "").split("-");
    if (p.length !== 3) return null;
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }
  function formatDisplayDate(s) {
    if (!s) return "No date";
    var d = parseLocalDate(s);
    return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : s;
  }
  function isDatePast(s) {
    if (!s) return false;
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    var d = parseLocalDate(s);
    return d ? d < t : false;
  }
  function toIsoDate(d) { return d.toISOString().slice(0, 10); }
  function defaultDueDate() {
    var d = new Date();
    d.setDate(d.getDate() + 7);
    return toIsoDate(d);
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // State
  var tasks;
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      tasks = JSON.parse(raw);
    } else {
      tasks = initialTasks();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  } catch (err) {
    console.error("Failed to parse saved tasks from storage:", err);
    tasks = initialTasks();
  }
  var filter = "all";
  var search = "";

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Failed to save tasks to localStorage:", err);
    }
    render();
  }

  // Elements
  var form = document.querySelector(".task-form-card form");
  var titleInput = document.getElementById("task-title");
  var titleError = titleInput.parentNode.querySelector(".form-error");
  var courseSelect = document.getElementById("task-course");
  var dueInput = document.getElementById("task-due-date");
  var filterBtns = document.querySelectorAll(".filter-btn");
  var searchInput = document.querySelector(".search-input");
  var clearBtn = document.querySelector(".planner-toolbar > .btn");
  var container = document.querySelector(".tasks-container");
  var statValues = document.querySelectorAll(".ledger-stat-value");
  var FILTER_KEYS = ["all", "pending", "completed"];

  dueInput.value = defaultDueDate();

  function visibleTasks() {
    var q = search.trim().toLowerCase();
    return tasks.filter(function (t) {
      if (filter === "pending" && t.completed) return false;
      if (filter === "completed" && !t.completed) return false;
      if (q) return t.title.toLowerCase().indexOf(q) !== -1 || t.course.toLowerCase().indexOf(q) !== -1;
      return true;
    });
  }

  function render() {
    var total = tasks.length;
    var completed = tasks.filter(function (t) { return t.completed; }).length;
    statValues[0].textContent = total;
    statValues[1].textContent = total - completed;
    statValues[2].textContent = completed;
    statValues[3].textContent = (total > 0 ? Math.round((completed / total) * 100) : 0) + "%";

    filterBtns.forEach(function (b, i) { b.classList.toggle("active", FILTER_KEYS[i] === filter); });

    var list = visibleTasks();
    if (list.length === 0) {
      var msg = search
        ? "No items match your search keyword."
        : filter === "completed"
          ? "No completed tasks yet."
          : "All tasks for this filter are completed.";
      container.innerHTML = '<div class="empty-state"><h4>No Tasks Found</h4><p>' + msg + "</p></div>";
      return;
    }

    var rows = list.map(function (t) {
      var overdue = !t.completed && isDatePast(t.dueDate);
      var title = escapeHtml(t.title);
      var badge = t.completed
        ? '<span class="status-badge-done">Completed</span>'
        : overdue
          ? '<span class="status-badge-overdue">Overdue</span>'
          : '<span class="status-badge-pending">Pending</span>';
      return (
        '<tr class="' + (t.completed ? "is-completed" : "") + '" data-id="' + escapeHtml(t.id) + '">' +
          '<td class="col-checkbox"><input type="checkbox" class="task-checkbox-custom"' + (t.completed ? " checked" : "") +
            ' aria-label="Mark ' + title + ' as complete"></td>' +
          '<td class="col-task"><div class="task-name">' + title + '</div><div class="task-course-text">' + escapeHtml(t.course) + "</div></td>" +
          '<td class="col-due"><span class="mobile-col-label">Due: </span><span class="due-date-text' + (overdue ? " is-overdue" : "") + '">' +
            escapeHtml(formatDisplayDate(t.dueDate)) + "</span></td>" +
          '<td class="col-status">' + badge + "</td>" +
          '<td class="col-action"><button type="button" class="btn-text-delete" title="Delete task" aria-label="Delete ' + title + '">Delete</button></td>' +
        "</tr>"
      );
    }).join("");

    container.innerHTML =
      '<div class="table-responsive-container planner-table-wrap">' +
        '<table class="planner-ledger-table" aria-label="Coursework Tasks Table">' +
          '<thead><tr><th class="col-checkbox">Done</th><th class="col-task">Task &amp; Course</th>' +
          '<th class="col-due">Due Date</th><th class="col-status">Status</th><th class="col-action">Action</th></tr></thead>' +
          "<tbody>" + rows + "</tbody>" +
        "</table>" +
      "</div>";
  }

  // Events
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var title = titleInput.value.trim();
    if (!title) {
      titleError.textContent = "Please enter a task name.";
      titleInput.classList.add("is-invalid");
      titleInput.focus();
      return;
    }
    titleError.textContent = "";
    titleInput.classList.remove("is-invalid");
    tasks.unshift({
      id: "task-" + Date.now(),
      title: title,
      course: courseSelect.value,
      dueDate: dueInput.value || toIsoDate(new Date()),
      completed: false,
      createdAt: Date.now()
    });
    titleInput.value = "";
    courseSelect.value = DEFAULT_COURSE;
    dueInput.value = defaultDueDate();
    save();
  });

  filterBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      filter = FILTER_KEYS[i];
      render();
    });
  });

  searchInput.addEventListener("input", function () {
    search = searchInput.value;
    render();
  });

  clearBtn.addEventListener("click", function () {
    var count = tasks.filter(function (t) { return t.completed; }).length;
    if (count === 0) {
      alert("There are no completed deliverables to clear.");
      return;
    }
    if (confirm("Remove " + count + " completed deliverable(s)?")) {
      tasks = tasks.filter(function (t) { return !t.completed; });
      save();
    }
  });

  container.addEventListener("change", function (e) {
    if (!e.target.classList.contains("task-checkbox-custom")) return;
    var id = e.target.closest("tr").getAttribute("data-id");
    tasks = tasks.map(function (t) { return t.id === id ? Object.assign({}, t, { completed: !t.completed }) : t; });
    save();
  });

  container.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-text-delete");
    if (!btn) return;
    var id = btn.closest("tr").getAttribute("data-id");
    tasks = tasks.filter(function (t) { return t.id !== id; });
    save();
  });

  render();
})();
