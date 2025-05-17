// Data: elements and combinations
const baseElements = [
  { id: "air", name: "Air" },
  { id: "earth", name: "Earth" },
  { id: "fire", name: "Fire" },
  { id: "water", name: "Water" },
];

const combinations = {
  // key: "id1+id2" sorted alphabetically
  "air+earth": { id: "dust", name: "Dust" },
  "air+fire": { id: "energy", name: "Energy" },
  "air+water": { id: "rain", name: "Rain" },
  "earth+fire": { id: "lava", name: "Lava" },
  "earth+water": { id: "mud", name: "Mud" },
  "fire+water": { id: "steam", name: "Steam" },
  "dust+fire": { id: "ash", name: "Ash" },
  "lava+air": { id: "stone", name: "Stone" },
  "mud+fire": { id: "brick", name: "Brick" },
  "rain+earth": { id: "plant", name: "Plant" },
  "energy+plant": { id: "life", name: "Life" },
  "stone+water": { id: "pebble", name: "Pebble" },
};

// State
let discoveredElements = [...baseElements];
let workspaceElements = [];

// DOM references
const elementsContainer = document.getElementById("elements-container");
const workspaceContainer = document.getElementById("workspace-container");

// Drag state
let dragSrcEl = null;

// Helper: sort ids alphabetically
function getKey(id1, id2) {
  return [id1, id2].sort().join("+");
}

// Render functions
function renderElementsPanel() {
  elementsContainer.innerHTML = "";
  discoveredElements.forEach((el) => {
    const div = document.createElement("div");
    div.classList.add("element");
    div.setAttribute("draggable", "true");
    div.dataset.id = el.id;
    div.textContent = el.name;
    elementsContainer.appendChild(div);
  });
}

function renderWorkspace() {
  workspaceContainer.innerHTML = "";
  workspaceElements.forEach((el) => {
    const div = document.createElement("div");
    div.classList.add("element");
    div.setAttribute("draggable", "true");
    div.dataset.id = el.id;
    div.textContent = el.name;
    workspaceContainer.appendChild(div);
  });
}

// Add element from elements panel to workspace on drag start + drop
function handleDragStart(e) {
  dragSrcEl = e.target;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", e.target.dataset.id);
  e.target.classList.add("dragging");
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const target = e.target.closest(".element");
  if (!target) return;

  const targetId = target.dataset.id;
  if (!targetId || !draggedId) return;

  // Prevent combining the same element with itself
  if (draggedId === targetId) return;

  // Check if combination exists
  const key = getKey(draggedId, targetId);
  if (combinations[key]) {
    const newElement = combinations[key];

    // Check if discovered
    if (!discoveredElements.find((el) => el.id === newElement.id)) {
      discoveredElements.push(newElement);
      alert(`You created: ${newElement.name}!`);
      renderElementsPanel();
    }

    // Add new element to workspace if not there
    if (!workspaceElements.find((el) => el.id === newElement.id)) {
      workspaceElements.push(newElement);
      renderWorkspace();
    }
  }
}

function handleElementsPanelDrop(e) {
  e.preventDefault();
  // Dragging element from workspace back to elements panel (optional)
  const draggedId = e.dataTransfer.getData("text/plain");
  if (!draggedId) return;

  // Allow dragging elements from workspace to elements panel if desired
  // (Currently no action)
}

// Initialize workspace with base elements to drag from elements panel only
function init() {
  renderElementsPanel();
  workspaceElements = [];
  renderWorkspace();

  // Event delegation for drag on elements panel
  elementsContainer.addEventListener("dragstart", handleDragStart);
  elementsContainer.addEventListener("dragend", handleDragEnd);

  // Drag events for workspace container and workspace elements
  workspaceContainer.addEventListener("dragstart", handleDragStart);
  workspaceContainer.addEventListener("dragend", handleDragEnd);

  // Allow dropping elements on workspace elements to combine
  workspaceContainer.addEventListener("dragover", handleDragOver);
  workspaceContainer.addEventListener("drop", handleDrop);

  // Also allow dropping on elements panel (optional)
  elementsContainer.addEventListener("dragover", handleDragOver);
  elementsContainer.addEventListener("drop", handleElementsPanelDrop);
}

init();
