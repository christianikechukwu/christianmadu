/* Contact form: live validation, alert banner and receipt window. */
(function () {
  "use strict";

  var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  var FIELDS = ["name", "email", "phone", "message"];

  function validate(field, raw) {
    var val = raw.trim();
    switch (field) {
      case "name":
        if (val === "") return "Full name is required. Field cannot be empty.";
        if (val.length < 2) return "Name must be at least 2 characters long.";
        return "";
      case "email":
        if (val === "") return "Email address is required. Field cannot be empty.";
        if (!EMAIL_RE.test(val)) return "Please enter a valid email format (e.g. name@miva.edu.ng).";
        return "";
      case "phone":
        if (val === "") return "Phone number is required. Field cannot be empty.";
        if (!/^\d+$/.test(val))
          return "Phone number must contain only numeric digits (no letters, plus signs, spaces or dashes). Example: 08037905808";
        if (val.length < 7 || val.length > 15) return "Phone number must be between 7 and 15 digits in length.";
        return "";
      case "message":
        if (val === "") return "Message is required. Field cannot be empty.";
        if (val.length < 10) return "Message should provide at least 10 characters of detail.";
        return "";
    }
    return "";
  }

  var form = document.querySelector('form[aria-label="Student Contact Form"]');
  var alertBox = document.querySelector(".alert-banner");
  var modal = document.querySelector(".receipt-modal");
  var receiptTable = modal.querySelector(".receipt-summary-table");

  function input(f) { return document.getElementById("contact-" + f); }
  function errorEl(f) { return input(f).parentNode.querySelector(".form-error"); }

  function setError(f, msg) {
    errorEl(f).textContent = msg;
    input(f).classList.toggle("is-invalid", !!msg);
  }

  function showAlert(type, message) {
    alertBox.className = "alert-banner is-visible " + type;
    alertBox.innerHTML = "";
    var label = document.createElement("span");
    label.className = "alert-status-label";
    label.textContent = type === "success" ? "SUCCESS:" : "NOTICE:";
    var text = document.createElement("div");
    text.textContent = message;
    alertBox.appendChild(label);
    alertBox.appendChild(text);
  }

  function hideAlert() {
    alertBox.className = "alert-banner";
    alertBox.innerHTML = "";
  }

  FIELDS.forEach(function (f) {
    input(f).addEventListener("input", function () { setError(f, ""); });
    input(f).addEventListener("blur", function () { setError(f, validate(f, input(f).value)); });
  });

  function row(label, value) {
    var tr = document.createElement("tr");
    var a = document.createElement("td");
    a.innerHTML = "<strong>" + label + "</strong>";
    var b = document.createElement("td");
    b.textContent = value;
    tr.appendChild(a);
    tr.appendChild(b);
    return tr;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideAlert();
    var firstInvalid = null;
    FIELDS.forEach(function (f) {
      var msg = validate(f, input(f).value);
      setError(f, msg);
      if (msg && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      showAlert("danger", "Please correct the highlighted errors before submitting the form.");
      input(firstInvalid).focus();
      return;
    }

    var message = input("message").value.trim();
    var body = document.createElement("tbody");
    body.appendChild(row("Sender Name:", input("name").value.trim()));
    body.appendChild(row("Email Address:", input("email").value.trim()));
    body.appendChild(row("Phone (Digits Only):", input("phone").value.trim()));
    body.appendChild(row("Timestamp:", new Date().toLocaleString()));
    body.appendChild(row("Message Extract:", message.substring(0, 80) + (message.length > 80 ? "..." : "")));
    receiptTable.innerHTML = "";
    receiptTable.appendChild(body);

    form.reset();
    showAlert("success", "Thank you! Your message has been validated and recorded successfully.");
    window.Modal.open(modal);
  });

  form.addEventListener("reset", function () {
    FIELDS.forEach(function (f) { setError(f, ""); });
  });
})();
