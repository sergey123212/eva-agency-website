const menuButton = document.querySelector(".menu-button");
const siteMenu = document.querySelector(".site-menu");
const menuLinks = document.querySelectorAll(".site-menu-links a");
const messageLink = document.querySelector(".message-link");
const packageButtons = document.querySelectorAll(".package-hotspot");
const contactActions = document.querySelectorAll(".contact-action");
const breakdownItems = document.querySelectorAll(".breakdown-item");
const faqItems = document.querySelectorAll(".faq-item");
const breakdownReferenceView = document.querySelector(".breakdown-reference-view");
const breakdownReferenceImage = document.querySelector(".breakdown-reference-img");
const breakdownReferenceButtons = document.querySelectorAll(".breakdown-reference-hit");
const requestModal = document.querySelector("[data-request-modal]");
const requestForm = document.querySelector("[data-request-form]");
const requestPackageField = document.querySelector("[data-package-field]");
const requestCloseButtons = document.querySelectorAll("[data-request-close]");
const requestFormView = document.querySelector("[data-request-form-view]");
const requestSuccess = document.querySelector("[data-request-success]");
const requestError = document.querySelector("[data-request-error]");
const requestSubmit = requestForm?.querySelector(".request-submit");
const requestEmailField = requestForm?.querySelector('input[name="email"]');
const requestPhoneField = requestForm?.querySelector('input[name="phone"]');

const getPhoneDigits = (value) => value.replace(/\D/g, "");

const groupPhoneTail = (digits) => {
  const groups = [];
  let cursor = 0;
  const pattern = [3, 3, 2, 2, 2, 2];

  pattern.forEach((size) => {
    if (cursor < digits.length) {
      groups.push(digits.slice(cursor, cursor + size));
      cursor += size;
    }
  });

  if (cursor < digits.length) {
    groups.push(digits.slice(cursor));
  }

  return groups.filter(Boolean).join(" ");
};

const getPhoneLimit = (digits) => {
  if (digits.startsWith("380")) {
    return 12;
  }

  if (digits.startsWith("1")) {
    return 11;
  }

  return 15;
};

const formatPhoneNumber = (value) => {
  const digits = getPhoneDigits(value);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("380")) {
    const operator = digits.slice(3, 5);
    const first = digits.slice(5, 8);
    const second = digits.slice(8, 10);
    const third = digits.slice(10, 12);
    const tail = [first, second, third].filter(Boolean).join(" ");

    return `+380${operator ? ` (${operator})` : ""}${tail ? ` ${tail}` : ""}`;
  }

  if (digits.startsWith("1")) {
    const area = digits.slice(1, 4);
    const first = digits.slice(4, 7);
    const second = digits.slice(7, 11);

    return `+1${area ? ` (${area})` : ""}${first ? ` ${first}` : ""}${second ? ` ${second}` : ""}`;
  }

  const countryLength = digits.length > 11 ? 3 : digits.length > 10 ? 2 : 1;
  const country = digits.slice(0, countryLength);
  const rest = digits.slice(countryLength);

  return `+${country}${rest ? ` ${groupPhoneTail(rest)}` : ""}`;
};

const validateEmailField = () => {
  if (!requestEmailField) {
    return true;
  }

  const value = requestEmailField.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

  requestEmailField.setCustomValidity(value && !isValid ? "Please enter a valid email address." : "");
  return requestEmailField.checkValidity();
};

const validatePhoneField = () => {
  if (!requestPhoneField) {
    return true;
  }

  const digits = getPhoneDigits(requestPhoneField.value);

  if (!digits) {
    requestPhoneField.dataset.phoneTooLong = "";
    requestPhoneField.setCustomValidity("");
    return requestPhoneField.checkValidity();
  }

  if (requestPhoneField.dataset.phoneTooLong === "true") {
    requestPhoneField.setCustomValidity("Phone number is too long. Please check it.");
    return false;
  }

  if (digits.startsWith("380") && digits.length !== 12) {
    requestPhoneField.setCustomValidity("Please enter the full phone number.");
    return false;
  }

  if (digits.startsWith("1") && digits.length !== 11) {
    requestPhoneField.setCustomValidity("Please enter the full phone number.");
    return false;
  }

  if (!digits.startsWith("380") && !digits.startsWith("1") && digits.length < 10) {
    requestPhoneField.setCustomValidity("Please enter the full phone number.");
    return false;
  }

  if (digits.length > 15) {
    requestPhoneField.setCustomValidity("Phone number is too long. Please check it.");
    return false;
  }

  requestPhoneField.setCustomValidity("");
  return true;
};

