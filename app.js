const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const compatibility = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
};

const donors = [
  { id: "asha", name: "Asha K.", group: "O-", distance: 1.4, eligible: "Ready today", history: "6 verified donations", score: 98 },
  { id: "rahul", name: "Rahul S.", group: "O-", distance: 2.1, eligible: "Ready today", history: "4 verified donations", score: 94 },
  { id: "meera", name: "Meera P.", group: "A-", distance: 2.8, eligible: "Ready today", history: "5 verified donations", score: 88 },
  { id: "imran", name: "Imran H.", group: "O+", distance: 3.2, eligible: "Ready today", history: "3 verified donations", score: 86 },
  { id: "kavya", name: "Kavya R.", group: "B-", distance: 4.6, eligible: "Ready today", history: "7 verified donations", score: 82 }
];

const markerDetails = {
  hospital: {
    title: "City Care Hospital",
    meta: "Emergency request point · Trauma ward · Verified hospital"
  },
  asha: {
    title: "Asha K. · O- donor",
    meta: "1.4 km away · Eligible today · AI score 98"
  },
  rahul: {
    title: "Rahul S. · O- donor",
    meta: "2.1 km away · Eligible today · AI score 94"
  },
  meera: {
    title: "Meera P. · A- donor",
    meta: "2.8 km away · Eligible today · AI score 88"
  },
  imran: {
    title: "Imran H. · O+ donor",
    meta: "3.2 km away · Eligible today · AI score 86"
  },
  kavya: {
    title: "Kavya R. · B- donor",
    meta: "4.6 km away · Eligible today · AI score 82"
  }
};

const inventory = {
  "A+": 18,
  "A-": 7,
  "B+": 14,
  "B-": 5,
  "AB+": 9,
  "AB-": 3,
  "O+": 21,
  "O-": 4
};

