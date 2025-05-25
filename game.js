// ===== Pixel Alchemy: APCSA Edition =====
const ELEMENTS = {
  "Conditional": { emoji: "🔀", explanation: "A structure that allows code to make decisions based on conditions (if, else)." },
  "Method": { emoji: "🔧", explanation: "A block of code within a class that performs a specific task. Called using objects or class names." },
  "Variable": { emoji: "📦", explanation: "A container for storing data values, with a type and identifier." },
  "Object": { emoji: "🧱", explanation: "An instance of a class that holds state and can perform actions via methods." },
  "Loop": { emoji: "🔁", explanation: "A way to repeat code multiple times (for, while, do-while)." },
  "Class": { emoji: "🏛️", explanation: "A blueprint for creating objects, defining fields and methods." },
  "Constructor": { emoji: "🏗️", explanation: "A special method used to instantiate objects and initialize their state." },
  "Counter": { emoji: "🔢", explanation: "A variable used to keep track of iterations in loops." },
  "Parameter": { emoji: "🔣", explanation: "Data passed into methods to customize their operation." },
  "Override": { emoji: "🔄", explanation: "Redefining a superclass method in a subclass to change its behavior." },
  "Call": { emoji: "📞", explanation: "Invoking a method on an object or class." },
  "Subclass": { emoji: "🧬", explanation: "A class that inherits from another class (superclass), gaining its fields and methods." },
  "While Loop": { emoji: "🔂", explanation: "A loop that repeats as long as a condition is true." },
  "Instance Variable": { emoji: "📍", explanation: "A variable defined in a class and tied to object instances." },
  "Boolean": { emoji: "🔘", explanation: "A variable or expression that is either true or false." },
  "Accessing": { emoji: "📬", explanation: "Retrieving or modifying the value of an object's fields." },
  "Inheritance": { emoji: "🧬", explanation: "A mechanism where a class acquires the properties and behaviors of another class." },
  "Signature": { emoji: "✍️", explanation: "The combination of a method's name and its parameter types." },
  "Return": { emoji: "↩️", explanation: "Providing a value back from a method to its caller." },
  "Polymorphism": { emoji: "🌀", explanation: "The ability for different classes to be treated as the same type, usually via inheritance." },
  "For Loop": { emoji: "⏩", explanation: "A loop that runs a specific number of times, often using a counter." },
  "Instance": { emoji: "🪄", explanation: "A concrete occurrence of any object, created from a class." },
  "Overloading": { emoji: "➕", explanation: "Defining multiple methods with the same name but different parameter lists." },
  "If Statement": { emoji: "❓", explanation: "A conditional statement that executes code only if a condition is true." },
  "Interface": { emoji: "🔌", explanation: "A reference type in Java used to specify methods a class must implement." },
  "Abstract Class": { emoji: "🌫️", explanation: "A class that cannot be instantiated and may have abstract methods to be implemented by subclasses." },
  "Array": { emoji: "📚", explanation: "A collection of elements, all of the same type, stored in a contiguous block of memory." },
  "ArrayList": { emoji: "📋", explanation: "A resizable array implementation found in the Java Collections Framework." },
  "Null": { emoji: "0️⃣", explanation: "A special value indicating that a variable does not reference any object." },
  "Encapsulation": { emoji: "🔒", explanation: "The practice of keeping fields private and controlling access via methods." },
  "Static": { emoji: "📌", explanation: "A field or method that belongs to the class, not instances." },
  "Casting": { emoji: "🧪", explanation: "Converting a variable from one type to another." },
  "Recursion": { emoji: "🔁", explanation: "A method calling itself to solve a problem in smaller steps." },
  "Algorithm": { emoji: "🧮", explanation: "A step-by-step procedure for solving a problem." },
  "Scope": { emoji: "🔭", explanation: "Defines where a variable or method is accessible in the code." },
  "APIs": { emoji: "🔗", explanation: "Application Programming Interfaces: libraries and their documentation used to interact with code." },
  "Exception": { emoji: "⚠️", explanation: "An event that disrupts the normal flow of a program’s instructions." },
  "Try-Catch": { emoji: "🛑", explanation: "A block to handle exceptions and execute code safely." }
};