const closeBreakdownItem = (item) => {
  const panel = item.querySelector(".breakdown-panel");
  const trigger = item.querySelector(".breakdown-trigger");

  item.classList.remove("is-open");
  trigger?.setAttribute("aria-expanded", "false");

  if (panel) {
    panel.style.transition = "none";
    panel.style.maxHeight = "0px";
    panel.style.opacity = "0";
    panel.offsetHeight;
    window.setTimeout(() => {
      panel.style.transition = "";
      panel.style.opacity = "";
    }, 40);
  }
};

const openBreakdownItem = (item) => {
  const panel = item.querySelector(".breakdown-panel");
  const panelInner = item.querySelector(".breakdown-panel-inner");
  const trigger = item.querySelector(".breakdown-trigger");

  item.classList.add("is-open");
  trigger?.setAttribute("aria-expanded", "true");

  if (panel && panelInner) {
    panel.style.transition = "";
    panel.style.opacity = "";
    panel.style.maxHeight = `${panelInner.scrollHeight}px`;
  }
};

const closeFaqItem = (item) => {
  const panel = item.querySelector(".faq-answer");
  const trigger = item.querySelector(".faq-question");

  item.classList.remove("is-open");
  trigger?.setAttribute("aria-expanded", "false");

  if (panel) {
    panel.style.maxHeight = "0px";
  }
};

const openFaqItem = (item) => {
  const panel = item.querySelector(".faq-answer");
  const panelInner = item.querySelector(".faq-answer-inner");
  const trigger = item.querySelector(".faq-question");

  item.classList.add("is-open");
  trigger?.setAttribute("aria-expanded", "true");

  if (panel && panelInner) {
    panel.style.maxHeight = `${panelInner.scrollHeight}px`;
  }
};

const openRequestModal = (packageName) => {
  if (!requestModal || !requestForm || !requestPackageField) {
    return;
  }

  requestPackageField.value = packageName || "Quick Start";
  requestFormView.hidden = false;
  requestSuccess.hidden = true;
  requestError.textContent = "";
  requestEmailField?.setCustomValidity("");
  requestPhoneField?.setCustomValidity("");
  requestModal.classList.add("is-open");
  requestModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("request-modal-open");

  window.setTimeout(() => {
    requestForm.querySelector('input[name="name"]')?.focus();
  }, 180);
};

const closeRequestModal = () => {
  if (!requestModal) {
    return;
  }

  requestModal.classList.remove("is-open");
  requestModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("request-modal-open");
};

const encodeFormData = (formData) =>
  new URLSearchParams([...formData.entries()].map(([key, value]) => [key, String(value)])).toString();

const closeMenu = () => {
  menuButton?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  siteMenu?.classList.remove("is-open");
  siteMenu?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
};

const openMenu = () => {
  menuButton?.classList.add("is-open");
  menuButton?.setAttribute("aria-expanded", "true");
  siteMenu?.classList.add("is-open");
  siteMenu?.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
};

const scrollToAnchor = (href) => {
  if (!href?.startsWith("#")) {
    return false;
  }

  const target = document.querySelector(href);

  if (!target) {
    return false;
  }

  const marginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - marginTop;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });

  return true;
};

menuButton?.addEventListener("click", () => {
  if (menuButton.classList.contains("is-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

menuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (scrollToAnchor(href)) {
      event.preventDefault();
      closeMenu();
    }
  });
});

messageLink?.addEventListener("click", (event) => {
  const href = messageLink.getAttribute("href");

  if (scrollToAnchor(href)) {
    event.preventDefault();
    messageLink.classList.add("is-clicked");
    window.setTimeout(() => messageLink.classList.remove("is-clicked"), 220);
  }
});

packageButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    button.classList.add("is-clicked");
    window.setTimeout(() => button.classList.remove("is-clicked"), 220);
    openRequestModal(button.dataset.package);
  });
});

requestCloseButtons.forEach((button) => {
  button.addEventListener("click", closeRequestModal);
});

requestEmailField?.addEventListener("input", () => {
  validateEmailField();
});

requestPhoneField?.addEventListener("input", () => {
  const cursorWasAtEnd = requestPhoneField.selectionStart === requestPhoneField.value.length;
  const rawDigits = getPhoneDigits(requestPhoneField.value);

  requestPhoneField.dataset.phoneTooLong = rawDigits.length > getPhoneLimit(rawDigits) ? "true" : "";
  requestPhoneField.value = formatPhoneNumber(requestPhoneField.value);
  validatePhoneField();

  if (cursorWasAtEnd) {
    requestPhoneField.setSelectionRange(requestPhoneField.value.length, requestPhoneField.value.length);
  }
});

