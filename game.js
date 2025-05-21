// ===== Pixel Alchemy: APCSA Edition =====

// --- Element Recipes (APCSA concepts) ---
const COMBINATIONS = {
  "conditional": { name: "Conditional", emoji: "🔀" },
  "method": { name: "Method", emoji: "🔧" },
  "variable": { name: "Variable", emoji: "📦" },
  "object": { name: "Object", emoji: "🧱" },
  "loop": { name: "Loop", emoji: "🔁" },
  "class": { name: "Class", emoji: "🏛️" },

  "class+method": { name: "Constructor", emoji: "🏗️" },
  "variable+loop": { name: "Counter", emoji: "🔢" },
  "method+variable": { name: "Parameter", emoji: "🔣" },
  "method+method": { name: "Override", emoji: "🔄" },
  "object+method": { name: "Call", emoji: "📞" },
  "class+class": { name: "Subclass", emoji: "🧬" },
  "loop+conditional": { name: "While Loop", emoji: "🔂" },
  "class+variable": { name: "Instance Variable", emoji: "📍" },
  "conditional+variable": { name: "Boolean", emoji: "🔘" },
  "object+variable": { name: "Accessing", emoji: "📬" },
  "object+class": { name: "Inheritance", emoji: "🧬" },

  "while loop+counter": { name: "For Loop", emoji: "⏩" },
  "class+subclass": { name: "Polymorphism", emoji: "🌀" },
  "constructor+object": { name: "Instance", emoji: "🪄" },
  "call+variable": { name: "Return", emoji: "↩️" },
  "method+parameter": { name: "Signature", emoji: "✍️" },
  "signature+constructor": { name: "Overloading", emoji: "➕" },
  "call+boolean": { name: "If Statement", emoji: "❓" }
};

const BASE_ELEMENTS = [
  { name: "Conditional", emoji: "🔀" },
  { name: "Method", emoji: "🔧" },
  { name: "Variable", emoji: "📦" },
  { name: "Object", emoji: "🧱" },
  { name: "Loop", emoji: "🔁" },
  { name: "Class", emoji: "🏛️" }
];

// --- State ---
let workspaceElements = []; // {name, emoji, x, y, id}
let discoveredElements = JSON.parse(localStorage.getItem("discovered") || "[]"); // {name, emoji}
let draggingElem = null, dragOffset = {x:0, y:0}, dragStartPos = {x:0, y:0};

// --- Helpers ---
function makeId() {
  return Math.random().toString(36).substr(2, 8);
}
function comboKey(a, b) {
  return [a.toLowerCase(), b.toLowerCase()].sort().join("+");
}
function getElemById(id) {
  return workspaceElements.find(e => e.id === id);
}
function getWorkspaceRect() {
  return document.getElementById("workspace").getBoundingClientRect();
}

// --- Rendering ---
function renderSidebarElements() {
  const elList = document.getElementById("elements");
  elList.innerHTML = "";
  BASE_ELEMENTS.forEach(({name, emoji}) => {
    const div = document.createElement("div");
    div.className = "element";
    div.draggable = false;
    div.dataset.element = name;
    div.innerHTML = `<span class="emoji">${emoji}</span><span class="label">${name}</span>`;
    div.addEventListener("mousedown", sidebarMouseDown);
    elList.appendChild(div);
  });
}
function renderDiscovered() {
  const discoveredList = document.getElementById("discovered");
  discoveredList.innerHTML = "";
  discoveredElements.forEach(({name, emoji}) => {
    const div = document.createElement("div");
    div.className = "element";
    div.draggable = false;
    div.dataset.element = name;
    div.innerHTML = `<span class="emoji">${emoji}</span><span class="label">${name}</span>`;
    div.addEventListener("mousedown", sidebarMouseDown);
    discoveredList.appendChild(div);
  });
}
function renderWorkspace() {
  const ws = document.getElementById("workspace");
  // Remove all blocks except workspace hint
  ws.querySelectorAll(".workspace-block").forEach(e=>e.remove());
  workspaceElements.forEach(item => {
    const div = document.createElement("div");
    div.className = "workspace-block";
    div.style.left = (item.x || 30) + "px";
    div.style.top = (item.y || 40) + "px";
    div.innerHTML = `<span class="emoji">${item.emoji}</span><span class="label">${item.name}</span>`;
    div.dataset.id = item.id;
    div.addEventListener("mousedown", workspaceBlockMouseDown);
    ws.appendChild(div);
  });
  // Show/hide hint
  const hint = document.getElementById("workspaceHint");
  hint.style.display = workspaceElements.length === 0 ? "block" : "none";
}

