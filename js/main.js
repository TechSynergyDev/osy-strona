/* =========================================================
   OsaStop — interakcje + animowane osy (SVG)
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Rok w stopce ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- HERO: płynne pojawienie zdjęcia ---------- */
  var heroImg = document.querySelector(".hero__img");
  if (heroImg) {
    var showHero = function () { heroImg.classList.add("is-ready"); };
    if (heroImg.complete && heroImg.naturalWidth) showHero();
    else {
      heroImg.addEventListener("load", showHero, { once: true });
      heroImg.addEventListener("error", showHero, { once: true });
    }
    setTimeout(showHero, 2500);
  }

  /* ---------- Osa w SVG (budowana dynamicznie, unikalne ID) ---------- */
  function waspSVG(i) {
    var g = "wg" + i, c = "wc" + i;
    return '' +
      '<svg viewBox="0 0 150 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#ffe07a"/>' +
            '<stop offset="0.55" stop-color="#ffc21c"/>' +
            '<stop offset="1" stop-color="#e79a05"/>' +
          '</linearGradient>' +
          '<clipPath id="' + c + '"><ellipse cx="56" cy="48" rx="32" ry="19"/></clipPath>' +
        '</defs>' +

        /* skrzydła */
        '<g fill="#eaf3ff" stroke="#bcd2f0" stroke-width="0.8">' +
          '<path class="wasp__wing wasp__wing--back" d="M96 34 C 78 4, 42 6, 38 24 C 44 35, 74 41, 96 34 Z"/>' +
          '<path class="wasp__wing wasp__wing--front" d="M99 37 C 86 14, 56 11, 52 28 C 59 39, 84 45, 99 37 Z"/>' +
        '</g>' +

        '<g class="wasp__body">' +
          /* nogi */
          '<g stroke="#17110a" stroke-width="2.4" stroke-linecap="round">' +
            '<path d="M92 56 L 86 76"/><path d="M99 57 L 99 78"/><path d="M106 56 L 114 75"/>' +
          '</g>' +
          /* odwłok + pasy */
          '<g transform="rotate(-9 56 48)">' +
            '<ellipse cx="56" cy="48" rx="32" ry="19" fill="url(#' + g + ')"/>' +
            '<g clip-path="url(#' + c + ')" fill="#17110a">' +
              '<rect x="30" y="26" width="6" height="46"/>' +
              '<rect x="42" y="26" width="7" height="46"/>' +
              '<rect x="55" y="26" width="7" height="46"/>' +
              '<rect x="68" y="26" width="7" height="46"/>' +
            '</g>' +
            '<ellipse cx="56" cy="48" rx="32" ry="19" fill="none" stroke="#7c5203" stroke-width="1" stroke-opacity="0.5"/>' +
            /* żądło */
            '<path d="M24 48 L 12 44 L 24 40 Z" fill="#17110a"/>' +
          '</g>' +
          /* tułów */
          '<ellipse cx="97" cy="43" rx="16" ry="15" fill="#211a10"/>' +
          '<ellipse cx="93" cy="39" rx="7" ry="6" fill="#2e2415" opacity="0.8"/>' +
          /* głowa */
          '<circle cx="119" cy="35" r="11" fill="#1b140c"/>' +
          '<ellipse cx="123" cy="32" rx="3.2" ry="4.4" fill="#3a2d17"/>' +
          '<circle cx="124.2" cy="30.6" r="1.1" fill="#ffd451" opacity="0.85"/>' +
          /* czułki */
          '<g class="wasp__antenna" stroke="#1b140c" stroke-width="2" stroke-linecap="round" fill="none">' +
            '<path d="M124 27 C 131 18, 133 12, 130 8"/>' +
            '<path d="M118 25 C 122 15, 121 11, 117 8"/>' +
          '</g>' +
        '</g>' +
      '</svg>';
  }

  var waspIndex = 0;
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  function populateWasps() {
    document.querySelectorAll(".wasp-layer").forEach(function (layer) {
      var count = parseInt(layer.getAttribute("data-wasps") || "3", 10);
      var mode = layer.getAttribute("data-scale") || "hero";
      // na telefonach tyle samo os, ale większe (inaczej są ledwo widoczne)
      var small = window.innerWidth < 640;

      for (var n = 0; n < count; n++) {
        var el = document.createElement("div");
        el.className = "wasp wasp--p" + ((waspIndex % 4) + 1);

        var min = small ? 0.9 : (mode === "about" ? 0.5 : 0.72);
        var max = small ? 1.25 : (mode === "about" ? 0.9 : 1.15);
        el.style.setProperty("--s", rand(min, max).toFixed(2));
        el.style.setProperty("--dur", rand(13, 25).toFixed(1) + "s");
        el.style.setProperty("--delay", (-rand(0, 22)).toFixed(1) + "s");

        // rozrzucona pozycja bazowa (z marginesem, by nie „wypadały” z kadru)
        el.style.left = rand(6, 74).toFixed(1) + "%";
        el.style.top  = rand(10, 66).toFixed(1) + "%";
        var flip = Math.random() < 0.5 ? " is-flip" : "";
        el.innerHTML = '<div class="wasp__facing' + flip + '">' + waspSVG(waspIndex) + "</div>";
        layer.appendChild(el);
        waspIndex++;
      }
    });
  }
  populateWasps();

  /* ---------- Osy wychodzące spod zdjęć (po jednej na kartę, na zmianę) ---------- */
  document.querySelectorAll(".species").forEach(function (grid) {
    var cards = grid.querySelectorAll(".species__card");
    var peeks = [];
    cards.forEach(function (card, i) {
      var p = document.createElement("div");
      p.className = "wasp-peek";
      p.setAttribute("aria-hidden", "true");
      p.style.setProperty("--delay", (i * 3.7) + "s");
      p.innerHTML = waspSVG("p" + i);
      grid.appendChild(p);
      peeks.push({ el: p, card: card, x: [0.72, 0.18, 0.6][i % 3] });
    });
    var place = function () {
      peeks.forEach(function (o) {
        o.el.style.left = (o.card.offsetLeft + o.card.offsetWidth * o.x - o.el.offsetWidth / 2) + "px";
        o.el.style.top = o.card.offsetTop + "px";
      });
    };
    place();
    window.addEventListener("resize", place, { passive: true });
    window.addEventListener("load", place);
  });

  /* ---------- NAV: stan po scrollu + parallax hero ---------- */
  var nav = document.getElementById("nav");
  var fab = document.querySelector(".fab");
  var heroContent = document.getElementById("heroContent");
  var heroScroll = document.querySelector(".hero__scroll");
  var ticking = false;

  var render = function () {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;

    if (y > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");

    if (fab) fab.classList.toggle("is-visible", y > vh * 0.7);

    if (!reduceMotion && heroContent) {
      var prog = Math.min(y / (vh * 0.85), 1);
      heroContent.style.transform = "translate3d(0," + (y * 0.28) + "px,0)";
      heroContent.style.opacity = Math.max(1 - prog * 1.15, 0);
      if (heroScroll) heroScroll.style.opacity = Math.max(1 - prog * 2.4, 0);
    }
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(render); } };
  render();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---------- NAV: menu mobilne ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  if (toggle && mobile) {
    var closeMenu = function () { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobile.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  document.querySelectorAll(".threats, .reasons, .steps, .usp__grid, .reviews, .species").forEach(function (grid) {
    grid.querySelectorAll("[data-reveal]").forEach(function (el, i) { el.style.setProperty("--d", (i % 4) * 70 + "ms"); });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Liczniki ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var dur = 1500, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Formularz → gotowy SMS (bez serwera, strona nic nie zapisuje) ---------- */
  var SMS_NUMBER = "+48697206649";
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    var smsHref = function (body) {
      // iOS/macOS oczekują "&body=", Android "?body="
      var apple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
      return "sms:" + SMS_NUMBER + (apple ? "&" : "?") + "body=" + encodeURIComponent(body);
    };
    var link = function (href, text) {
      var a = document.createElement("a");
      a.href = href;
      a.textContent = text;
      return a;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name").value.trim();
      var place = form.querySelector("#place");
      var message = form.querySelector("#message");
      var ok = true;
      [place, message].forEach(function (input) {
        var empty = !input.value.trim();
        input.closest(".field").classList.toggle("is-invalid", empty);
        if (empty) ok = false;
      });
      if (!ok) {
        note.textContent = "Wpisz miejscowość i gdzie jest gniazdo.";
        note.className = "form__note is-err";
        return;
      }

      var href = smsHref("Dzień dobry" + (name ? ", tu " + name : "") +
        ". Gniazdo: " + message.value.trim() + ". Miejscowość: " + place.value.trim() + ".");
      var touch = window.matchMedia("(pointer: coarse)").matches;

      note.className = "form__note is-ok";
      note.textContent = touch
        ? "Otwieram SMS z gotową wiadomością — wystarczy wysłać. Nie otworzył się? "
        : "Na komputerze SMS może się nie otworzyć. ";
      note.appendChild(link(href, touch ? "Spróbuj ponownie" : "Otwórz SMS"));
      note.appendChild(document.createTextNode(" albo zadzwoń: "));
      note.appendChild(link("tel:" + SMS_NUMBER, "697 206 649"));

      if (touch) window.location.href = href;
    });
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var wrap = input.closest(".field");
        if (wrap) wrap.classList.remove("is-invalid");
      });
    });
  }
})();
