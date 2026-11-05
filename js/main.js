/* Book Cafe — café + lending library */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$" + n.toFixed(2);

  /* ---------------- Nav ---------------- */
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const menu = $("#mobile-menu");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    menu.hidden = open;
  });
  $$("#mobile-menu a").forEach(a => a.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  }));
  const navLinks = $$(".nav__links a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    navLinks.map(a => $(a.getAttribute("href"))).filter(Boolean).forEach(s => spy.observe(s));
  }

  /* ---------------- 04 Drinks shelf ---------------- */
  const drinks = [
    { id: "opening-line", name: "The Opening Line", kind: "Espresso", no: "641.01", c: "#7a2e25", h: 300, w: 80,
      desc: "Our house espresso. Short, sweet and strong, the way a good first sentence should be.",
      notes: ["Dark Chocolate", "Toasted Hazelnut", "Brown Sugar"],
      read: { title: "Dubliners", author: "James Joyce", why: "Fifteen short stories. Finish one before the cup goes cold." },
      sizes: [["Single", 3.25], ["Double", 3.75]] },
    { id: "slow-chapter", name: "Slow Chapter", kind: "Pour-over", no: "641.02", c: "#2f4a5c", h: 272, w: 72,
      desc: "A single origin brewed to order, one cup at a time. Worth the four-minute wait.",
      notes: ["Stone Fruit", "Wildflower Honey", "Black Tea"],
      read: { title: "Walden", author: "Henry David Thoreau", why: "An unhurried book for an unhurried coffee." },
      sizes: [["Cup", 5.0], ["Carafe for two", 9.0]] },
    { id: "poets-latte", name: "The Poet's Latte", kind: "Latte", no: "641.03", c: "#8d8fb5", t: "#1d1b17", g: "#3e3f63", h: 318, w: 80,
      desc: "Espresso and steamed milk with our own lavender and honey syrup. Our most-ordered drink.",
      notes: ["Lavender", "Honey", "Velvet Milk"],
      read: { title: "Leaves of Grass", author: "Walt Whitman", why: "Open it anywhere. Every page works on its own." },
      sizes: [["12 oz", 5.75], ["16 oz", 6.5]] },
    { id: "mystery-mocha", name: "Mystery Mocha", kind: "Mocha", no: "641.04", c: "#4a2c22", h: 288, w: 76,
      desc: "Dark chocolate, espresso and a twist of orange peel. The orange is the clue.",
      notes: ["Dark Chocolate", "Orange Peel", "Espresso"],
      read: { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", why: "Fog, a moor and a mystery. Best on a cold afternoon." },
      sizes: [["12 oz", 5.75], ["16 oz", 6.5]] },
    { id: "short-story", name: "Short Story", kind: "Cortado", no: "641.05", c: "#c9a35b", t: "#1d1b17", g: "#6b4f1f", h: 258, w: 70,
      desc: "Equal parts espresso and warm milk, served in a small glass. Gone in a few sips.",
      notes: ["Caramel", "Milk Chocolate", "Silky"],
      read: { title: "The Gift of the Magi", author: "O. Henry", why: "A story you can read in the time it takes to drink this." },
      sizes: [["Dairy milk", 4.25], ["Oat milk", 4.75]] },
    { id: "book-club-flight", name: "Book Club Flight", kind: "Tasting flight", no: "641.06", c: "#3d5a45", h: 306, w: 84, lean: true,
      desc: "Four small pours to share: espresso, cortado, pour-over and the latte of the month.",
      notes: ["Four Drinks", "Made to Share", "Talk Fuel"],
      read: { title: "Whatever your club picked", author: "You decide", why: "Book Club card holders get one flight free each month." },
      sizes: [["For 2", 9.0], ["For 4", 16.0]] }
  ];
  const shelf = $(".shelf__books");
  const volume = $("#volume");
  shelf.innerHTML = `<span class="bookend" aria-hidden="true"></span>` + drinks.map((d, i) => `
    <button class="spine${d.lean ? " spine--lean" : ""}" role="tab" id="spine-${d.id}" aria-controls="volume" aria-selected="${i === 0}" data-i="${i}"
      style="--c:${d.c};--h:${d.h}px;--w:${d.w}px;${d.t ? `--t:${d.t};` : ""}${d.g ? `--g:${d.g};` : ""}">
      <span class="spine__top">B</span><span class="spine__title">${d.name}</span><span class="spine__no">${d.no}</span>
    </button>`).join("") + `<span class="bookend" aria-hidden="true" style="transform:scaleX(-1)"></span>`;

  function renderVolume(i, animate) {
    const d = drinks[i];
    const draw = () => {
      volume.style.setProperty("--vc", d.c);
      volume.setAttribute("aria-labelledby", "spine-" + d.id);
      volume.innerHTML = `
        <div class="volume__img"><img src="images/drink-${d.id}.jpg" alt="${d.name}"></div>
        <div class="volume__body">
          <div class="volume__meta mono"><span>${d.no}</span><span>${d.kind}</span><span>House drink</span></div>
          <h3>${d.name}</h3>
          <p class="volume__desc">${d.desc}</p>
          <ul class="notes-list">${d.notes.map(n => `<li>${n}</li>`).join("")}</ul>
          <div class="pairing">
            <span class="mono">Reading pair</span>
            <p><b>${d.read.title}</b> <span>${d.read.author}</span></p>
            <p class="pairing__why">${d.read.why}</p>
          </div>
          <div class="volume__buy">
            <span class="volume__price" data-price>${money(d.sizes[0][1])}</span>
            <div class="sizes" role="group" aria-label="Size">
              ${d.sizes.map((s, k) => `<button type="button" aria-pressed="${k === 0}" data-k="${k}">${s[0]}</button>`).join("")}
            </div>
            <a class="btn btn--ink" href="#rooms">Order at the counter</a>
          </div>
        </div>`;
      $$(".sizes button", volume).forEach(btn => btn.addEventListener("click", () => {
        $$(".sizes button", volume).forEach(x => x.setAttribute("aria-pressed", String(x === btn)));
        $("[data-price]", volume).textContent = money(d.sizes[+btn.dataset.k][1]);
      }));
      volume.classList.remove("is-swapping");
    };
    if (animate) { volume.classList.add("is-swapping"); setTimeout(draw, 200); } else draw();
  }
  const spines = $$(".spine", shelf);
  spines.forEach(sp => sp.addEventListener("click", () => {
    spines.forEach(x => x.setAttribute("aria-selected", String(x === sp)));
    renderVolume(+sp.dataset.i, true);
  }));
  shelf.addEventListener("keydown", e => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const cur = spines.findIndex(s => s.getAttribute("aria-selected") === "true");
    const next = (cur + (e.key === "ArrowRight" ? 1 : -1) + spines.length) % spines.length;
    spines[next].focus(); spines[next].click();
  });
  renderVolume(0, false);

  /* ---------------- 06 Just shelved (library) ---------------- */
  const books = [
    { title: "Piranesi", author: "Susanna Clarke", call: "FIC CLA", section: "Fiction", status: "in", pair: "Slow Chapter" },
    { title: "Klara and the Sun", author: "Kazuo Ishiguro", call: "FIC ISH", section: "Fiction", status: "out", pair: "The Poet's Latte" },
    { title: "Pachinko", author: "Min Jin Lee", call: "FIC LEE", section: "Fiction", status: "in", pair: "Book Club Flight" },
    { title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", call: "581.6 KIM", section: "Nonfiction", status: "in", pair: "Slow Chapter" },
    { title: "Coffee: A Global History", author: "Jonathan Morris", call: "641.3373 MOR", section: "Nonfiction", status: "in", pair: "The Opening Line" },
    { title: "A Walk in the Woods", author: "Bill Bryson", call: "917.4 BRY", section: "Nonfiction", status: "out", pair: "Mystery Mocha" },
    { title: "Devotions", author: "Mary Oliver", call: "811.54 OLI", section: "Poetry", status: "in", pair: "Short Story" },
    { title: "The Poetry Pharmacy", author: "William Sieghart", call: "821.008 SIE", section: "Poetry", status: "in", pair: "The Poet's Latte" }
  ];
  const grid = $("#arrivals-grid");
  const statusLabel = { in: "On the shelf", out: "On loan", held: "Held for you" };
  grid.innerHTML = books.map((b, i) => `
    <article class="icard reveal" data-section="${b.section}">
      <div class="icard__head"><span class="icard__call">${b.call}</span><span>${b.section}</span></div>
      <h3>${b.title}</h3>
      <p class="icard__region">${b.author}</p>
      <p class="icard__notes">Pairs with <b>${b.pair}</b></p>
      <div class="icard__foot">
        <span class="bstatus bstatus--${b.status}" data-status>${statusLabel[b.status]}</span>
        <button type="button" class="icard__btn" data-i="${i}" ${b.status === "out" ? "disabled" : ""}>${b.status === "out" ? "Join waitlist" : "Hold it"}</button>
      </div>
    </article>`).join("");
  $$(".icard__btn", grid).forEach(btn => {
    if (btn.disabled) { btn.disabled = false; btn.addEventListener("click", () => { btn.textContent = "On the waitlist"; btn.disabled = true; }); return; }
    btn.addEventListener("click", () => {
      const card = btn.closest(".icard");
      const st = $("[data-status]", card);
      const held = st.classList.toggle("bstatus--held");
      st.textContent = held ? statusLabel.held : statusLabel.in;
      btn.textContent = held ? "Release" : "Hold it";
    });
  });
  $$(".filters .chip").forEach(chip => chip.addEventListener("click", () => {
    $$(".filters .chip").forEach(c => c.classList.toggle("is-active", c === chip));
    const f = chip.dataset.filter;
    $$(".icard", grid).forEach(card => card.classList.toggle("is-hidden", !(f === "all" || card.dataset.section === f)));
  }));

  /* ---------------- 09 Rooms ---------------- */
  const t = (h, m = 0) => h * 60 + m;
  // index 0 = Sunday … 6 = Saturday
  const cafeWeek = [[t(8), t(18)], [t(7), t(21)], [t(7), t(21)], [t(7), t(21)], [t(7), t(21)], [t(7), t(22)], [t(7), t(22)]];
  const rooms = [
    { name: "The Espresso Bar", floor: "Ground floor", img: "room-espresso-bar.jpg", noise: "Lively", seats: "14 stools", power: "At every stool",
      desc: "Where the counter, the cake case and the returns slot live. Perch at the bar, chat with the baristas, and pick up a book on the way out.",
      best: "A quick coffee and a quick chapter", rows: [["Mon – Thu", "7AM – 9PM"], ["Fri – Sat", "7AM – 10PM"], ["Sunday", "8AM – 6PM"]], week: cafeWeek },
    { name: "The Long Room", floor: "First floor", img: "room-long-room.jpg", noise: "Library quiet", seats: "32 seats", power: "Under every lamp",
      desc: "Floor-to-ceiling shelves, green lamps and long oak tables. The quiet room, for reading, studying and writing. Phones on silent, please.",
      best: "Deep reading and deadlines", rows: [["Mon – Fri", "9AM – 9PM"], ["Weekends", "9AM – 6PM"]],
      week: [[t(9), t(18)], [t(9), t(21)], [t(9), t(21)], [t(9), t(21)], [t(9), t(21)], [t(9), t(21)], [t(9), t(18)]] },
    { name: "The Window Seats", floor: "Ground floor", img: "room-window-seats.jpg", noise: "Soft chatter", seats: "8 tables for two", power: "Along the sill",
      desc: "Small round tables along the big front window, with the best light in the building. First come, first served.",
      best: "Reading with a friend", rows: [["Mon – Thu", "7AM – 9PM"], ["Fri – Sat", "7AM – 10PM"], ["Sunday", "8AM – 6PM"]], week: cafeWeek },
    { name: "The Garden Room", floor: "Back of the house", img: "room-garden.jpg", noise: "Easygoing", seats: "40 seats", power: "Some tables",
      desc: "A glass-roofed room full of plants, with sofas and big tables. Home of Silent Book Club, and the best room for groups.",
      best: "Book clubs and long brunches", rows: [["Mon – Thu", "8AM – 8PM"], ["Fri – Sat", "8AM – 10PM"], ["Sunday", "8AM – 6PM"]],
      week: [[t(8), t(18)], [t(8), t(20)], [t(8), t(20)], [t(8), t(20)], [t(8), t(20)], [t(8), t(22)], [t(8), t(22)]] },
    { name: "The Evening Salon", floor: "Lower floor", img: "room-evening-salon.jpg", noise: "Readings & music", seats: "50 seats", power: "Stage only",
      desc: "Our low-lit room downstairs, with a small stage and a bar. Open in the evenings for readings, open mics and the occasional jazz trio.",
      best: "Events, wine and late nights", rows: [["Thu – Sat", "6PM – 10PM"], ["Sun – Wed", "Private hire"]],
      week: [null, null, null, null, [t(18), t(22)], [t(18), t(22)], [t(18), t(22)]] }
  ];
  const isOpen = r => {
    const now = new Date();
    const h = r.week[now.getDay()];
    const m = now.getHours() * 60 + now.getMinutes();
    return !!h && m >= h[0] && m < h[1];
  };
  const list = $("#room-list");
  const detail = $("#room-detail");
  list.innerHTML = rooms.map((r, i) => `
    <li><button class="branch-btn" role="tab" aria-selected="${i === 0}" aria-controls="room-detail" data-i="${i}">
      <span class="branch-btn__no">${String(i + 1).padStart(2, "0")}</span>
      <span><span class="branch-btn__name">${r.name}</span><span class="branch-btn__city">${r.floor} · ${r.noise}</span></span>
      <span class="status ${isOpen(r) ? "status--open" : "status--closed"}">${isOpen(r) ? "Open now" : "Closed"}</span>
    </button></li>`).join("");
  function renderRoom(i) {
    const r = rooms[i];
    detail.innerHTML = `
      <div class="branch-detail__img"><img src="images/${r.img}" alt="${r.name}"></div>
      <div class="branch-detail__body">
        <h3>${r.name} <small>${r.floor}</small></h3>
        <div>
          <p class="branch-detail__desc">${r.desc}</p>
          <dl class="facts">
            <div><dt>Noise</dt><dd>${r.noise}</dd></div>
            <div><dt>Seats</dt><dd>${r.seats}</dd></div>
            <div><dt>Power</dt><dd>${r.power}</dd></div>
          </dl>
        </div>
        <dl class="hours">${r.rows.map(x => `<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join("")}</dl>
        <div class="branch-detail__actions">
          <p class="branch-detail__addr"><span class="mono">Best for</span><br>${r.best}</p>
          <a class="btn btn--ink btn--sm" href="#reserve" data-room="${i}">Reserve here</a>
        </div>
      </div>`;
    $("[data-room]", detail).addEventListener("click", () => { $("#rf-room").selectedIndex = i; });
  }
  const rBtns = $$(".branch-btn", list);
  rBtns.forEach(btn => btn.addEventListener("click", () => {
    rBtns.forEach(x => x.setAttribute("aria-selected", String(x === btn)));
    renderRoom(+btn.dataset.i);
  }));
  renderRoom(0);
  $("#rf-room").innerHTML = rooms.map(r => `<option>${r.name}</option>`).join("");

  /* ---------------- 11 Reserve form ---------------- */
  const rForm = $("#reserve-form");
  const dateInput = $("#rf-date");
  const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  dateInput.min = today();
  rForm.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    $$("[required]", rForm).forEach(f => {
      const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    const msg = $(".form-msg", rForm);
    if (!ok) { msg.textContent = "Please add your name, a valid email and a date."; return; }
    const d = new FormData(rForm);
    msg.textContent = `Thanks, ${d.get("name").trim().split(" ")[0]}. We've noted your request for ${d.get("room")} and will confirm by email.`;
    rForm.reset(); dateInput.min = today();
  });

  /* ---------------- 14 Library card ---------------- */
  const nameIn = $("#su-name");
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase();
  const now = new Date();
  [21, 21, 21].forEach((n, k) => { $("#due-" + (k + 1)).textContent = fmt(new Date(now.getTime() + (n + k * 7) * 864e5)); });
  const hash = s => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 10000; return String(h).padStart(4, "0"); };
  nameIn.addEventListener("input", () => {
    const v = nameIn.value.trim();
    $("#card-name").textContent = v || "Your name here";
    $("#card-no").textContent = "BC-028-" + (v ? hash(v.toLowerCase()) : "0000");
  });
  $("#signup-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#su-email");
    const msg = $("#signup-msg");
    if (!/^\S+@\S+\.\S+$/.test(email.value)) { msg.textContent = "Please enter a valid email address."; email.focus(); return; }
    $(".libcard").classList.add("is-issued");
    msg.textContent = "Card issued. Show this name at the counter to borrow your first book.";
  });

  /* ---------------- Reveal (content is visible at rest; this only adds a lift) ---------------- */
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { threshold: .12 });
    $$(".reveal").forEach(el => io.observe(el));
  }
})();
