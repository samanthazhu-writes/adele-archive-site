// =========================================================
// Copy email buttons
// Append this once to js/main.js, or load it as a separate script.
// =========================================================

document.addEventListener("click", async function (event) {
  const button = event.target.closest("[data-copy-email]");
  if (!button) return;

  event.preventDefault();

  const email = button.getAttribute("data-copy-email") || "samantha201223@163.com";
  const originalText = button.textContent;

  async function copyWithFallback(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }

  try {
    const success = await copyWithFallback(email);

    if (success) {
      button.textContent = "Email copied";
      button.classList.add("is-copied");

      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("is-copied");
      }, 1800);
    } else {
      alert("Email: " + email);
    }
  } catch (error) {
    alert("Email: " + email);
  }
});
