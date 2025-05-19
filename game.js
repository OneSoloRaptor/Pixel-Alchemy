const combinations = {
    "fire+water": "Steam",
    "earth+water": "Mud",
    "fire+earth": "Lava",
    "air+water": "Rain",
    "fire+air": "Smoke"
};

let discoveredElements = JSON.parse(localStorage.getItem("discovered")) || [];

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const workspace = document.getElementById("workspace");
    const elements = workspace.querySelectorAll(".element");

    let existing = Array.from(elements).map(el => el.dataset.name);
    existing.push(data);

    let newElement = checkCombination(existing);
    if (newElement) {
        addNewElement(newElement);
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

document.querySelectorAll(".element").forEach(el => {
    el.addEventListener("dragstart", event => {
        event.dataTransfer.setData("text", event.target.dataset.name);
    });
});

function resetGame() {
    localStorage.clear();
    discoveredElements = [];
    document.getElementById("discovered").innerHTML = "";
}
