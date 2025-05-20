/* ===============================
   Little Alchemy Clone Script
=============================== */

// Global arrays to record dropped elements and discovered elements.
let workspaceElements = [];  // Elements dropped into the workspace.
let discoveredElements =
  JSON.parse(localStorage.getItem("discovered")) || [];

// Combination recipes: keys are sorted and joined by '+' in lowercase.
const combinations = {
  "air+earth": "Dust",
  "air+fire": "Smoke",
  "air+water": "Rain",
  "earth+fire": "Lava",
  "earth+water": "Mud",
  "fire+water": "Steam",
  "fire+mud": "Brick",
  "lava+water": "Obsidian",
  "steam+air": "Cloud"
};

/* ---- Initialization ---- */

// Attach drag event listeners for base elements and discovered elements.
function initDraggables() {
  const baseElements = document.querySelectorAll("#elements .element");
  baseElements.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
  });
}

// Initialize discovered elements from localStorage.
function initDiscovered() {
  const discoveredDiv = document.getElementById("discovered");
  discoveredDiv.innerHTML = "";
  discoveredElements.forEach((el) => {
    let div = document.createElement("div");
    div.className = "element";
    div.textContent = el;
    div.dataset.element = el;
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", dragStart);
    discoveredDiv.appendChild(div);
  });
}

/* On DOM ready, initialize everything */
document.addEventListener("DOMContentLoaded", () => {
  initDraggables();
  initDiscovered();
  renderWorkspace();
});

/* ---- Drag and Drop Handlers ---- */

// Allows dropping by preventing the default behavior.
function allowDrop(ev) {
  ev.preventDefault();
}

// Fix: Use "text/plain" as the data type for reliability.
function dragStart(ev) {
  // Set the dragged data to the element name (from data-element attribute)
  ev.dataTransfer.setData("text/plain", ev.target.dataset.element);
}

// Handle drop event in the workspace.
function handleDrop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text/plain");
  if (data) {
    // Push the dropped element into workspaceElements and update view.
    workspaceElements.push(data);
    renderWorkspace();
    // Try auto-combining if a valid combination exists.
    tryAutoCombine();
  }
}

/* ---- Workspace Rendering & Auto-Combination ---- */

// Render the workspace by listing all dropped elements.
function renderWorkspace() {
  const workspaceDiv = document.getElementById("workspace");
  workspaceDiv.innerHTML =
    "<h2>Workspace</h2><p>Drop elements here to combine</p>";
  workspaceElements.forEach((item) => {
    let div = document.createElement("div");
    div.className = "workspace-item";
    div.textContent = item;
    workspaceDiv.appendChild(div);
  });
}

// Iterate over pairs of workspace elements to auto-combine recipes.
function tryAutoCombine() {
  if (workspaceElements.length < 2) return; // Need at least 2 elements.
  for (let i = 0; i < workspaceElements.length; i++) {
    for (let j = i + 1; j < workspaceElements.length; j++) {
      let pair = [workspaceElements[i], workspaceElements[j]];
      let combo = checkCombination(pair);
      if (combo) {
        // Remove the two ingredients (remove the one with higher index first)
        workspaceElements.splice(j, 1);
        workspaceElements.splice(i, 1);
        // Add the new element to discovered list.
        addNewElement(combo);
        showPopup("Created: " + combo);
        // Also, for chaining, add the new combo into the workspace.
        workspaceElements.push(combo);
        renderWorkspace();
        // Recursively check for further combinations.
        tryAutoCombine();
        return;
      }
    }
  }
}

// Check if the sorted elements in a given array (joined by '+') match a recipe.
function checkCombination(arr) {
  let key = arr.slice().sort().join("+").toLowerCase();
  return combinations[key] || null;
}

/* ---- Discovered Elements Handling ---- */

// If a new element is created, add it to the discovered list and sidebar.
function addNewElement(element) {
  if (!discoveredElements.includes(element)) {
    discoveredElements.push(element);
    localStorage.setItem("discovered", JSON.stringify(discoveredElements));
    // Add it to the Discovered Elements panel with drag support.
    const discoveredDiv = document.getElementById("discovered");
    let div = document.createElement("div");
    div.className = "element";
    div.textContent = element;
    div.dataset.element = element;
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", dragStart);
    discoveredDiv.appendChild(div);
  }
}

/* ---- Utility Functions ---- */

// Show a temporary popup with a message.
function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

// Reset the game by clearing workspace and discovered elements.
function resetGame() {
  workspaceElements = [];
  discoveredElements = [];
  localStorage.removeItem("discovered");
  renderWorkspace();
  document.getElementById("discovered").innerHTML = "";
  showPopup("Game Reset");
}
