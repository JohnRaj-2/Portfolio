const root = document.documentElement;
root.classList.add("js");

const themeBtn = document.querySelector(".theme-btn");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  const light = theme === "light";
  themeBtn.setAttribute("aria-pressed", String(light));
  themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  if (themeMeta) themeMeta.setAttribute("content", light ? "#f6f1e7" : "#0b1220");
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    /* storage can be blocked; the toggle still works for this visit */
  }
};

applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

themeBtn.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
});

const nav = document.querySelector(".nav-bar");
const menuBtn = document.querySelector(".menu-btn");
const siteNav = document.querySelector(".site-nav");

const setMenu = (open) => {
  siteNav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
};

menuBtn.addEventListener("click", () => {
  setMenu(!siteNav.classList.contains("open"));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("click", (event) => {
  if (!siteNav.classList.contains("open")) return;
  if (siteNav.contains(event.target) || menuBtn.contains(event.target)) return;
  setMenu(false);
});

const onScroll = () => {
  nav.classList.toggle("scrolled", window.scrollY > 8);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const reveals = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("in"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => revealObserver.observe(el));
}

const navLinks = [...siteNav.querySelectorAll("a[href^='#']")];

if ("IntersectionObserver" in window) {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => spy.observe(section));
}

const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const href = `mailto:chandnigupta271002@gmail.com?subject=${encodeURIComponent(
    "Hello from your portfolio"
  )}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = "Opening your email app…";
  window.location.href = href;
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