const COMBINATIONS = {
  "class+method": "Constructor",
  "loop+variable": "Counter",
  "method+variable": "Parameter",
  "method+method": "Override",
  "object+method": "Call",
  "class+class": "Subclass",
  "conditional+loop": "While Loop",
  "class+variable": "Instance Variable",
  "conditional+variable": "Boolean",
  "object+variable": "Accessing",
  "object+class": "Inheritance",
  "while loop+counter": "For Loop",
  "class+subclass": "Polymorphism",
  "constructor+object": "Instance",
  "call+variable": "Return",
  "method+parameter": "Signature",
  "signature+constructor": "Overloading",
  "call+boolean": "If Statement",
  "class+interface": "Abstract Class",
  "class+abstract class": "Interface",
  "variable+object": "Null",
  "instance variable+encapsulation": "Static",
  "object+array": "ArrayList",
  "loop+array": "Array",
  "object+null": "Exception",
  "class+signature": "APIs",
  "instance+object": "Casting",
  "recursion+method": "Algorithm",
  "parameter+scope": "Encapsulation",
  "exception+try-catch": "Try-Catch",
  "object+loop": "Recursion",
  "loop+recursion": "Algorithm",
  "method+boolean": "Return",
  "for loop+counter": "Algorithm",
};

const BASE_ELEMENT_KEYS = [
  "Conditional", "Method", "Variable", "Object", "Loop", "Class"
];

let workspaceElements = [];
let discoveredElements = JSON.parse(localStorage.getItem("discovered") || "[]");
let draggingElem = null, dragOffset = {x:0, y:0}, dragStartPos = {x:0, y:0};
let sidebarTab = "elements";

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
function getElementData(name) {
  return ELEMENTS[name] || {emoji: "❓", explanation: "Explanation not available."};
}

// --- Rendering ---
function renderSidebar() {
  document.getElementById("elementsTabBtn").classList.toggle("active", sidebarTab === "elements");
  document.getElementById("explanationsTabBtn").classList.toggle("active", sidebarTab === "explanations");
  document.getElementById("elements").style.display = sidebarTab === "elements" ? "block" : "none";
  document.getElementById("explanations").style.display = sidebarTab === "explanations" ? "block" : "none";
}
function renderSidebarElements() {
  const elList = document.getElementById("elements");
  elList.innerHTML = "";
  // Add base elements
  BASE_ELEMENT_KEYS.forEach(name => {
    const {emoji} = getElementData(name);
    const div = document.createElement("div");
    div.className = "element";
    div.draggable = false;
    div.dataset.element = name;
    div.innerHTML = `<span class="emoji">${emoji}</span><span class="label">${name}</span>`;
    div.addEventListener("mousedown", sidebarMouseDown);
    elList.appendChild(div);
  });
  // Then show discovered non-base elements (in sidebar) — make draggable
  discoveredElements
    .filter(({name}) => !BASE_ELEMENT_KEYS.includes(name))
    .forEach(({name}) => {
      const {emoji} = getElementData(name);
      const div = document.createElement("div");
      div.className = "element discovered";
      div.draggable = false;
      div.dataset.element = name; // ADD THIS LINE
      div.innerHTML = `<span class="emoji">${emoji}</span><span class="label">${name}</span>`;
      div.addEventListener("mousedown", sidebarMouseDown); // ADD THIS LINE
      elList.appendChild(div);
    });
}
function renderDiscoveredExplanations() {
  const expList = document.getElementById("explanations");
  expList.innerHTML = "";
  // Show explanations for base elements first
  BASE_ELEMENT_KEYS.forEach((name) => {
    const {emoji, explanation} = getElementData(name);
    const div = document.createElement("div");
    div.className = "element explanation base";
    div.innerHTML = `<span class="emoji">${emoji}</span>
      <span class="label">${name}</span>
      <div class="explanation-text">${explanation}</div>`;
    expList.appendChild(div);
  });
  // Then show discovered non-base elements with explanations
  discoveredElements
    .filter(({name}) => !BASE_ELEMENT_KEYS.includes(name))
    .forEach(({name}) => {
      const {emoji, explanation} = getElementData(name);
      const div = document.createElement("div");
      div.className = "element explanation";
      div.innerHTML = `<span class="emoji">${emoji}</span>
        <span class="label">${name}</span>
        <div class="explanation-text">${explanation}</div>`;
      expList.appendChild(div);
    });
}
function renderWorkspace() {
  const ws = document.getElementById("workspace");
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
  const {emoji} = getElementData(elementName);
  if (!elementName) return;
  const ws = document.getElementById("workspace");
  const wsRect = ws.getBoundingClientRect();
  const dragGhost = document.createElement("div");
  dragGhost.className = "workspace-block dragging";
  dragGhost.style.position = "absolute";
  dragGhost.innerHTML = `<span class="emoji">${emoji}</span><span class="label">${elementName}</span>`;
  dragGhost.style.pointerEvents = "none";
  ws.appendChild(dragGhost);

  function mouseMoveHandler(me) {
    let x = me.clientX - wsRect.left - 40;
    let y = me.clientY - wsRect.top - 40;
    dragGhost.style.left = x + "px";
    dragGhost.style.top = y + "px";
  }
  function mouseup(e2) {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    dragGhost.remove();
    let x = e2.clientX - wsRect.left - 40;
    let y = e2.clientY - wsRect.top - 40;
    if (x >= 0 && y >= 0 && x <= wsRect.width-80 && y <= wsRect.height-80) {
      workspaceElements.push({ name: elementName, emoji, x, y, id: makeId() });
      renderWorkspace();
      setTimeout(checkCombinations, 100);
    }
  }
  function mousemove(e2) { mouseMoveHandler(e2); }
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
}

