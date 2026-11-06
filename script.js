const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...nav.querySelectorAll("ul a[href^='#']")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const year = document.querySelector("[data-year]");
const form = document.querySelector("[data-contact-form]");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function setNavOpen(isOpen) {
  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

navToggle.addEventListener("click", () => {
  setNavOpen(!nav.classList.contains("is-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavOpen(false);
  }
});

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);

  const marker = window.scrollY + header.offsetHeight + 24;
  let current = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= marker) {
      current = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
  });
}

document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const revealItems = document.querySelectorAll(".section, .hero-card, .project-card");
revealItems.forEach((item) => item.classList.add("reveal"));

function showError(name, message) {
  const error = form.querySelector(`[data-error-for="${name}"]`);
  const field = form.elements[name];
  error.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = form.querySelector("[data-form-status]");
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  showError("name", name ? "" : "Please enter your name.");
  showError("email", emailLooksValid ? "" : "Enter a valid email address.");
  showError("message", message.length >= 10 ? "" : "Add a few more words about the project.");

  if (!name || !emailLooksValid || message.length < 10) {
    status.textContent = "";
    return;
  }

  const subject = encodeURIComponent(`Project inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
  status.textContent = "Your email app should open with this message ready to send.";
  form.reset();
});
