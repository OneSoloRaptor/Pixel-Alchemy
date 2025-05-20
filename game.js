// ===== Pixel Alchemy Game Logic =====

// --- Element Recipes (add more as you like) ---
const COMBINATIONS = {
  "air+earth": { name: "Dust", emoji: "🌫️" },
  "air+fire": { name: "Smoke", emoji: "💨" },
  "air+water": { name: "Rain", emoji: "🌧️" },
  "earth+fire": { name: "Lava", emoji: "🌋" },
  "earth+water": { name: "Mud", emoji: "🪨" },
  "fire+water": { name: "Steam", emoji: "🌫️" },
  "fire+mud": { name: "Brick", emoji: "🧱" },
  "lava+water": { name: "Obsidian", emoji: "🪨" },
  "steam+air": { name: "Cloud", emoji: "☁️" }
};

// --- Base Elements (must match the sidebar HTML) ---
const BASE_ELEMENTS = [
  { name: "Fire", emoji: "🔥" },
  { name: "Water", emoji: "💧" },
  { name: "Earth", emoji: "🌍" },
  { name: "Air", emoji: "🌬️" }
];

// --- State ---
let workspaceElements = []; // {name, emoji, x, y, id}
let discoveredElements = JSON.parse(localStorage.getItem("discovered") || "[]"); // {name, emoji}
let draggingElem = null, offsetX = 0, offsetY = 0;

// --- Helpers ---
function getWorkspaceRect() {
  return document.getElementById("workspace").getBoundingClientRect();
}
function getElemById(id) {
  return workspaceElements.find(e => e.id === id);
}
function makeId() {
  return Math.random().toString(36).substr(2, 8);
}
function comboKey(a, b) {
  return [a.toLowerCase(), b.toLowerCase()].sort().join("+");
}

// --- Rendering ---
function renderDiscovered() {
  const container = document.getElementById("discovered");
  container.innerHTML = "";
  discoveredElements.forEach(({name, emoji}) => {
    const div = document.createElement("div");
    div.className = "element";
    div.draggable = true;
    div.dataset.element = name;
    div.innerHTML = `<span class="emoji">${emoji}</span><span class="label">${name}</span>`;
    div.addEventListener("dragstart", dragStartSidebar);
    container.appendChild(div);
  });
}

function renderWorkspace() {
  const ws = document.getElementById("workspace");
  ws.innerHTML = "";
  workspaceElements.forEach(item => {
    const div = document.createElement("div");
    div.className = "workspace-item";
    div.style.left = (item.x || 30) + "px";
    div.style.top = (item.y || 40) + "px";
    div.innerHTML = `<span class="emoji">${item.emoji}</span><span class="label">${item.name}</span>`;
    div.dataset.id = item.id;
    // Drag within workspace
    div.onmousedown = workspaceMouseDown;
    ws.appendChild(div);
  });
  // Add hint if empty
  if (workspaceElements.length === 0) {
    const p = document.createElement("p");
    p.className = "workspace-hint";
    p.textContent = "Drag elements here to combine";
    ws.appendChild(p);
  }
}

// --- Drag from sidebar or discovered ---
function dragStartSidebar(e) {
  e.dataTransfer.setData("element", e.target.dataset.element);
}

// --- Workspace Drop ---
function allowDrop(e) {
  e.preventDefault();
}
function handleDrop(e) {
  e.preventDefault();
  const elementName = e.dataTransfer.getData("element");
  if (!elementName) return;
  // Element data
  let elemObj = BASE_ELEMENTS.find(el => el.name === elementName) ||
                discoveredElements.find(el => el.name === elementName);
  if (!elemObj) return;
  // Place at drop location (relative to workspace)
  const wsRect = getWorkspaceRect();
  const x = e.clientX - wsRect.left - 40;
  const y = e.clientY - wsRect.top - 40;
  const id = makeId();
  workspaceElements.push({ ...elemObj, x, y, id });
  renderWorkspace();
  setTimeout(checkCombinations, 100); // Wait for DOM update
}

