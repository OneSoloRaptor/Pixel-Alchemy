const mainArea = document.getElementById('mainArea');
const baseElementsDiv = document.getElementById('baseElements');
const discoveredElementsDiv = document.getElementById('discoveredElements');

// Base Elements
const baseElements = [
  { name: "Air" },
  { name: "Earth" },
  { name: "Fire" },
  { name: "Water" }
];

// Recipes (combinations)
// unordered pairs (alphabetical), values are the result
// example: ["Air", "Water"] => "Rain"
const recipes = {
  "Air,Earth": "Dust",
  "Air,Fire": "Energy",
  "Air,Water": "Rain",
  "Earth,Fire": "Lava",
  "Earth,Water": "Mud",
  "Fire,Water": "Steam",

  "Dust,Fire": "Ash",
  "Dust,Mud": "Clay",
  "Energy,Mud": "Life",
  "Lava,Air": "Stone",
  "Mud,Plant": "Swamp",
  "Plant,Water": "Algae",

  "Life,Clay": "Human",
  "Human,Fire": "Cook",
  "Human,Water": "Swim",
  "Human,Earth": "Farmer",
  "Human,Air": "Run",

  // Add more as needed
};

// Track discovered elements
const discovered = new Set(baseElements.map(e => e.name));

// Generate buttons for base elements
baseElements.forEach(el => {
  const btn = document.createElement('button');
  btn.textContent = el.name;
  btn.className = 'element-btn';
  btn.onclick = () => addElementToMain(el.name);
  baseElementsDiv.appendChild(btn);
});

// Add an element draggable to main area
function addElementToMain(name, x = null, y = null) {
  if (!discovered.has(name)) {
    discovered.add(name);
    updateDiscovered();
  }

  const el = document.createElement('div');
  el.className = 'draggable';
  el.textContent = name;
  // Position random if not specified
  el.style.left = x !== null ? `${x}px` : `${Math.random() * (mainArea.clientWidth - 100)}px`;
  el.style.top = y !== null ? `${y}px` : `${Math.random() * (mainArea.clientHeight - 40)}px`;
  mainArea.appendChild(el);

  makeDraggable(el);
}

function updateDiscovered() {
  discoveredElementsDiv.innerHTML = '';
  Array.from(discovered).sort().forEach(name => {
    const div = document.createElement('div');
    div.textContent = name;
    div.style.padding = '4px 8px';
    div.style.borderBottom = '1px solid #00796b';
    discoveredElementsDiv.appendChild(div);
  });
}

// Make an element draggable and droppable to combine
function makeDraggable(el) {
  let offsetX, offsetY, dragging = false;
  let currentDroppable = null;

  el.addEventListener('mousedown', e => {
    dragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;

    // Check if dragging over another draggable element (not self)
    currentDroppable = null;
    const elems = document.elementsFromPoint(e.clientX, e.clientY);
    for (const elem of elems) {
      if (elem.classList && elem.classList.contains('draggable') && elem !== el) {
        currentDroppable = elem;
        break;
      }
    }
  });

  document.addEventListener('mouseup', e => {
    if (dragging) {
      dragging = false;
      el.style.zIndex = '';

      if (currentDroppable) {
        tryCombine(el, currentDroppable);
      }
    }
  });
}

// Try to combine two elements
function tryCombine(el1, el2) {
  const name1 = el1.textContent;
  const name2 = el2.textContent;

  // Order names alphabetically to match recipes keys
  const key = [name1, name2].sort().join(',');

  if (recipes[key]) {
    const newElement = recipes[key];
    if (!discovered.has(newElement)) {
      alert(`You discovered: ${newElement}!`);
      discovered.add(newElement);
      updateDiscovered();
    }
    // Add new element near combined elements
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    const x = (rect1.left + rect2.left) / 2 - mainArea.getBoundingClientRect().left;
    const y = (rect1.top + rect2.top) / 2 - mainArea.getBoundingClientRect().top;

    addElementToMain(newElement, x, y);
  }
}

// Initialize with base elements on main area too for fun
baseElements.forEach(el => addElementToMain(el.name));
updateDiscovered();
