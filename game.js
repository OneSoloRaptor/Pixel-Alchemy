const initialElements = ["fire", "water", "earth", "air"];
const allElements = [
  "fire", "water", "earth", "air", "pressure", "energy", "dust", "lava",
  "rain", "mud", "steam", "sea", "wind", "stone", "atmosphere", "earthquake",
  "gunpowder", "salt", "volcano", "granite", "obsidian", "brick", "plant",
  "flood", "ocean", "geyser", "sky", "sand", "wall", "fog", "mountain", "storm",
  "metal", "explosion", "swamp", "tsunami", "algae", "isle", "wave", "cotton",
  "grass", "tobacco", "seaweed", "garden", "moss", "coal", "ash", "cloud",
  "eruption", "hurricane", "rust", "sound", "atomic bomb", "grenade",
  "fireworks", "glass", "sun", "dew", "bullet", "archipelago", "steel",
  "electricity", "blade", "mountain range", "river", "beach", "horizon",
  "flower", "ivy", "diamond", "sandstorm", "clay", "cactus", "desert",
  "quicksand", "dune", "moon", "boiler", "sandstone", "life", "house", "pond",
  "bird", "scissors", "blender", "scythe", "sword", "golem", "pyramid", "oasis",
  "ring", "human", "light bulb", "wire", "pottery", "water lily", "sunflower",
  "glasses", "mirror", "telescope"
];

// Define combinations: key is a sorted pair of elements, value is the result
const combinations = {
  "air,earth": "dust",
  "air,fire": "energy",
  "air,water": "rain",
  "earth,fire": "lava",
  "earth,water": "mud",
  "fire,water": "steam",
  "earth,air": "dust",
  "water,air": "rain",
  "fire,air": "energy",
  "water,earth": "mud",
  "fire,earth": "lava",
  "water,fire": "steam",
  // Add more combinations as needed
};

let discovered = new Set(initialElements);
let workspace = document.getElementById("workspace");
let elementsContainer = document.getElementById("elements");
let counter = document.getElementById("counter");
let resetBtn = document.getElementById("resetBtn");

function updateCounter() {
  counter.textContent = `Discovered: ${discovered.size} / 100`;
}

function createInventoryElement(name) {
  let el = document.createElement("div");
  el.className = "element";
  el.textContent = name;
  el.draggable = true;
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", name);
  });
  elementsContainer.appendChild(el);
}

function addToInventory(name) {
  if (!discovered.has(name)) {
    discovered.add(name);
    createInventoryElement(name);
    updateCounter();
  }
}

function createWorkspaceElement(name, x, y) {
  let el = document.createElement("div");
  el.className = "workspace-element";
  el.textContent = name;
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.draggable = true;
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", name);
    e.dataTransfer.setData("offsetX", e.offsetX);
    e.dataTransfer.setData("offsetY", e.offsetY);
  });
  workspace.appendChild(el);
  return el;
}

function getCombination(a, b) {
  let key = [a, b].sort().join(",");
  return combinations[key];
}

workspace.addEventListener("dragover", (e) => {
  e.preventDefault();
});

workspace.addEventListener("drop", (e) => {
  e.preventDefault();
  let name = e.dataTransfer.getData("text/plain");
  let offsetX = parseInt(e.dataTransfer.getData("offsetX")) || 30;
  let offsetY = parseInt(e.dataTransfer.getData("offsetY")) || 30;
  let x = e.clientX - workspace.getBoundingClientRect().left - offsetX;
  let y = e.clientY - workspace.getBoundingClientRect().top - offsetY;
  let newEl = createWorkspaceElement(name, x, y);

  // Check for combinations
  let others = Array.from(workspace.getElementsByClassName("workspace-element")).filter(el => el !== newEl);
  for (let el of others) {
    let rect1 = newEl.getBoundingClientRect();
    let rect2 = el.getBoundingClientRect();
    if (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    ) {
      let result = getCombination(newEl.textContent, el.textContent);
      if (result) {
        addToInventory(result);
        // Remove old elements
        workspace.removeChild(newEl);
        workspace.removeChild(el);
        // Add new element
        let combinedX = (rect1.left + rect2.left) / 2 - workspace.getBoundingClientRect().left;
        let combinedY = (rect1.top + rect2.top) / 2 - workspace.getBoundingClientRect().top;
        createWorkspaceElement(result, combinedX, combinedY);
      }
      break;
    }
  }
});

resetBtn.addEventListener("click", () => {
  discovered = new Set(initialElements);
  elementsContainer.innerHTML = "";
  workspace.innerHTML = "";
  initialElements.forEach(el => createInventoryElement(el));
  updateCounter();
});

// Initialize
initialElements.forEach(el => createInventoryElement(el));
updateCounter();