// --- Sidebar drag (clone to workspace) ---
function sidebarMouseDown(e) {
  const elementName = e.currentTarget.dataset.element;
  // Find element object
  let elemObj = BASE_ELEMENTS.find(el => el.name === elementName) ||
                discoveredElements.find(el => el.name === elementName);
  if (!elemObj) return;

  // Get workspace position for drop
  const ws = document.getElementById("workspace");
  const wsRect = ws.getBoundingClientRect();

  // Start where mouse is relative to workspace
  const mouseMoveHandler = (me) => {
    let x = me.clientX - wsRect.left - 40;
    let y = me.clientY - wsRect.top - 40;
    dragGhost.style.left = x + "px";
    dragGhost.style.top = y + "px";
  };
  // Create a ghost block
  const dragGhost = document.createElement("div");
  dragGhost.className = "workspace-block dragging";
  dragGhost.style.position = "absolute";
  dragGhost.innerHTML = `<span class="emoji">${elemObj.emoji}</span><span class="label">${elemObj.name}</span>`;
  dragGhost.style.pointerEvents = "none";
  ws.appendChild(dragGhost);

  // Track mouse for drag
  function mousemove(e2) { mouseMoveHandler(e2); }
  function mouseup(e2) {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    dragGhost.remove();
    let x = e2.clientX - wsRect.left - 40;
    let y = e2.clientY - wsRect.top - 40;
    // Only place if inside workspace
    if (x >= 0 && y >= 0 && x <= wsRect.width-80 && y <= wsRect.height-80) {
      workspaceElements.push({ ...elemObj, x, y, id: makeId() });
      renderWorkspace();
      setTimeout(checkCombinations, 100);
    }
  }
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
}
// --- Workspace block drag (move or merge) ---
function workspaceBlockMouseDown(e) {
  const blockDiv = e.currentTarget;
  const ws = document.getElementById("workspace");
  const wsRect = ws.getBoundingClientRect();
  const id = blockDiv.dataset.id;
  const block = getElemById(id);

  draggingElem = blockDiv;
  draggingElem.classList.add("dragging");
  dragStartPos = { x: block.x, y: block.y };
  dragOffset = {
    x: e.clientX - wsRect.left - block.x,
    y: e.clientY - wsRect.top - block.y
  };

  function mousemove(ev) {
    let x = ev.clientX - wsRect.left - dragOffset.x;
    let y = ev.clientY - wsRect.top - dragOffset.y;
    // Clamp
    x = Math.max(0, Math.min(x, wsRect.width - 80));
    y = Math.max(0, Math.min(y, wsRect.height - 80));
    draggingElem.style.left = x + "px";
    draggingElem.style.top = y + "px";
  }
  function mouseup(ev) {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    draggingElem.classList.remove("dragging");
    // Update block position
    let x = ev.clientX - wsRect.left - dragOffset.x;
    let y = ev.clientY - wsRect.top - dragOffset.y;
    x = Math.max(0, Math.min(x, wsRect.width - 80));
    y = Math.max(0, Math.min(y, wsRect.height - 80));
    block.x = x; block.y = y;
    draggingElem.style.left = x + "px";
    draggingElem.style.top = y + "px";
    draggingElem = null;
    setTimeout(checkCombinations, 120);
  }
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
}

// --- Combination Logic: check for overlapping blocks ---
function checkCombinations() {
  if (workspaceElements.length < 2) return;
  for (let i = 0; i < workspaceElements.length; i++) {
    const a = workspaceElements[i];
    const aDiv = document.querySelector(`.workspace-block[data-id="${a.id}"]`);
    if (!aDiv) continue;
    const aRect = aDiv.getBoundingClientRect();
    for (let j = i + 1; j < workspaceElements.length; j++) {
      const b = workspaceElements[j];
      const bDiv = document.querySelector(`.workspace-block[data-id="${b.id}"]`);
      if (!bDiv) continue;
      const bRect = bDiv.getBoundingClientRect();
      if (isOverlap(aRect, bRect)) {
        const combo = COMBINATIONS[comboKey(a.name, b.name)];
        if (combo) {
          // Remove both, add new
          workspaceElements = workspaceElements.filter(e => e.id !== a.id && e.id !== b.id);
          // Place new at merged location
          const newX = (a.x + b.x) / 2;
          const newY = (a.y + b.y) / 2;
          const newItem = { ...combo, x: newX, y: newY, id: makeId() };
          workspaceElements.push(newItem);
          addDiscovered(combo);
          renderWorkspace();
          showPopup(`Created: ${combo.emoji} ${combo.name}!`);
          setTimeout(checkCombinations, 300); // Chain combos
          return;
        }
      }
    }
  }
}
// Check if two rects overlap
function isOverlap(r1, r2) {
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

function addDiscovered({name, emoji}) {
  if (!discoveredElements.find(e => e.name === name)) {
    discoveredElements.push({name, emoji});
    localStorage.setItem("discovered", JSON.stringify(discoveredElements));
    renderDiscovered();
  }
}

function showPopup(msg) {
  const pop = document.getElementById("popup");
  pop.textContent = msg;
  pop.classList.add("show");
  setTimeout(() => { pop.classList.remove("show"); }, 1700);
}

function resetGame() {
  workspaceElements = [];
  discoveredElements = [];
  localStorage.removeItem("discovered");
  renderWorkspace();
  renderDiscovered();
  showPopup("Game Reset!");
}

// --- Main ---
window.addEventListener("DOMContentLoaded", () => {
  renderSidebarElements();
  renderDiscovered();
  renderWorkspace();
  document.getElementById("resetBtn").onclick = resetGame;
});