requestModal?.addEventListener("click", (event) => {
  if (event.target === requestModal) {
    closeRequestModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteMenu?.classList.contains("is-open")) {
    closeMenu();
  }

  if (event.key === "Escape" && requestModal?.classList.contains("is-open")) {
    closeRequestModal();
  }
});

requestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  validateEmailField();
  validatePhoneField();

  if (!requestForm.checkValidity()) {
    requestForm.reportValidity();
    return;
  }

  const formData = new FormData(requestForm);
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  requestError.textContent = "";
  requestSubmit.disabled = true;
  requestSubmit.querySelector("span:first-child").textContent = "Sending...";

  try {
    if (!isLocal) {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(formData),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }
    }

    requestForm.reset();
    requestFormView.hidden = true;
    requestSuccess.hidden = false;
  } catch (error) {
    requestError.textContent = "Something went wrong. Please try again or contact us directly.";
  } finally {
    requestSubmit.disabled = false;
    requestSubmit.querySelector("span:first-child").textContent = "Send request";
  }
});

contactActions.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#message") {
      event.preventDefault();
    }

    link.classList.add("is-clicked");
    window.setTimeout(() => link.classList.remove("is-clicked"), 220);
  });
});

breakdownItems.forEach((item) => {
  const trigger = item.querySelector(".breakdown-trigger");
  const panel = item.querySelector(".breakdown-panel");
  const panelInner = item.querySelector(".breakdown-panel-inner");

  if (item.classList.contains("is-open") && panel && panelInner) {
    panel.style.maxHeight = `${panelInner.scrollHeight}px`;
  }

  trigger?.addEventListener("click", () => {
    if (item.classList.contains("is-open")) {
      closeBreakdownItem(item);
      return;
    }

    breakdownItems.forEach((current) => {
      if (current === item) {
        openBreakdownItem(current);
      } else {
        closeBreakdownItem(current);
      }
    });
  });
});

faqItems.forEach((item) => {
  const trigger = item.querySelector(".faq-question");
  const panel = item.querySelector(".faq-answer");
  const panelInner = item.querySelector(".faq-answer-inner");

  if (item.classList.contains("is-open") && panel && panelInner) {
    panel.style.maxHeight = `${panelInner.scrollHeight}px`;
  }

  trigger?.addEventListener("click", () => {
    if (item.classList.contains("is-open")) {
      closeFaqItem(item);
      return;
    }

    faqItems.forEach((current) => {
      if (current === item) {
        openFaqItem(current);
      } else {
        closeFaqItem(current);
      }
    });
  });
});

window.addEventListener("resize", () => {
  breakdownItems.forEach((item) => {
    const panel = item.querySelector(".breakdown-panel");
    const panelInner = item.querySelector(".breakdown-panel-inner");

    if (item.classList.contains("is-open") && panel && panelInner) {
      panel.style.maxHeight = `${panelInner.scrollHeight}px`;
    }
  });

  faqItems.forEach((item) => {
    const panel = item.querySelector(".faq-answer");
    const panelInner = item.querySelector(".faq-answer-inner");

    if (item.classList.contains("is-open") && panel && panelInner) {
      panel.style.maxHeight = `${panelInner.scrollHeight}px`;
    }
  });
});

document.querySelectorAll(".breakdown-panel img").forEach((image) => {
  image.addEventListener("load", () => {
    const item = image.closest(".breakdown-item.is-open");
    const panel = item?.querySelector(".breakdown-panel");
    const panelInner = item?.querySelector(".breakdown-panel-inner");

    if (panel && panelInner) {
      panel.style.maxHeight = `${panelInner.scrollHeight}px`;
    }
  });
});

breakdownReferenceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const state = button.dataset.breakdownState;

    if (!state || !breakdownReferenceImage || !breakdownReferenceView) {
      return;
    }

    const nextState = breakdownReferenceView.dataset.activeState === state ? "0" : state;
    breakdownReferenceView.dataset.activeState = nextState;
    breakdownReferenceImage.src = `assets/service-breakdown/states/state-${nextState}.png?v=1`;
    breakdownReferenceImage.alt =
      nextState === "0"
        ? "Full service breakdown with all accordion items closed."
        : `Full service breakdown state ${nextState} expanded.`;
  });
});
