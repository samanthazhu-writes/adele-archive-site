/* =========================================================
   THE ADÈLE ARCHIVE — PRIVATE READING DOSSIER
   js/main.js

   Responsibilities:
   - Load text from LANG
   - Switch EN / 中文
   - Save language to localStorage
   - Render paragraph arrays
   - Render tag arrays
   - Render reading path cards
   - Render project cards
   - Toggle full Content Note
   - Toggle mobile menu
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "adeleArchiveLanguage";
  const DEFAULT_LANG = "en";
  const SUPPORTED_LANGS = ["en", "zh"];

  let currentLang = DEFAULT_LANG;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    if (!window.LANG) {
      console.error("LANG object not found. Make sure js/lang.js is loaded before js/main.js.");
      return;
    }

    currentLang = getInitialLanguage();

    applyLanguage(currentLang);
    bindLanguageButtons();
    bindContentNoteToggle();
    bindMobileMenu();
    bindMobileMenuAutoClose();
  }

  /* =========================================================
     LANGUAGE STATE
     ========================================================= */

  function getInitialLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }

    return DEFAULT_LANG;
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = DEFAULT_LANG;
    }

    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLanguage(lang);
  }

  function applyLanguage(lang) {
    const data = window.LANG[lang];

    if (!data) {
      console.error(`Missing language data for: ${lang}`);
      return;
    }

    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.lang = lang;

    updateDocumentMeta(data);
    renderI18nText(data);
    renderLists(data);
    renderTags(data);
    renderReadingRoutes(data);
    renderProjects(data);
    updateLanguageButtons(lang);
    updateContentNoteToggleLabel();
  }

  function updateDocumentMeta(data) {
    if (data.meta?.siteTitle) {
      document.title = data.meta.siteTitle;
    }

    const description = document.querySelector('meta[name="description"]');

    if (description && data.meta?.siteDescription) {
      description.setAttribute("content", data.meta.siteDescription);
    }
  }

  /* =========================================================
     BASIC i18n RENDERING
     ========================================================= */

  function renderI18nText(data) {
    const nodes = document.querySelectorAll("[data-i18n]");

    nodes.forEach((node) => {
      const path = node.getAttribute("data-i18n");
      const value = getByPath(data, path);

      if (value === undefined || value === null) {
        return;
      }

      if (typeof value === "string") {
        setNodeContent(node, value);
      }
    });
  }

  function setNodeContent(node, value) {
    const allowHTML = node.hasAttribute("data-i18n-html");

    if (allowHTML) {
      node.innerHTML = value;
    } else {
      node.textContent = value;
    }
  }

  function getByPath(object, path) {
    if (!object || !path) return undefined;

    return path.split(".").reduce((current, key) => {
      if (current && Object.prototype.hasOwnProperty.call(current, key)) {
        return current[key];
      }
      return undefined;
    }, object);
  }

  /* =========================================================
     PARAGRAPH LISTS
     Example:
     <div data-render-list="home.access.body"></div>
     ========================================================= */

  function renderLists(data) {
    const containers = document.querySelectorAll("[data-render-list]");

    containers.forEach((container) => {
      const path = container.getAttribute("data-render-list");
      const list = getByPath(data, path);

      container.innerHTML = "";

      if (!Array.isArray(list)) return;

      list.forEach((item) => {
        const p = document.createElement("p");
        p.textContent = item;
        container.appendChild(p);
      });
    });
  }

  /* =========================================================
     TAG LISTS
     Example:
     <div data-render-tags="home.hero.tags"></div>
     ========================================================= */

  function renderTags(data) {
    const containers = document.querySelectorAll("[data-render-tags]");

    containers.forEach((container) => {
      const path = container.getAttribute("data-render-tags");
      const tags = getByPath(data, path);

      container.innerHTML = "";

      if (!Array.isArray(tags)) return;

      tags.forEach((tagText) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagText;
        container.appendChild(tag);
      });
    });
  }

  /* =========================================================
     READING PATH ROUTES
     Example:
     <div data-render-reading-routes="home.readingPath.routes"></div>
     ========================================================= */

  function renderReadingRoutes(data) {
    const containers = document.querySelectorAll("[data-render-reading-routes]");
    const template = document.getElementById("reading-route-template");

    if (!template) return;

    containers.forEach((container) => {
      const path = container.getAttribute("data-render-reading-routes");
      const routes = getByPath(data, path);

      container.innerHTML = "";

      if (!Array.isArray(routes)) return;

      routes.forEach((route) => {
        const fragment = template.content.cloneNode(true);
        const card = fragment.querySelector(".path-card");

        setFieldText(fragment, "id", route.id);
        setFieldText(fragment, "title", route.title);
        setFieldText(fragment, "description", route.description);

        const list = fragment.querySelector('[data-field="items"]');

        if (list && Array.isArray(route.items)) {
          list.innerHTML = "";

          route.items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
          });
        }

        if (card && route.id) {
          card.classList.add(`path-card--${sanitizeClassName(route.id)}`);
        }

        container.appendChild(fragment);
      });
    });
  }

  /* =========================================================
     PROJECT CARDS
     Example:
     <div data-render-projects="mainProject,nightOfSilence"></div>
     ========================================================= */

  function renderProjects(data) {
    const containers = document.querySelectorAll("[data-render-projects]");
    const template = document.getElementById("project-card-template");

    if (!template) return;

    containers.forEach((container) => {
      const keys = container
        .getAttribute("data-render-projects")
        .split(",")
        .map((key) => key.trim())
        .filter(Boolean);

      container.innerHTML = "";

      keys.forEach((key) => {
        const project = data.projects?.[key];

        if (!project) {
          console.warn(`Project data not found: ${key}`);
          return;
        }

        const card = createProjectCard(template, project, key, data);
        container.appendChild(card);
      });
    });
  }

  function createProjectCard(template, project, key, data) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".project-card");

    if (!card) {
      return fragment;
    }

    card.classList.add(`project-card--${key}`);

    setFieldText(fragment, "id", project.id);
    setFieldText(fragment, "title", project.title);
    setFieldText(fragment, "subtitle", project.subtitle);
    setFieldText(fragment, "description", project.description);
    setFieldText(fragment, "pdfNote", project.pdfNote);
    setFieldText(fragment, "note", project.note);

    renderProjectMeta(fragment, project.meta, data);
    renderProjectFocus(fragment, project.focus);
    renderProjectButtons(fragment, project, key, data);

    return fragment;
  }

  function renderProjectMeta(fragment, meta, data) {
    const metaContainer = fragment.querySelector('[data-field="meta"]');

    if (!metaContainer || !meta || typeof meta !== "object") {
      if (metaContainer) metaContainer.remove();
      return;
    }

    metaContainer.innerHTML = "";

    Object.entries(meta).forEach(([key, value]) => {
      if (!value) return;

      const wrapper = document.createElement("div");
      wrapper.className = "project-meta__item";

      const dt = document.createElement("dt");
      dt.textContent = getMetaLabel(key, data);

      const dd = document.createElement("dd");
      dd.textContent = value;

      wrapper.appendChild(dt);
      wrapper.appendChild(dd);
      metaContainer.appendChild(wrapper);
    });
  }

  function getMetaLabel(key, data) {
    const common = data.common || {};

    const labels = {
      format: common.format || "Format",
      players: common.players || "Players",
      duration: common.duration || "Duration",
      language: common.language || "Language",
      status: common.status || "Status",
      type: common.type || "Type",
      pitch: "Pitch",
      pageType: common.pageType || "Page Type",
    };

    return labels[key] || titleCase(key);
  }

  function renderProjectFocus(fragment, focus) {
    const container = fragment.querySelector('[data-field="focus"]');

    if (!container || !Array.isArray(focus) || focus.length === 0) {
      if (container) container.remove();
      return;
    }

    container.innerHTML = "";

    focus.forEach((item) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = item;
      container.appendChild(tag);
    });
  }

  function renderProjectButtons(fragment, project, key, data) {
    const container = fragment.querySelector('[data-field="buttons"]');

    if (!container) return;

    container.innerHTML = "";

    const primaryText = project.buttons?.primary;
    const secondaryText = project.buttons?.secondary;

    if (primaryText) {
      const primary = document.createElement("a");
      primary.className = "button button-primary";
      primary.href = getPrimaryHref(key);
      primary.textContent = primaryText;
      container.appendChild(primary);
    }

    if (secondaryText) {
      const secondary = document.createElement("a");
      secondary.className = "button button-secondary";
      secondary.href = project.pdf || getSecondaryHref(key);
      secondary.textContent = secondaryText;

      if (project.pdf) {
        secondary.setAttribute("download", "");
      }

      container.appendChild(secondary);
    }

    if (!primaryText && !secondaryText) {
      container.remove();
    }
  }

  function getPrimaryHref(key) {
    const hrefMap = {
      mainProject: "main-project.html",
      nightOfSilence: "night-of-silence.html",
      reliquarians: "reliquarians.html",
      firstGospel: "first-gospel.html",
      noahDreams: "noah-dreams.html",
      eden: "eden.html",
      templeGuide: "temple-guide.html",
      archiveNotices: "archive-notices.html",
    };

    return hrefMap[key] || "#";
  }

  function getSecondaryHref(key) {
    const hrefMap = {
      mainProject: "main-project.html",
      nightOfSilence: "night-of-silence.html",
      reliquarians: "reliquarians.html",
      firstGospel: "first-gospel.html",
      noahDreams: "noah-dreams.html",
      eden: "eden.html",
      templeGuide: "temple-guide.html",
      archiveNotices: "archive-notices.html",
    };

    return hrefMap[key] || "#";
  }

  function setFieldText(root, fieldName, value) {
    const node = root.querySelector(`[data-field="${fieldName}"]`);

    if (!node) return;

    if (value === undefined || value === null || value === "") {
      node.remove();
      return;
    }

    node.textContent = value;
  }

  /* =========================================================
     LANGUAGE BUTTONS
     ========================================================= */

  function bindLanguageButtons() {
    const buttons = document.querySelectorAll("[data-lang-button]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.getAttribute("data-lang-button");
        setLanguage(lang);
      });
    });
  }

  function updateLanguageButtons(lang) {
    const buttons = document.querySelectorAll("[data-lang-button]");

    buttons.forEach((button) => {
      const buttonLang = button.getAttribute("data-lang-button");
      const isActive = buttonLang === lang;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  /* =========================================================
     CONTENT NOTE TOGGLE
     ========================================================= */

  function bindContentNoteToggle() {
    const toggle = document.querySelector('[data-action="toggle-content-note"]');
    const panel = document.getElementById("content-note-full");

    if (!toggle || !panel) return;

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;

      toggle.setAttribute("aria-expanded", String(nextExpanded));
      panel.hidden = !nextExpanded;

      updateContentNoteToggleLabel();
    });
  }

  function updateContentNoteToggleLabel() {
    const toggle = document.querySelector('[data-action="toggle-content-note"]');
    const panel = document.getElementById("content-note-full");

    if (!toggle || !panel || !window.LANG?.[currentLang]) return;

    const label = toggle.querySelector("[data-i18n]") || toggle;
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    const langData = window.LANG[currentLang];

    label.textContent = isExpanded
      ? langData.buttons.hideContentNote
      : langData.buttons.viewContentNote;
  }

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function bindMobileMenu() {
    const toggle = document.querySelector('[data-action="toggle-menu"]');
    const menu = document.getElementById("mobile-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;

      toggle.setAttribute("aria-expanded", String(nextExpanded));
      menu.hidden = !nextExpanded;
    });
  }

  function bindMobileMenuAutoClose() {
    const toggle = document.querySelector('[data-action="toggle-menu"]');
    const menu = document.getElementById("mobile-menu");
    const links = document.querySelectorAll(".mobile-menu__link");

    if (!toggle || !menu || links.length === 0) return;

    links.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      });
    });
  }

  /* =========================================================
     HELPERS
     ========================================================= */

  function titleCase(value) {
    return String(value)
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  }

  function sanitizeClassName(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
})();


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