// --- Trash Can Drag/Delete Logic ---
function setupTrashCan() {
  const trashCan = document.getElementById("trashCan");
  let overTrash = false;
  document.addEventListener("mousemove", function(e) {
    if (!draggingElem) return;
    const trashRect = trashCan.getBoundingClientRect();
    if (
      e.clientX >= trashRect.left && e.clientX <= trashRect.right &&
      e.clientY >= trashRect.top && e.clientY <= trashRect.bottom
    ) {
      trashCan.classList.add("drag-over");
      overTrash = true;
    } else {
      trashCan.classList.remove("drag-over");
      overTrash = false;
    }
  });
  document.addEventListener("mouseup", function(e) {
    if (!draggingElem) return;
    const trashRect = trashCan.getBoundingClientRect();
    if (
      e.clientX >= trashRect.left && e.clientX <= trashRect.right &&
      e.clientY >= trashRect.top && e.clientY <= trashRect.bottom
    ) {
      // Remove the corresponding element from workspaceElements
      const id = draggingElem.dataset.id;
      workspaceElements = workspaceElements.filter(elem => elem.id !== id);
      renderWorkspace();
      draggingElem = null;
    }
    trashCan.classList.remove("drag-over");
  });
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
    x = Math.max(0, Math.min(x, wsRect.width - 80));
    y = Math.max(0, Math.min(y, wsRect.height - 80));
    draggingElem.style.left = x + "px";
    draggingElem.style.top = y + "px";
  }
  function mouseup(ev) {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    draggingElem.classList.remove("dragging");
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
        const comboName = COMBINATIONS[comboKey(a.name, b.name)];
        if (comboName) {
          const comboData = getElementData(comboName);
          workspaceElements = workspaceElements.filter(e => e.id !== a.id && e.id !== b.id);
          const newX = (a.x + b.x) / 2;
          const newY = (a.y + b.y) / 2;
          const newItem = { name: comboName, emoji: comboData.emoji, x: newX, y: newY, id: makeId() };
          workspaceElements.push(newItem);
          let isNew = addDiscovered(comboName);
          renderWorkspace();
          if (isNew) showExplanationPopup(comboName);
          setTimeout(checkCombinations, 300);
          return;
        }
      }
    }
  }
}
function isOverlap(r1, r2) {
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}
function addDiscovered(name) {
  if (!discoveredElements.find(e => e.name === name)) {
    const {emoji} = getElementData(name);
    discoveredElements.push({name, emoji});
    localStorage.setItem("discovered", JSON.stringify(discoveredElements));
    renderSidebarElements();
    renderDiscoveredExplanations();
    return true;
  }
  return false;
}

// --- Pop-up for explanations (7s) ---
let popupTimeout = null;
function showExplanationPopup(elementName) {
  const {emoji, explanation} = getElementData(elementName);
  const popup = document.getElementById("explanation-popup");
  popup.innerHTML = `
    <div class="popup-title">New Element Discovered!</div>
    <div class="popup-emoji">${emoji}</div>
    <div class="popup-label">${elementName}</div>
    <div class="popup-explanation">${explanation}</div>
  `;
  popup.classList.add("show");
  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => popup.classList.remove("show"), 7000);
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
  renderSidebarElements();
  renderDiscoveredExplanations();
  showPopup("Game Reset!");
}

function cleanBoard() {
  workspaceElements = [];
  renderWorkspace();
  showPopup("Workspace cleaned!");
}

// --- Main ---
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("elementsTabBtn").onclick = () => {
    sidebarTab = "elements";
    renderSidebar();
  };
  document.getElementById("explanationsTabBtn").onclick = () => {
    sidebarTab = "explanations";
    renderSidebar();
  };
  renderSidebarElements();
  renderDiscoveredExplanations();
  renderWorkspace();
  renderSidebar();
  document.getElementById("resetBtn").onclick = resetGame;
  document.getElementById("cleanBoardBtn").onclick = cleanBoard;
  setupTrashCan();
});
