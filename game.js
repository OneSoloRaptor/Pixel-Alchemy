const elements = [
  { name: "Class", recipe: [] },
  { name: "Object", recipe: [] },
  { name: "Method", recipe: [] },
  { name: "Variable", recipe: [] },
  { name: "Loop", recipe: [] },
  { name: "Conditional", recipe: [] },

  { name: "Constructor", recipe: ["Class", "Method"] },
  { name: "Counter", recipe: ["Variable", "Loop"] },
  { name: "Parameter", recipe: ["Method", "Variable"] },
  { name: "Override", recipe: ["Method", "Conditional"] },
  { name: "Call", recipe: ["Object", "Method"] },
  { name: "Subclass", recipe: ["Class", "Object"] },
  { name: "While Loop", recipe: ["Loop", "Conditional"] },
  { name: "Instance Variable", recipe: ["Class", "Variable"] },
  { name: "Boolean", recipe: ["Conditional", "Variable"] },
  { name: "Inheritance", recipe: ["Object", "Class"] },

  { name: "For Loop", recipe: ["While Loop", "Counter"] },
  { name: "Polymorphism", recipe: ["Subclass", "Inheritance"] },
  { name: "Return", recipe: ["Call", "Variable"] },
  { name: "Signature", recipe: ["Method", "Parameter"] },
  { name: "Overloading", recipe: ["Signature", "Constructor"] },
  { name: "If Statement", recipe: ["Boolean", "Call"] },

  { name: "Scope", recipe: ["Method", "Loop"] },
  { name: "This Keyword", recipe: ["Instance Variable", "Call"] },
  { name: "Default Constructor", recipe: ["Constructor", "Subclass"] },
  { name: "Abstract Class", recipe: ["Polymorphism", "Class"] },
  { name: "Nested Loop", recipe: ["Loop", "For Loop"] },
  { name: "Static Variable", recipe: ["Class", "Boolean"] },
  { name: "Getter/Setter", recipe: ["Method", "Inheritance"] },
];

const combinations = {};
elements.forEach(({ name, recipe }) => {
  if (recipe.length === 2) {
    const key = [recipe[0], recipe[1]].sort().join("+");
    combinations[key] = name;
  }
});

const discovered = new Set();
const sandbox = document.getElementById("sandbox");
const discovery = document.getElementById("discovery");
const trash = document.getElementById("trash");

function createElementCard(name, x = 100, y = 100) {
  const card = document.createElement("div");
  card.className = "element";
  card.textContent = name;
  card.style.left = `${x}px`;
  card.style.top = `${y}px`;
  card.setAttribute("draggable", true);
  card.dataset.name = name;

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", name);
    e.dataTransfer.setData("source-id", e.target.id || "");
  });

  card.addEventListener("dragover", (e) => e.preventDefault());

  card.addEventListener("drop", (e) => {
    e.preventDefault();
    const from = e.dataTransfer.getData("text/plain");
    const to = card.dataset.name;
    const comboKey = [from, to].sort().join("+");

    if (combinations[comboKey]) {
      const newName = combinations[comboKey];
      spawnElement(newName, e.clientX, e.clientY);
      card.remove();
      const fromId = e.dataTransfer.getData("source-id");
      if (fromId) document.getElementById(fromId)?.remove();
    }
  });

  card.id = "card-" + Math.random().toString(36).substr(2, 9);
  return card;
}

function spawnElement(name, x = 100, y = 100) {
  if (!discovered.has(name)) {
    discovered.add(name);
    updateDiscovery();
  }
  const card = createElementCard(name, x, y);
  sandbox.appendChild(card);
}

function updateDiscovery() {
  discovery.innerHTML = "";
  Array.from(discovered)
    .sort()
    .forEach((name) => {
      const item = document.createElement("div");
      item.className = "discovered-item";
      item.textContent = name;
      discovery.appendChild(item);
    });
}

trash.addEventListener("dragover", (e) => e.preventDefault());
trash.addEventListener("drop", (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData("source-id");
  const elem = document.getElementById(id);
  if (elem) elem.remove();
});

document.querySelectorAll(".spawner").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    spawnElement(name);
  });
});

document.getElementById("sandbox-tab").addEventListener("click", () => {
  document.getElementById("sandbox-tab").classList.add("active");
  document.getElementById("discovery-tab").classList.remove("active");
  sandbox.style.display = "block";
  discovery.style.display = "none";
});

document.getElementById("discovery-tab").addEventListener("click", () => {
  document.getElementById("discovery-tab").classList.add("active");
  document.getElementById("sandbox-tab").classList.remove("active");
  sandbox.style.display = "none";
  discovery.style.display = "block";
});

// Initial spawn
["Class", "Object", "Method", "Variable", "Loop", "Conditional"].forEach((name) =>
  spawnElement(name)
);
