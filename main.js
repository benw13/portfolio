// LinkedIn profile URL. Paste the full link here (e.g. "https://www.linkedin.com/in/your-handle/").
const LINKEDIN_URL = "";

const root = document.documentElement;

// Hero load sequence
const reveal = () => root.classList.add("loaded");
requestAnimationFrame(() => requestAnimationFrame(reveal));
setTimeout(reveal, 300); // rAF can stall in background tabs

// Theme toggle
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

// Nav border + active section
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const links = [...document.querySelectorAll(".nav-links a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id));
    links.forEach((a) => a.hasAttribute("aria-current") && a.setAttribute("aria-current", "true"));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => spy.observe(s));

// Generic tab switcher: buttons with data-key swap images with matching data-key
function tabs(tablist, view, onChange) {
  const buttons = [...tablist.querySelectorAll("[role=tab]")];
  const select = (btn) => {
    buttons.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    view.querySelectorAll("img").forEach((img) => img.classList.toggle("on", img.dataset.key === btn.dataset.key));
    onChange?.(btn);
  };
  buttons.forEach((b, i) => {
    b.addEventListener("click", () => select(b));
    b.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      const next = buttons[(i + d + buttons.length) % buttons.length];
      next.focus();
      select(next);
    });
  });
  return { buttons, select };
}

const caption = document.getElementById("screenCaption");
const phone = tabs(document.querySelector(".screen-tabs"), document.getElementById("phoneScreen"), (b) => {
  caption.textContent = b.dataset.cap;
});
tabs(document.querySelector("#coursetwin .seg"), document.getElementById("ctView"));

// Waterfall chart for the arbitrage result: draws once when scrolled into view
const chart = document.querySelector(".edge-chart");
function layoutEdge(animate) {
  const H = chart.clientHeight;
  const k = 11; // px per cent
  const zero = 26 + 2.2 * k; // leave room above for the positive bar's label
  chart.querySelector(".zero").style.top = zero + "px";
  chart.querySelectorAll(".ebar").forEach((bar) => {
    const v = parseFloat(bar.dataset.v);
    const from = parseFloat(bar.dataset.from || 0);
    const fill = bar.querySelector(".fill");
    const val = bar.querySelector(".val");
    const top = zero - Math.max(from, from + v) * k;
    const h = Math.max(Math.abs(v) * k, bar.hasAttribute("data-count") ? 3 : 0);
    if (!animate) {
      fill.style.top = zero + "px";
      fill.style.height = "0px";
      val.style.top = zero - 22 + "px";
      val.style.opacity = "0";
      return;
    }
    fill.style.top = top + "px";
    fill.style.height = h + "px";
    const below = v < 0 && !bar.hasAttribute("data-from") || bar.hasAttribute("data-count");
    val.style.top = (below ? top + h + 4 : top - 22) + "px";
    if (bar.hasAttribute("data-from")) val.style.top = top + h / 2 - 10 + "px";
    val.style.opacity = "1";
    val.style.transition = "top .9s cubic-bezier(.2,.8,.2,1), opacity .4s .5s";
    if (bar.hasAttribute("data-from")) {
      // fee label sits on a pill over the striped bar
    }
  });
}
layoutEdge(false);
let drawn = false;
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) {
    drawn = true;
    layoutEdge(true);
    obs.disconnect();
  }
}, { threshold: 0.5 }).observe(chart);
addEventListener("resize", () => drawn && layoutEdge(true));

// Copy email
const copyBtn = document.getElementById("copyEmail");
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = "Email copied";
  } catch {
    copyBtn.textContent = copyBtn.dataset.email;
  }
  setTimeout(() => (copyBtn.textContent = "Copy email"), 2200);
});

// LinkedIn: hide the button until a URL is configured
const li = document.getElementById("linkedinBtn");
if (LINKEDIN_URL) li.href = LINKEDIN_URL;
else li.remove();

document.getElementById("year").textContent = new Date().getFullYear();
