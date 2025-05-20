/* --------------------------
   Little Alchemy Clone JS
-------------------------- */

// Global arrays for items currently in the workspace and discovered elements.
let workspaceElements = []; // Holds strings (the element names) dropped in workspace.
let discoveredElements =
  JSON.parse(localStorage.getItem("discovered")) || [];

// Combination recipes: the key is the sorted pair (joined by "+") in lowercase.
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

/* --- Initialization Functions --- */
/* Initialize discovered elements from previous sessions */
function initDiscovered() {
  const discoveredDiv = document.getElementById("discovered");
  discoveredDiv.innerHTML = "";
  discoveredElements.forEach((el) => {
    let newNode = document.createElement("div");
    newNode.className = "element";
    newNode.dataset.element = el;
    newNode.textContent = el;
    newNode.draggable = true;
    newNode.addEventListener("dragstart", dragStart);
    discoveredDiv.appendChild(newNode);
  });
}

/* Save discovered elements to localStorage */
function saveDiscovered() {
  localStorage.setItem("discovered", JSON.stringify(discoveredElements));
}

/* Initialize drag events for base elements in the sidebar */
function initDraggables() {
  let elems = document.querySelectorAll("#elements .element");
  elems.forEach((el) => {
    el.addEventListener("dragstart", dragStart);
  });
}

/* When the page loads, initialize everything */
document.addEventListener("DOMContentLoaded", () => {
  initDraggables();
  initDiscovered();
  renderWorkspace();
});

/* --- Drag and Drop Handlers --- */

/* Allow drop by preventing default */
function allowDrop(ev) {
  ev.preventDefault();
}

/* Set data when drag starts */
function dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.dataset.element);
}

/* When an element is dropped in the workspace */
function handleDrop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  if (data) {
    // Add the dropped element’s name into workspaceElements.
    workspaceElements.push(data);
    renderWorkspace();
    // Attempt to auto-combine any valid pairs.
    tryAutoCombine();
  }
}

/* --- Workspace Rendering and Auto-Combination --- */

/* Render the workspace by clearing and then re‑creating DOM items */
function renderWorkspace() {
  let ws = document.getElementById("workspace");
  ws.innerHTML = "<h2>Workspace</h2><p>Drop elements here to combine</p>";
  workspaceElements.forEach((item) => {
    let div = document.createElement("div");
    div.className = "workspace-item";
    div.textContent = item;
    ws.appendChild(div);
  });
}

/* Check all pairs in workspaceElements for a valid combination */
function tryAutoCombine() {
  if (workspaceElements.length < 2) return; // Need at least 2 to combine.
  // Loop over each pair (i, j):
  for (let i = 0; i < workspaceElements.length; i++) {
    for (let j = i + 1; j < workspaceElements.length; j++) {
      let pair = [workspaceElements[i], workspaceElements[j]];
      let combo = checkCombination(pair);
      if (combo) {
        // Remove the two elements (remove the element with highest index first).
        workspaceElements.splice(j, 1);
        workspaceElements.splice(i, 1);
        // Add the new combined element.
        addNewElement(combo);
        showPopup("Created: " + combo);
        // Optionally, add the combo back into the workspace for additional chaining.
        workspaceElements.push(combo);
        renderWorkspace();
        // Recursively check for further combination possibilities.
        tryAutoCombine();
        return;
      }
    }
  }
}

/* Check if the sorted pair (joined with '+') exists in our recipes */
function checkCombination(arr) {
  let key = arr.slice().sort().join("+").toLowerCase();
  return combinations[key] || null;
}

/* --- Discovered Elements Handling --- */

/* Add a new element to the discovered list if not already present */
function addNewElement(element) {
  if (!discoveredElements.includes(element)) {
    discoveredElements.push(element);
    saveDiscovered();
    // Append to discovered panel and make it draggable.
    let discoveredDiv = document.getElementById("discovered");
    let newDiv = document.createElement("div");
    newDiv.className = "element";
    newDiv.textContent = element;
    newDiv.dataset.element = element;
    newDiv.draggable = true;
    newDiv.addEventListener("dragstart", dragStart);
    discoveredDiv.appendChild(newDiv);
  }
}

/* --- Utility Functions --- */

/* Show a temporary popup notification */
function showPopup(message) {
  let popup = document.getElementById("popup");
  popup.textContent = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

/* Reset the game (workspace and discovered elements) */
function resetGame() {
  workspaceElements = [];
  discoveredElements = [];
  localStorage.removeItem("discovered");
  renderWorkspace();
  document.getElementById("discovered").innerHTML = "";
  showPopup("Game Reset");
}
