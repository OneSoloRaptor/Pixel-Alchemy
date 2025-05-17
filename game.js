// Elements data with descriptions
const elementsData = {
  'bit': {
    description: 'The smallest unit of data in computing, representing a 0 or 1.',
  },
  'logic': {
    description: 'A system of rules for reasoning and decision making.',
  },
  'byte': {
    description: 'A group of 8 bits, representing a data unit.',
  },
  'if statement': {
    description: 'A control structure for conditional execution in programming.',
  },
  'loop': {
    description: 'A programming structure that repeats a set of instructions.',
  },
  'array': {
    description: 'A collection of elements identified by index or key.',
  },
  'function': {
    description: 'A reusable block of code designed to perform a specific task.',
  },
  'program': {
    description: 'A sequence of instructions written to perform a specific task.',
  },
  'AI': {
    description: 'Artificial Intelligence: systems designed to perform tasks that normally require human intelligence.',
  },
  'machine learning': {
    description: 'A subset of AI focused on building systems that learn from data.',
  }
};

// Recipes: merge two keys (alphabetical order joined by '+') to get new element
const recipes = {
  'bit+bit': 'byte',
  'byte+logic': 'if statement',
  'byte+if statement': 'loop',
  'byte+loop': 'array',
  'array+logic': 'function',
  'byte+function': 'program',
  'function+logic': 'AI',
  'AI+byte': 'machine learning'
};

let discoveredElements = ['bit', 'logic']; // start with these discovered
let workspaceElements = [];

const elementsList = document.getElementById('elements-list');
const workspaceArea = document.getElementById('workspace-area');
const sidebarDesc = document.getElementById('sidebar-desc');
const descContent = document.getElementById('desc-content');
const popup = document.getElementById('popup');
const toggleDescBtn = document.getElementById('toggle-desc');

toggleDescBtn.addEventListener('click', () => {
  sidebarDesc.classList.toggle('hidden');
});

function renderElementsList() {
  elementsList.innerHTML = '';
  discoveredElements.forEach(name => {
    const el = document.createElement('div');
    el.className = 'element';
    el.textContent = name;
    el.setAttribute('draggable', 'true');
    el.dataset.name = name;

    // Drag start event for sidebar elements
    el.addEventListener('dragstart', dragStartHandler);

    // Click to show description
    el.addEventListener('click', () => {
      showDescription(name);
      if (sidebarDesc.classList.contains('hidden')) {
        sidebarDesc.classList.remove('hidden');
      }
    });

    elementsList.appendChild(el);
  });
}

function renderWorkspace() {
  workspaceArea.innerHTML = '';
  workspaceElements.forEach((name, index) => {
    const el = document.createElement('div');
    el.className = 'workspace-element';
    el.textContent = name;
    el.setAttribute('draggable', 'true');
    el.dataset.name = name;
    el.dataset.index = index;

    el.addEventListener('dragstart', dragStartHandler);
    el.addEventListener('dragover', dragOverHandler);
    el.addEventListener('drop', dropHandlerWorkspace);

    // Click shows description for workspace element
    el.addEventListener('click', () => {
      showDescription(name);
      if (sidebarDesc.classList.contains('hidden')) {
        sidebarDesc.classList.remove('hidden');
      }
    });

    workspaceArea.appendChild(el);
  });
}

// Drag and Drop handlers
let draggedElementName = null;
let draggedWorkspaceIndex = null;

function dragStartHandler(e) {
  const target = e.target;
  draggedElementName = target.dataset.name;

  // For workspace elements, also track index for rearranging
  if (target.classList.contains('workspace-element')) {
    draggedWorkspaceIndex = Number(target.dataset.index);
  } else {
    draggedWorkspaceIndex = null;
  }

  e.dataTransfer.effectAllowed = 'move';
  // Use a custom drag image or default
  e.dataTransfer.setData('text/plain', draggedElementName);
}

function dragOverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function dropHandlerWorkspace(e) {
  e.preventDefault();
  const dropTarget = e.target;
  if (!dropTarget.classList.contains('workspace-element')) {
    // Dropped on workspace blank area
    if (draggedWorkspaceIndex !== null) {
      // Moving workspace element within workspace: reorder not implemented for simplicity
      // Just do nothing for now
      return;
    }
    if (draggedElementName) {
      // Add element from sidebar to workspace
      workspaceElements.push(draggedElementName);
      renderWorkspace();
    }
    return;
  }

  // Dropped on an existing workspace element: try to merge
  const dropTargetName = dropTarget.dataset.name;
  const dropTargetIndex = Number(dropTarget.dataset.index);

  if (draggedWorkspaceIndex === dropTargetIndex) {
    return; // dropped on itself - ignore
  }

  const combo = tryCombine(draggedElementName, dropTargetName);
  if (combo) {
    // Replace dropped-on element with new combo element
    workspaceElements.splice(dropTargetIndex, 1, combo);

    // Remove dragged element if it was workspace element (to avoid duplicates)
    if (draggedWorkspaceIndex !== null) {
      // Remove dragged element (index might change if dragged is after dropTarget)
      const removedIndex = draggedWorkspaceIndex > dropTargetIndex ? draggedWorkspaceIndex + 1 : draggedWorkspaceIndex;
      workspaceElements.splice(removedIndex, 1);
    } else {
      // dragged from sidebar, just add new combo, remove dragged from workspaceElements if any? N/A
    }

    if (!discoveredElements.includes(combo)) {
      discoveredElements.push(combo);
      renderElementsList();
      showPopup(`New element discovered: ${combo}`);
    }

    renderWorkspace();
  } else {
    // No combo, if dragged was workspace element, reorder workspace
    if (draggedWorkspaceIndex !== null) {
      // Move dragged element to dropTargetIndex
      const draggedEl = workspaceElements.splice(draggedWorkspaceIndex, 1)[0];
      workspaceElements.splice(dropTargetIndex, 0, draggedEl);
      renderWorkspace();
    } else {
      // If dragged from sidebar, just add to workspace
      workspaceElements.push(draggedElementName);
      renderWorkspace();
    }
  }
  draggedElementName = null;
  draggedWorkspaceIndex = null;
}

function tryCombine(a, b) {
  if (!a || !b) return null;
  const pair1 = [a, b].sort().join('+');
  return recipes[pair1] || null;
}

function showDescription(name) {
  if (!name) {
    descContent.innerHTML = '<p>Select an element to see its description here.</p>';
    return;
  }
  const desc = elementsData[name]?.description || 'No description available.';
  descContent.innerHTML = `<h3>${name}</h3><p>${desc}</p>`;
}

function showPopup(text) {
  popup.textContent = text;
  popup.classList.remove('hidden');
  setTimeout(() => {
    popup.classList.add('hidden');
  }, 2500);
}

// Workspace drop zone also needs a drop event to allow adding from sidebar
workspaceArea.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});
workspaceArea.addEventListener('drop', e => {
  e.preventDefault();
  if (draggedWorkspaceIndex !== null) {
    // dragging workspace element on blank space: do nothing (for now)
    return;
  }
  if (draggedElementName) {
    workspaceElements.push(draggedElementName);
    renderWorkspace();
  }
});

renderElementsList();
renderWorkspace();
showDescription(null);
