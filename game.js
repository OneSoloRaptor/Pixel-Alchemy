// --- Element Data ---
const ELEMENTS = {
  "Conditional": { emoji: "🔀", explanation: "A structure that allows code to make decisions based on conditions (if, else)." },
  "Method": { emoji: "🔧", explanation: "A block of code within a class that performs a specific task. Called using objects or class names." },
  "Variable": { emoji: "📦", explanation: "A container for storing data values, with a type and identifier." },
  "Object": { emoji: "🧱", explanation: "An instance of a class that holds state and can perform actions via methods." },
  "Loop": { emoji: "🔁", explanation: "A way to repeat code multiple times (for, while, do-while)." },
  "If Statement": { emoji: "📝", explanation: "A statement that uses a conditional to control flow." },
  "For Loop": { emoji: "🔄", explanation: "A loop that uses a variable as a counter." },
  "Field": { emoji: "📍", explanation: "A variable declared inside a class." },
  "Class": { emoji: "🏛️", explanation: "A blueprint for creating objects, defining fields and methods." },
  "Method Call": { emoji: "📞", explanation: "Calling a method using an object." },
  "Parameter": { emoji: "🔣", explanation: "A variable used in a method definition." },
  "Constructor": { emoji: "🚪", explanation: "A special method for initializing new objects." },
  "Enhanced For Loop": { emoji: "🔁", explanation: "A loop that iterates over collections or arrays." },
  "While Loop": { emoji: "🔂", explanation: "A loop that repeats as long as a condition is true." },
  "Boolean Expression": { emoji: "💡", explanation: "An expression that evaluates to true or false." },
  "Return Statement": { emoji: "🔙", explanation: "Exits a method and optionally returns a value." },
  "Array": { emoji: "📚", explanation: "A container object that holds a fixed number of values of a single type." },
  "Inheritance": { emoji: "🧬", explanation: "A mechanism where a new class uses the properties of an existing class." },
  "Override": { emoji: "🔄", explanation: "Redefining a superclass method in a subclass." }
};

const COMBINATIONS = {
  "conditional+variable": "If Statement",
  "conditional+method": "Boolean Expression",
  "conditional+object": "Boolean Expression",
  "conditional+loop": "While Loop",
  "variable+method": "Parameter",
  "variable+object": "Field",
  "variable+loop": "For Loop",
  "method+object": "Method Call",
  "method+loop": "Return Statement",
  "method+conditional": "Boolean Expression",
  "object+loop": "Array",
  "object+conditional": "Boolean Expression",
  "loop+conditional": "While Loop",
  "loop+method": "Return Statement",
  "loop+variable": "For Loop",
  "loop+object": "Array",
  "class+object": "Inheritance",
  "class+method": "Constructor",
  "class+class": "Inheritance",
  "method+method": "Override",
  "array+loop": "Enhanced For Loop"
};

const STARTER_ELEMENTS = ["Conditional", "Method", "Variable", "Object", "Loop"];

let workspaceElements = [];
let discovered = new Set(STARTER_ELEMENTS);

function comboKey(a, b) {
  return [a.toLowerCase(), b.toLowerCase()].sort().join("+");
}

