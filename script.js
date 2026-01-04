// script.js
// =======================================
// Dark / Light Theme Toggle (Header Icon)
// =======================================
const rootEl = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  rootEl.setAttribute("data-theme", savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === "dark" ? "🌙" : "☀️";
  }
}

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = rootEl.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    rootEl.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "🌙" : "☀️";
  });
}

// =======================================
// Mobile Navigation Toggle
// =======================================
const navToggle = document.querySelector(".nav-toggle");
const navLinksContainer = document.getElementById("nav-links");

if (navToggle && navLinksContainer) {
  navToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("open");
  });
}

// Close mobile menu on clicking a link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinksContainer) navLinksContainer.classList.remove("open");
  });
});

// =======================================
// Navigation Highlight on Scroll
// =======================================
const sections = document.querySelectorAll("main section");

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  let currentId = null;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      currentId = section.id;
    }
  });

  // When at very bottom → highlight Contact section
  const scrollBottom = window.innerHeight + window.scrollY;
  const pageHeight = document.body.offsetHeight;

  if (scrollBottom >= pageHeight - 5) {
    const lastSection = sections[sections.length - 1];
    currentId = lastSection.id;
  }

  if (!currentId) return;

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentId}`);
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

// =======================================
// Reveal Sections on Scroll
// =======================================
const revealElements = document.querySelectorAll(".reveal");

const observerReveal = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => observerReveal.observe(el));

// =======================================
// Skills Filter Logic
// =======================================
const chips = document.querySelectorAll("[data-skill-filter]");
const skillCards = document.querySelectorAll(".skill-card");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.getAttribute("data-skill-filter");
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    skillCards.forEach((card) => {
      const group = card.getAttribute("data-skill-group");
      card.style.display = filter === "all" || filter === group ? "" : "none";
    });
  });
});

// =======================================
// Boot Loading Screen (every visit)
// =======================================
document.addEventListener("DOMContentLoaded", () => {
  const bootScreen = document.getElementById("boot-screen");
  const bootLogEl = document.getElementById("boot-log");

  if (!bootScreen || !bootLogEl) return;

  const bootLines = [
    "[  OK  ] Initializing system...",
    "[  OK  ] Loading kernel modules...",
    "[  OK  ] Starting network services...",
    "[  OK  ] System ready.✓"
  ];

  let lineIndex = 0;
  let charIndex = 0;

  // Make sure it's visible
  bootScreen.classList.remove("boot-hide");

  function typeBootStep() {
    if (lineIndex >= bootLines.length) {
      // Finished typing all lines → small delay then hide
      setTimeout(() => {
        bootScreen.classList.add("boot-hide");
      }, 500);
      return;
    }

    const finishedLines = bootLines.slice(0, lineIndex).join("\n");
    const currentLine = bootLines[lineIndex];
    const currentText = currentLine.slice(0, charIndex + 1);

    bootLogEl.textContent =
      (finishedLines ? finishedLines + "\n" : "") + currentText;

    charIndex++;

    if (charIndex >= currentLine.length) {
      charIndex = 0;
      lineIndex++;
      setTimeout(typeBootStep, 200); // pause between lines
    } else {
      setTimeout(typeBootStep, 15); // typing speed
    }
  }

  typeBootStep();
});

// =======================================
// Terminal Typing Animation
// =======================================
const terminalOutput = document.getElementById("terminal-output");
// =======================================
// Hidden Terminal Commands (Easter Egg)
// =======================================
const hiddenCommands = {
  help: "Available commands: help, whoami, skills, projects, clear",
  whoami: "Hithaishi S P — Cybersecurity Analyst | MCA Student",
  skills: "Python, SIEM, Wireshark, AWS, Incident Response, SOC",
  projects: "Ransomware Detection | Phishing Detection (ML) | Mandya Mobility Hub",
};

const terminalInput = document.getElementById("terminal-input");
if (terminalInput) {
  terminalInput.disabled = false;
}

if (terminalInput && terminalOutput) {
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const cmd = terminalInput.value.trim();
    if (!cmd) return;

    // STOP animation permanently once user types
    clearTypingTimeout();
    interactiveMode = true;

    terminalOutput.innerHTML +=
      `\n<span class="log-root">root@hithaishi:~$</span> ${cmd}\n`;

    if (cmd === "clear") {
      terminalOutput.innerHTML = "";
    } else {
      terminalOutput.innerHTML +=
        (hiddenCommands[cmd] || "command not found") + "\n";
    }

    terminalInput.value = "";
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });
}



const terminalLines = [
  "root@hithaishi:~$ booting SOC monitoring engine...",
  "[INFO] ingesting logs from AWS CloudTrail...",
  "[INFO] ingesting logs from Firewall Gateway...",
  "[INFO] MITRE ATT&CK mapping enabled.",

  "root@hithaishi:~$ detecting anomalies...",
  "→ no active threats detected.",
  "root@hithaishi:~$ system status: secure ✓✓✓"
];

let lineIndexTerm = 0;
let charIndexTerm = 0;
let heroInView = true;
let typingTimeoutId = null;
let isTyping = false;
let interactiveMode = false;

/* Color formatting + blinking cursor */
function renderTerminalText(rawText) {
  if (!terminalOutput) return;

  let html = rawText
    .replaceAll("root@hithaishi:~$", '<span class="log-root">root@hithaishi:~$</span>')
    .replaceAll("[INFO]", '<span class="log-info">[INFO]</span>')
    .replaceAll("→", '<span class="log-arrow">→</span>')
    .replaceAll("system status: secure ✓", '<span class="log-status">system status: secure ✓</span>');

  terminalOutput.innerHTML = html + '<span class="terminal-cursor">█</span>';
}

function clearTypingTimeout() {
  if (typingTimeoutId !== null) {
    clearTimeout(typingTimeoutId);
    typingTimeoutId = null;
  }
}

function typeStep() {
  if (!terminalOutput || !heroInView || interactiveMode) {
    isTyping = false;
    return;
  }



  // End of lines → pause 4 seconds → restart
  if (lineIndexTerm >= terminalLines.length) {
    typingTimeoutId = setTimeout(() => {
      lineIndexTerm = 0;
      charIndexTerm = 0;
      terminalOutput.innerHTML = "";
      if (heroInView) typeStep();
    }, 4000);
    return;
  }

  const finishedLines = terminalLines.slice(0, lineIndexTerm).join("\n");
  const currentLine = terminalLines[lineIndexTerm];
  const currentText = currentLine.slice(0, charIndexTerm + 1);

  renderTerminalText(
    (finishedLines ? finishedLines + "\n" : "") + currentText
  );

  charIndexTerm++;

  // Finished current line → move to next
  if (charIndexTerm >= currentLine.length) {
    charIndexTerm = 0;
    lineIndexTerm++;

    const delay = 500 + Math.random() * 250; // slow with jitter
    typingTimeoutId = setTimeout(typeStep, delay);
  } else {
    const delay = 60 + Math.random() * 40; // jitter typing
    typingTimeoutId = setTimeout(typeStep, delay);
  }
}

// Observe hero section (pause/resume typing)
const heroSection = document.getElementById("hero");
if (heroSection) {
  const heroObserver = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      heroInView = true;

      // ONLY restart animation if user has NOT typed
      if (!interactiveMode) {
        terminalOutput.innerHTML = "";
        lineIndexTerm = 0;
        charIndexTerm = 0;
        typeStep();
      }
    } else {
      heroInView = false;
      clearTypingTimeout();
      isTyping = false;
    }
  },
  { threshold: 0.5 }
);


  // Start typing immediately on load (home in view)
  heroInView = true;
  typeStep();
}

// =======================================
// Cursor Particle Effect (desktop only)
// =======================================
const cursorCanvas = document.getElementById("cursor-canvas");
let ctx = null;
let particles = [];
let useParticles = false;

if (cursorCanvas) {
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (hasFinePointer) {
    useParticles = true;
    ctx = cursorCanvas.getContext("2d");

    function resizeCanvas() {
      cursorCanvas.width = window.innerWidth;
      cursorCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", (e) => {
      if (!useParticles) return;
      const rect = cursorCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn a few particles per move
      for (let i = 0; i < 3; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          life: 700 + Math.random() * 400,
          born: performance.now()
        });
      }
    });

    function renderParticles(now) {
      if (!ctx) return;
      ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

      particles = particles.filter((p) => now - p.born < p.life);

      particles.forEach((p) => {
        const t = (now - p.born) / p.life;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = 1 - t;
        const radius = 2 + (1 - t) * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

        const isLight = document.documentElement.getAttribute("data-theme") === "light";

        ctx.fillStyle = isLight
          ? `rgba(38, 164, 255, ${alpha * 0.7})`
          : `rgba(8, 247, 163, ${alpha * 0.7})`;

        ctx.fill();

      });

      requestAnimationFrame(renderParticles);
    }

    requestAnimationFrame(renderParticles);
  }
}

// =======================================
// 3D Tilt Effect for Hero Card
// =======================================
const heroCard = document.querySelector(".hero-card");

if (heroCard) {
  heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((rect.height / 2 - y) / rect.height) * 10; // max 10deg
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;

    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    heroCard.classList.add("tilted");
  });

  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateX(0deg) rotateY(0deg)";
    heroCard.classList.remove("tilted");
  });
}

// =======================================
// Footer Year Auto Update
// =======================================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
// =======================================
// Accessibility & Lighthouse Boost
// =======================================

// Reduced motion support
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("reduce-motion");
}

// Disable heavy effects on mobile
if (window.innerWidth < 768) {
  const cursorCanvas = document.getElementById("cursor-canvas");
  if (cursorCanvas) cursorCanvas.style.display = "none";
}

// Passive listeners for performance
window.addEventListener("scroll", () => { }, { passive: true });
window.addEventListener("touchstart", () => { }, { passive: true });
// =======================================
// Profile Image Overlay Logic
// =======================================
const avatar = document.querySelector(".clickable-avatar");
const overlay = document.getElementById("avatar-overlay");
const closeBtn = document.querySelector(".overlay-close"); // ← ADD HERE

// Always start CLOSED
if (overlay) {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
}

if (avatar && overlay) {
  avatar.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  // Click outside image → close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeAvatarOverlay();
  });

  // Close button (✕) handler
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAvatarOverlay();
    });
  }

  // ESC key → close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeAvatarOverlay();
    }
  });
}

function closeAvatarOverlay() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