const state = {
  signedIn: false,
  loginRole: "patient",
  activePanel: "patient",
  bloodGroup: "O-",
  units: 2,
  urgency: "CRITICAL",
  activeMarker: "hospital",
  donorAvailable: true
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function createIcon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#${name}`);
  svg.appendChild(use);
  return svg;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setLoginRole(role) {
  state.loginRole = role;
  $$(".role-option").forEach((button) => {
    const active = button.dataset.loginRole === role;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function signIn(method) {
  state.signedIn = true;
  $("#loginView").classList.add("hidden");
  $("#appView").classList.remove("hidden");
  $("#appView").removeAttribute("aria-hidden");
  const panel = state.loginRole === "patient" ? "patient" : state.loginRole;
  showPanel(panel);
  showToast(`${method} login successful`);
}

function signOut() {
  state.signedIn = false;
  $("#appView").classList.add("hidden");
  $("#appView").setAttribute("aria-hidden", "true");
  $("#loginView").classList.remove("hidden");
  showToast("Logged out");
}

function showPanel(panelName) {
  state.activePanel = panelName;
  $$(".nav-button").forEach((button) => {
    const active = button.dataset.panel === panelName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  $$(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === panelName);
  });
}

function renderBloodButtons() {
  const grid = $("#bloodGrid");
  grid.replaceChildren();
  bloodGroups.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "blood-button";
    button.textContent = group;
    button.setAttribute("aria-label", `Select ${group} blood group`);
    button.setAttribute("aria-pressed", String(state.bloodGroup === group));
    button.classList.toggle("active", state.bloodGroup === group);
    button.addEventListener("click", () => {
      state.bloodGroup = group;
      renderBloodButtons();
      renderDonors();
      showToast(`${group} selected`);
    });
    grid.appendChild(button);
  });
}

function setUnits(change) {
  state.units = Math.max(1, Math.min(12, state.units + change));
  $("#unitsOutput").textContent = state.units;
  showToast(`${state.units} unit${state.units > 1 ? "s" : ""} selected`);
}

function setUrgency(value) {
  state.urgency = value;
  $$("#urgencyGroup button").forEach((button) => {
    const active = button.dataset.urgency === value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function compatibleDonors() {
  const allowed = compatibility[state.bloodGroup] || [state.bloodGroup];
  return donors
    .filter((donor) => allowed.includes(donor.group))
    .sort((a, b) => b.score - a.score || a.distance - b.distance);
}

function renderDonors() {
  const list = $("#donorList");
  list.replaceChildren();
  compatibleDonors().forEach((donor) => {
    const row = document.createElement("article");
    row.className = "donor-row";

    const badge = document.createElement("span");
    badge.className = "blood-badge";
    badge.textContent = donor.group;

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = donor.name;
    const meta = document.createElement("small");
    meta.textContent = `${donor.distance} km · ${donor.eligible} · ${donor.history} · score ${donor.score}`;
    copy.append(title, meta);

    const call = document.createElement("button");
    call.type = "button";
    call.className = "call-button";
    call.setAttribute("aria-label", `Call ${donor.name}`);
    call.appendChild(createIcon("phone"));
    call.addEventListener("click", () => showToast(`Call ready for ${donor.name}`));

    row.append(badge, copy, call);
    list.appendChild(row);
  });
}

function setMarker(markerId) {
  state.activeMarker = markerId;
  $$(".map-pin").forEach((pin) => {
    pin.classList.toggle("active", pin.dataset.marker === markerId);
  });
  const detail = markerDetails[markerId];
  $("#mapDetail").innerHTML = `<strong>${detail.title}</strong><span>${detail.meta}</span>`;
}

function centerMap() {
  setMarker("hospital");
  showToast("Map centered on City Care Hospital");
}

function broadcastAlert() {
  $("#requestStatus").textContent = "MATCHED";
  $("#requestStatus").classList.add("safe");
  showToast(`Alert sent to ${compatibleDonors().length} matched donors`);
}

function renderInventory() {
  const grid = $("#inventoryGrid");
  grid.replaceChildren();
  Object.entries(inventory).forEach(([group, count]) => {
    const card = document.createElement("article");
    card.className = "stock-card";
    card.classList.toggle("low", count < 6);

    const label = document.createElement("strong");
    label.textContent = group;
    const output = document.createElement("output");
    output.textContent = count;
    output.setAttribute("aria-label", `${group} stock ${count}`);

    const actions = document.createElement("div");
    actions.className = "stock-actions";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "-";
    minus.setAttribute("aria-label", `Remove one ${group} unit`);
    minus.addEventListener("click", () => updateStock(group, -1));

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Add one ${group} unit`);
    plus.addEventListener("click", () => updateStock(group, 1));

    actions.append(minus, plus);
    card.append(label, output, actions);
    grid.appendChild(card);
  });
}

function updateStock(group, change) {
  inventory[group] = Math.max(0, inventory[group] + change);
  renderInventory();
  showToast(`${group} stock is now ${inventory[group]}`);
}

function toggleAvailability() {
  state.donorAvailable = !state.donorAvailable;
  const button = $("#availabilityButton");
  button.classList.toggle("active", state.donorAvailable);
  button.setAttribute("aria-pressed", String(state.donorAvailable));
  button.textContent = state.donorAvailable ? "Available today" : "Resting today";
  showToast(button.textContent);
}

function bindEvents() {
  $$(".role-option").forEach((button) => {
    button.addEventListener("click", () => setLoginRole(button.dataset.loginRole));
  });

  $("#googleLogin").addEventListener("click", () => signIn("Google"));

  $("#emailLoginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    signIn("Email");
  });

  $("#logoutButton").addEventListener("click", signOut);

  $$(".nav-button").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.panel));
  });

  $("#decreaseUnits").addEventListener("click", () => setUnits(-1));
  $("#increaseUnits").addEventListener("click", () => setUnits(1));

  $$("#urgencyGroup button").forEach((button) => {
    button.addEventListener("click", () => setUrgency(button.dataset.urgency));
  });

  $$(".map-pin").forEach((pin) => {
    pin.addEventListener("click", () => setMarker(pin.dataset.marker));
  });

  $("#centerMapButton").addEventListener("click", centerMap);
  $("#broadcastButton").addEventListener("click", broadcastAlert);
  $("#availabilityButton").addEventListener("click", toggleAvailability);
}

function init() {
  renderBloodButtons();
  renderDonors();
  renderInventory();
  setMarker("hospital");
  bindEvents();
}

init();
