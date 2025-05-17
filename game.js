const initialElements = ['bit', 'logic'];
let discoveredElements = [...initialElements];
let selectedElements = [];

const recipes = {
  'bit+bit': 'byte',
  'byte+logic': 'if statement',
  'if statement+byte': 'loop',
  'loop+byte': 'array',
  'array+logic': 'function',
  'function+byte': 'program',
  'logic+function': 'AI',
  'AI+byte': 'machine learning',
};

function renderElements() {
  const container = document.getElementById('elements');
  container.innerHTML = '';
  discoveredElements.forEach((el) => {
    const elem = document.createElement('div');
    elem.className = 'element';
    elem.textContent = el;
    elem.addEventListener('click', () => selectElement(el));
    container.appendChild(elem);
  });
}

function renderWorkspace() {
  const workspace = document.getElementById('workspace');
  workspace.innerHTML = '';
  selectedElements.forEach((el, i) => {
    const elem = document.createElement('div');
    elem.className = 'element';
    elem.textContent = el;
    elem.addEventListener('click', () => deselectElement(i));
    workspace.appendChild(elem);
  });
}

function selectElement(el) {
  if (selectedElements.length < 2) {
    selectedElements.push(el);
    renderWorkspace();

    if (selectedElements.length === 2) {
      checkCombination();
    }
  }
}

function deselectElement(index) {
  selectedElements.splice(index, 1);
  renderWorkspace();
}

function normalizeKey(a, b) {
  return [a, b].sort().join('+');
}

function checkCombination() {
  const [a, b] = selectedElements;
  const key = normalizeKey(a, b);
  const result = recipes[key];

  if (result && !discoveredElements.includes(result)) {
    alert(`You discovered: ${result}`);
    discoveredElements.push(result);
    renderElements();
  } else if (result) {
    alert(`You already discovered: ${result}`);
  } else {
    alert('Nothing happened...');
  }

  selectedElements = [];
  renderWorkspace();
}

renderElements();
renderWorkspace();
