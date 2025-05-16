(() => {
  // CSA objects and their recipes
  const CSA_ELEMENTS = [
    { name: "Class", recipe: [] },
    { name: "Object", recipe: [] },
    { name: "Method", recipe: [] },
    { name: "Variable", recipe: [] },
    { name: "Loop", recipe: [] },
    { name: "Conditional", recipe: [] },

    { name: "Constructor", recipe: ["Class", "Method"] },
    { name: "Counter", recipe: ["Variable", "Loop"] },
    { name: "Parameter", recipe: ["Method", "Variable"] },
    { name: "Override", recipe: ["Method", "Conditional"] },
    { name: "Call", recipe: ["Object", "Method"] },
    { name: "Subclass", recipe: ["Class", "Object"] },
    { name: "While Loop", recipe: ["Loop", "Conditional"] },
    { name: "Instance Variable", recipe: ["Class", "Variable"] },
    { name: "Boolean", recipe: ["Conditional", "Variable"] },
    { name: "Inheritance", recipe: ["Object", "Class"] },

    { name: "For Loop", recipe: ["While Loop", "Counter"] },
    { name: "Polymorphism", recipe: ["Subclass", "Inheritance"] },
    { name: "Return", recipe: ["Call", "Variable"] },
    { name: "Signature", recipe: ["Method", "Parameter"] },
    { name: "Overloading", recipe: ["Signature", "Constructor"] },
    { name: "If Statement", recipe: ["Boolean", "Call"] },

    { name: "Scope", recipe: ["Method", "Loop"] },
    { name: "This Keyword", recipe: ["Instance Variable", "Call"] },
    { name: "Default Constructor", recipe: ["Constructor", "Subclass"] },
    { name: "Abstract Class", recipe: ["Polymorphism", "Class"] },
    { name: "Nested Loop", recipe: ["Loop", "For Loop"] },
    { name: "Static Variable", recipe: ["Class", "Boolean"] },
    { name: "Getter/Setter", recipe: ["Method", "Inheritance"] }
  ];

  // DOM references
  const sandbox = document.getElementById("sandbox");
  const discovery = document.getElementById("discovery");
  const spawnerButtonsContainer = document.getElementById("spawner-buttons");
  const trash = document.getElementById("trash");
  const sandboxTabBtn = document.getElementById("sandbox-tab");
  const discoveryTabBtn = document.getElementById("discovery-tab");

  // Track discovered elements
  const discovered = new Set();

  // For drag and drop state
  let dragSource = null;

  // Spawn base elements buttons (those with empty recipe)
  function initSpawner() {
    CSA_ELEMENTS.filter(el => el.recipe.length === 0).forEach(el => {
      const btn = document.createElement("button");
      btn.textContent = el.name;
      btn.classList.add("spawner");
      btn.dataset.name = el.name;
      btn.addEventListener("click", () => spawnElement(el.name));
      spawnerButtonsContainer.appendChild(btn);
    });
  }

  // Create a card element in sandbox
  function createCard(name) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = name;
    card.dataset.name = name;
    makeDraggable(card);
    return card;
  }

  // Spawn element card in sandbox
  function spawnElement(name) {
    if (!discovered.has(name)) {
      discovered.add(name);
      updateDiscovery();
    }
    const card = createCard(name);
    sandbox.appendChild(card);
  }

  // Update discovery tab
  function updateDiscovery() {
    discovery.innerHTML = "";
    // Sort discovered alphabetically for easier browsing
    const arr = Array.from(discovered).sort();
    arr.forEach(name => {
      const el = createCard(name);
      el.style.cursor = "default";
      el.draggable = false;
      discovery.appendChild(el);
    });
  }

  // Make a card draggable with drag-drop events
  function makeDraggable(card) {
    card.draggable = true;

    card.addEventListener("dragstart", e => {
      dragSource = card;
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain", card.dataset.name);
      // Needed for Firefox
      e.dataTransfer.effectAllowed = "move";
    });

    card.addEventListener("dragend", e => {
      dragSource = null;
      card.classList.remove("dragging");
      trash.classList.remove("drag-over");
    });

    card.addEventListener("dragover", e => {
      e.preventDefault();
    });

    card.addEventListener("drop", e => {
      e.preventDefault();
      if (!dragSource || dragSource === card) return;

      const nameA = dragSource.dataset.name;
      const nameB = card.dataset.name;

      // Try combining nameA + nameB OR nameB + nameA
      const combinedName = tryCombine(nameA, nameB) || tryCombine(nameB, nameA);
      if (combinedName) {
        // Spawn new combined element
        spawnElement(combinedName);
        // Remove combined originals
        dragSource.remove();
        card.remove();
      }
    });
  }

  // Check if two elements combine to create a new one
  function tryCombine(a, b) {
    for (const el of CSA_ELEMENTS) {
      if (el.recipe.length === 2) {
        // Check if recipe matches a + b in any order
        if (
          (el.recipe[0] === a && el.recipe[1] === b) ||
          (el.recipe[0] === b && el.recipe[1] === a)
        ) {
          return el.name;
        }
      }
    }
    return null;
  }

  // Trash drag/drop
  trash.addEventListener("dragover", e => {
    e.preventDefault();
    trash.classList.add("drag-over");
  });
  trash.addEventListener("dragleave", e => {
    trash.classList.remove("drag-over");
  });
  trash.addEventListener("drop", e => {
    e.preventDefault();
    if (dragSource) {
      dragSource.remove();
      trash.classList.remove("drag-over");
      dragSource = null;
    }
  });

  // Tabs switching
  sandboxTabBtn.addEventListener("click", () => {
    sandboxTabBtn.classList.add("active");
    discoveryTabBtn.classList.remove("active");
    sandbox.style.display = "";
    discovery.style.display = "none";
  });
  discoveryTabBtn.addEventListener("click", () => {
    discoveryTabBtn.classList.add("active");
    sandboxTabBtn.classList.remove("active");
    sandbox.style.display = "none";
    discovery.style.display = "";
    updateDiscovery();
  });

  // Initialize everything
  initSpawner();
})();