// --- Drag within workspace (movable blocks!) ---
function workspaceMouseDown(e) {
  const div = e.currentTarget;
  draggingElem = div;
  const rect = div.getBoundingClientRect();
  const wsRect = getWorkspaceRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  document.onmousemove = workspaceMouseMove;
  document.onmouseup = workspaceMouseUp;
  div.style.zIndex = 1000;
}
function workspaceMouseMove(e) {
  if (!draggingElem) return;
  const wsRect = getWorkspaceRect();
  let x = e.clientX - wsRect.left - offsetX;
  let y = e.clientY - wsRect.top - offsetY;
  // Clamp to workspace
  x = Math.max(0, Math.min(x, wsRect.width - 80));
  y = Math.max(0, Math.min(y, wsRect.height - 80));
  draggingElem.style.left = x + "px";
  draggingElem.style.top = y + "px";
}
function workspaceMouseUp(e) {
  if (!draggingElem) return;
  // Update state with new position
  const id = draggingElem.dataset.id;
  const wsRect = getWorkspaceRect();
  let x = parseInt(draggingElem.style.left);
  let y = parseInt(draggingElem.style.top);
  let elem = getElemById(id);
  if (elem) { elem.x = x; elem.y = y; }
  draggingElem.style.zIndex = 1;
  draggingElem = null;
  document.onmousemove = null;
  document.onmouseup = null;
  setTimeout(checkCombinations, 100);
}

// --- Combination Logic: check for overlapping blocks ---
function checkCombinations() {
  if (workspaceElements.length < 2) return;
  for (let i = 0; i < workspaceElements.length; i++) {
    const a = workspaceElements[i];
    const aDiv = document.querySelector(`.workspace-item[data-id="${a.id}"]`);
    const aRect = aDiv.getBoundingClientRect();
    for (let j = i + 1; j < workspaceElements.length; j++) {
      const b = workspaceElements[j];
      const bDiv = document.querySelector(`.workspace-item[data-id="${b.id}"]`);
      const bRect = bDiv.getBoundingClientRect();
      if (isOverlap(aRect, bRect)) {
        const combo = COMBINATIONS[comboKey(a.name, b.name)];
        if (combo) {
          // Remove both, add new
          workspaceElements = workspaceElements.filter(e => e.id !== a.id && e.id !== b.id);
          // Place new at merged location
          const newX = (a.x + b.x)/2;
          const newY = (a.y + b.y)/2;
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

// --- Add to discovered panel ---
function addDiscovered({name, emoji}) {
  if (!discoveredElements.find(e => e.name === name)) {
    discoveredElements.push({name, emoji});
    localStorage.setItem("discovered", JSON.stringify(discoveredElements));
    renderDiscovered();
  }
}

// --- Popup ---
function showPopup(msg) {
  const pop = document.getElementById("popup");
  pop.textContent = msg;
  pop.style.display = "block";
  setTimeout(() => { pop.style.display = "none"; }, 1800);
}

// --- Reset ---
function resetGame() {
  workspaceElements = [];
  discoveredElements = [];
  localStorage.removeItem("discovered");
  renderWorkspace();
  renderDiscovered();
  showPopup("Game Reset!");
}

// --- Init ---
function initBaseElements() {
  // Already in HTML, just attach drag events
  document.querySelectorAll("#elements .element").forEach(div => {
    div.addEventListener("dragstart", dragStartSidebar);
  });
}
function initDiscovered() {
  renderDiscovered();
}
function renderAll() {
  renderWorkspace();
  renderDiscovered();
}

// --- Main ---
window.addEventListener("DOMContentLoaded", () => {
  initBaseElements();
  initDiscovered();
  renderWorkspace();
  // Workspace events
  const ws = document.getElementById("workspace");
  ws.addEventListener("dragover", allowDrop);
  ws.addEventListener("drop", handleDrop);
});
