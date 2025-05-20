const combinations = {
    "fire+water": "Steam",
    "earth+water": "Mud",
    "fire+earth": "Lava",
    "air+water": "Rain",
    "fire+air": "Smoke",
    "air+earth": "Dust",
    "fire+mud": "Brick"
};

let discoveredElements = JSON.parse(localStorage.getItem("discovered")) || [];

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
    } else {
        let div = document.createElement("div");
        div.className = "element";
        div.textContent = data;
        div.dataset.name = data;
        workspace.appendChild(div);
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

function initializeDragAndDrop() {
    document.querySelectorAll(".element").forEach(el => {
        el.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text", event.target.dataset.name);
        });
    });
}

initializeDragAndDrop();
