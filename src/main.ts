// ==============================
// GAME STATE
// ==============================
let counter: number = 0;
let growthRate = 0;
let lastTime = performance.now();
const unit = "cycles";

// ==============================
// UI ELEMENTS
// ==============================
const counterDiv = document.createElement("div");
counterDiv.innerHTML = `🔥 ${counter} ${unit}`;
document.body.append(counterDiv);

// Main click button
const button = document.createElement("button");
button.innerHTML = "🔥 Throw Oil";
document.body.append(button);

const rateDiv = document.createElement("div");
document.body.append(rateDiv);

const ownedDiv = document.createElement("div");
document.body.append(ownedDiv);

const shopDiv = document.createElement("div");
document.body.append(shopDiv);

// ==============================
// EVENT HANDLERS
// ==============================
button.addEventListener("click", () => {
  counter++;
  counterDiv.innerHTML = `🔥 ${Math.floor(counter)} ${unit}`;
});

// ==============================
// UPGRADE DATA
// ==============================
interface Item {
  id: string;
  name: string;
  baseCost: number;
  rate: number;
  count: number;
  description: string;
}

const items: Item[] = [
  {
    id: "A",
    name: "Oscillator",
    baseCost: 10,
    rate: 0.1,
    count: 0,
    description: "A stable clock that gently ticks out extra cycles.",
  },
  {
    id: "B",
    name: "CPU Core",
    baseCost: 100,
    rate: 2.0,
    count: 0,
    description: "A general-purpose processor adding steady throughput.",
  },
  {
    id: "C",
    name: "Server Rack",
    baseCost: 1000,
    rate: 50.0,
    count: 0,
    description: "A rack of humming servers working nonstop.",
  },
  {
    id: "D",
    name: "Data Center",
    baseCost: 10000,
    rate: 400.0,
    count: 0,
    description: "A warehouse of machines devoted to generating cycles.",
  },
  {
    id: "E",
    name: "Quantum Lab",
    baseCost: 100000,
    rate: 5000.0,
    count: 0,
    description: "Harnesses fragile qubits for mind-bending performance.",
  },
];

// ==============================
// HELPERS
// ==============================
function price(base: number, owned: number): number {
  return base * Math.pow(1.15, owned);
}

function fmt(n: number): string {
  return n >= 1000 ? Math.round(n).toString() : n.toFixed(2);
}

// ==============================
// SHOP BUILDING
// ==============================
const upgradeButtons = new Map<string, HTMLButtonElement>();

function rebuildShop() {
  shopDiv.innerHTML = "";
  items.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.style.margin = "10px 0";

    const btn = document.createElement("button");
    btn.dataset.id = item.id;
    upgradeButtons.set(item.id, btn);

    const desc = document.createElement("div");
    desc.textContent = item.description;
    desc.style.fontSize = "0.9rem";
    desc.style.marginLeft = "4px";

    wrapper.append(btn, desc);
    shopDiv.append(wrapper);

    btn.addEventListener("click", () => {
      const cost = price(item.baseCost, item.count);
      if (counter >= cost) {
        counter -= cost;
        item.count++;
        growthRate += item.rate;
        refreshUI();
      }
    });
  });
}
// ==============================
// SHOP UI REFRESH
// ==============================
function refreshShopButtons() {
  items.forEach((item) => {
    const btn = upgradeButtons.get(item.id)!;
    const cost = price(item.baseCost, item.count);
    btn.textContent = `Buy ${item.name} (+${item.rate} ${unit}/sec) — cost ${
      fmt(
        cost,
      )
    } (owned ${item.count})`;
    btn.disabled = counter < cost;
  });
}

function refreshUI() {
  rateDiv.innerHTML = `Growth rate: ${growthRate.toFixed(1)} ${unit}/sec`;

  const ownedLabel = items.map((it) => `${it.name}=${it.count}`).join(", ");
  ownedDiv.innerHTML = `Owned: ${ownedLabel}`;

  refreshShopButtons();
}

// ==============================
// GAME LOOP
// ==============================
function update(time: number) {
  const delta = time - lastTime;
  lastTime = time;

  counter += (growthRate * delta) / 1000;
  counterDiv.innerHTML = `⏱️ ${Math.floor(counter)} ${unit}`;

  refreshUI();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

// ==============================
// INIT
// ==============================
rebuildShop();
refreshUI();