function getElementData(name) {
  return ELEMENTS[name] || { emoji: "❓", explanation: "Unknown element." };
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

// UI Rendering
function renderWorkspace() {
  const ws = document.getElementById("workspace");
  ws.querySelectorAll(".workspace-block").forEach(e => e.remove());
  workspaceElements.forEach(el => {
    const div = document.createElement("div");
    div.className = "workspace-block";
    div.setAttribute("data-id", el.id);
    div.style.left = el.x + "px";
    div.style.top = el.y + "px";
    div.textContent = el.emoji;
    div.title = el.name;
    div.draggable = true;
    div.addEventListener("dragstart", dragStart);
    div.addEventListener("dragend", dragEnd);
    ws.appendChild(div);
  });
}

function renderSidebar() {
  const elList = document.getElementById("elements");
  elList.innerHTML = "";
  STARTER_ELEMENTS.forEach(name => {
    const btn = document.createElement("button");
    btn.className = "element-btn";
    btn.textContent = `${ELEMENTS[name].emoji} ${name}`;
    btn.onclick = () => addToWorkspace(name);
    elList.appendChild(btn);
  });

  const explList = document.getElementById("explanations");
  explList.innerHTML = "";
  [...discovered].forEach(name => {
    const div = document.createElement("div");
    div.className = "explanation";
    div.innerHTML = `<span>${ELEMENTS[name].emoji}</span> <b>${name}</b>: ${ELEMENTS[name].explanation}`;
    explList.appendChild(div);
  });
}

function addToWorkspace(name) {
  const ws = document.getElementById("workspace");
  const wsRect = ws.getBoundingClientRect();
  workspaceElements.push({
    name,
    emoji: ELEMENTS[name].emoji,
    x: 80 + Math.random() * (wsRect.width - 160),
    y: 80 + Math.random() * (wsRect.height - 160),
    id: makeId()
  });
  renderWorkspace();
  checkCombinations();
}

// Drag and Drop
let dragEl = null;
let dragOffset = { x: 0, y: 0 };

function dragStart(e) {
  dragEl = this;
  dragOffset.x = e.offsetX;
  dragOffset.y = e.offsetY;
}

function dragEnd(e) {
  if (!dragEl) return;
  const ws = document.getElementById("workspace");
  const wsRect = ws.getBoundingClientRect();
  let x = e.clientX - wsRect.left - dragOffset.x;
  let y = e.clientY - wsRect.top - dragOffset.y;
  const id = dragEl.getAttribute("data-id");
  const el = workspaceElements.find(el => el.id === id);
  el.x = Math.max(0, Math.min(x, wsRect.width - 50));
  el.y = Math.max(0, Math.min(y, wsRect.height - 50));
  dragEl = null;
  renderWorkspace();
  checkCombinations();
}

// Main Logic
function isOverlap(a, b) {
  return !(
    a.x + 50 < b.x ||
    a.x > b.x + 50 ||
    a.y + 50 < b.y ||
    a.y > b.y + 50
  );
}

function checkCombinations() {
  let foundValidCombo = false;
  let foundInvalidOverlap = false;
  let pairA = null, pairB = null, newCombo = null;

  // Check all unique pairs
  for (let i = 0; i < workspaceElements.length; i++) {
    for (let j = i + 1; j < workspaceElements.length; j++) {
      const a = workspaceElements[i], b = workspaceElements[j];
      if (isOverlap(a, b)) {
        const combo = COMBINATIONS[comboKey(a.name, b.name)];
        if (combo) {
          foundValidCombo = true;
          pairA = a; pairB = b; newCombo = combo;
          break;
        } else {
          foundInvalidOverlap = true;
        }
      }
    }
    if (foundValidCombo) break;
  }

  if (foundValidCombo && pairA && pairB && newCombo) {
    workspaceElements = workspaceElements.filter(el => el.id !== pairA.id && el.id !== pairB.id);
    const x = (pairA.x + pairB.x) / 2, y = (pairA.y + pairB.y) / 2;
    workspaceElements.push({
      name: newCombo,
      emoji: ELEMENTS[newCombo].emoji,
      x, y, id: makeId()
    });
    if (!discovered.has(newCombo)) {
      discovered.add(newCombo);
      showExplanationPopup(newCombo);
    }
    renderWorkspace();
    renderSidebar();
    setTimeout(checkCombinations, 300);
    return;
  }

  // Show "cannot combine" only if there's an overlap but no valid combination
  if (foundInvalidOverlap) {
    showCannotCombinePopup();
  }
}

function showExplanationPopup(name) {
  const popup = document.getElementById("explanation-popup");
  popup.textContent = `${ELEMENTS[name].emoji} ${name}: ${ELEMENTS[name].explanation}`;
  popup.style.display = "block";
  setTimeout(() => { popup.style.display = "none"; }, 1800);
}

function showCannotCombinePopup() {
  const popup = document.getElementById("cannot-combine-popup");
  popup.textContent = "Cannot combine these elements!";
  popup.style.display = "block";
  setTimeout(() => { popup.style.display = "none"; }, 1200);
}

// Init
window.onload = () => {
  renderWorkspace();
  renderSidebar();
  document.getElementById("cleanBoardBtn").onclick = () => {
    workspaceElements = [];
    renderWorkspace();
  };
  document.getElementById("resetBtn").onclick = () => {
    workspaceElements = [];
    discovered = new Set(STARTER_ELEMENTS);
    renderWorkspace();
    renderSidebar();
  };
}
