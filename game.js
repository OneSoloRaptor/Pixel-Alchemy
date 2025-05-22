// --- Element Data with Explanations ---
const ELEMENTS = {
  // --- First Tier ---
  "Conditional": {
    emoji: "🔀",
    explanation: "A structure that allows code to make decisions based on conditions (if, else)."
  },
  "Method": {
    emoji: "🔧",
    explanation: "A block of code within a class that performs a specific task. Called using objects or class names."
  },
  "Variable": {
    emoji: "📦",
    explanation: "A container for storing data values, with a type and identifier."
  },
  "Object": {
    emoji: "🧱",
    explanation: "An instance of a class that holds state and can perform actions via methods."
  },
  "Loop": {
    emoji: "🔁",
    explanation: "A way to repeat code multiple times (for, while, do-while)."
  },

  // --- Combination Results ---
  "If Statement": {
    emoji: "📝",
    explanation: "A statement that uses a conditional to control flow."
  },
  "For Loop": {
    emoji: "🔄",
    explanation: "A loop that uses a variable as a counter."
  },
  "Field": {
    emoji: "📍",
    explanation: "A variable declared inside a class."
  },
  "Class": {
    emoji: "🏛️",
    explanation: "A blueprint for creating objects, defining fields and methods."
  },
  "Method Call": {
    emoji: "📞",
    explanation: "Calling a method using an object."
  },
  "Parameter": {
    emoji: "🔣",
    explanation: "A variable used in a method definition."
  },
  "Constructor": {
    emoji: "🚪",
    explanation: "A special method for initializing new objects."
  },
  "Enhanced For Loop": {
    emoji: "🔁",
    explanation: "A loop that iterates over collections or arrays."
  },
  "While Loop": {
    emoji: "🔂",
    explanation: "A loop that repeats as long as a condition is true."
  },
  "Boolean Expression": {
    emoji: "💡",
    explanation: "An expression that evaluates to true or false."
  },
  "Return Statement": {
    emoji: "🔙",
    explanation: "Exits a method and optionally returns a value."
  },
  "Array": {
    emoji: "📚",
    explanation: "A container object that holds a fixed number of values of a single type."
  },
  "Inheritance": {
    emoji: "🧬",
    explanation: "A mechanism where a new class uses the properties of an existing class."
  },
  "Override": {
    emoji: "🔄",
    explanation: "Redefining a superclass method in a subclass."
  },
  // ...add more as desired!
};

// --- All Valid Combinations (including new/advanced ones) ---
const COMBINATIONS = {
  // All pairs between starting elements:
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

  // Some extra fun combos:
  "class+object": "Inheritance",
  "class+method": "Constructor",
  "class+class": "Inheritance",
  "method+method": "Override",
  "array+loop": "Enhanced For Loop",
  // ...add more advanced combos as desired!
};

// --- Combination Logic: check for overlapping blocks ---
function checkCombinations() {
  if (workspaceElements.length < 2) return;

  // Try to find a combination among all pairs
  let foundAnyCombination = false;
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
          foundAnyCombination = true;
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

  // Only show "cannot combine" if there are pairs but none have a valid combination
  if (!foundAnyCombination) {
    // Check if there are any possible overlapping pairs
    let possibleComboExists = false;
    for (let i = 0; i < workspaceElements.length; i++) {
      for (let j = i + 1; j < workspaceElements.length; j++) {
        if (COMBINATIONS[comboKey(workspaceElements[i].name, workspaceElements[j].name)]) {
          possibleComboExists = true;
          break;
        }
      }
      if (possibleComboExists) break;
    }
    if (!possibleComboExists) {
      showCannotCombinePopup();
    }
  }
}
