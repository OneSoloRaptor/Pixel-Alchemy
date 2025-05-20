const combinations = {
    "fire+water": "Steam",
    "earth+water": "Mud",
    "fire+earth": "Lava",
    "air+water": "Rain",
    "fire+air": "Smoke",
    "air+earth": "Dust",
    "fire+mud": "Brick",
    "water+air": "Mist",
    "mud+fire": "Clay",
    "earth+rain": "Plant",
    "fire+steam": "Engine",
    "mud+brick": "House",
    "air+fire": "Explosion"
};

let discoveredElements = JSON.parse(localStorage.getItem("discovered")) || [];
let selectedElements = [];

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const workspace = document.getElementById("workspace");
    
    let existingElements = Array.from(workspace.querySelectorAll(".element")).map(el => el.dataset.name);
    existingElements.push(data);

    let newElement = checkCombination(existingElements);
    if (newElement) {
        addNewElement(newElement);
        showPopup(`Created: ${newElement}`);
    }
}

function selectElement(name) {
    if (selectedElements.includes(name)) {
        selectedElements = selectedElements.filter(e => e !== name);
    } else {
        selectedElements.push(name);
    }
    updateSelectionUI();
}

function updateSelectionUI() {
    document.querySelectorAll(".element").forEach(el => {
        el.classList.remove("selected");
        if (selectedElements.includes(el.dataset.name)) {
            el.classList.add("selected");
        }
    });
}

function combineSelected() {
    if (selectedElements.length === 2) {
        let newElement = checkCombination(selectedElements);
        if (newElement) {
            addNewElement(newElement);
            showPopup(`Created: ${newElement}`);
        }
        selectedElements = [];
        updateSelectionUI();
    }
}

function addNewElement(name) {
    if (!discoveredElements.includes(name)) {
        discoveredElements.push(name);
        localStorage.setItem("discovered", JSON.stringify(discoveredElements));

        const div = document.createElement("div");
        div.className = "element";
        div.textContent = name;
        div.dataset.name = name;
        div.onclick = () => selectElement(name);
        document.getElementById("discovered").appendChild(div);
    }
}

function checkCombination(elements) {
    let key = elements.sort().join("+");
    return combinations[key] || null;
}

function resetGame() {
    localStorage.clear();
    discoveredElements = [];
    document.getElementById("discovered").innerHTML = "";
}

function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}

function initializeDragAndDrop() {
    document.querySelectorAll(".element").forEach(el => {
        el.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text", event.target.dataset.name);
        });

        el.addEventListener("dragend", event => {
            event.target.style.opacity = "1";
        });

        el.addEventListener("dragover", event => {
            event.preventDefault();
            event.target.style.opacity = "0.6";
        });
    });
}

initializeDragAndDrop();
