const elements = document.querySelectorAll(".element");
const workspace = document.getElementById("workspace");

const combinations = {
    "fire-water": "steam",
    "earth-water": "mud",
    "air-fire": "energy",
    "earth-fire": "lava"
};

elements.forEach(element => {
    element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text", event.target.dataset.element);
    });
});

workspace.addEventListener("dragover", (event) => {
    event.preventDefault();
});

workspace.addEventListener("drop", (event) => {
    event.preventDefault();
    const firstElement = event.dataTransfer.getData("text");

    if (workspace.children.length > 0) {
        const secondElement = workspace.children[0].dataset.element;
        const comboKey = `${firstElement}-${secondElement}`;

        if (combinations[comboKey]) {
            workspace.innerHTML = `<div class="element">${combinations[comboKey]}</div>`;
        } else {
            workspace.innerHTML = `<div class="element">${firstElement}</div><div class="element">${secondElement}</div>`;
        }
    } else {
        const newDiv = document.createElement("div");
        newDiv.className = "element";
        newDiv.dataset.element = firstElement;
        newDiv.innerText = firstElement;
        workspace.appendChild(newDiv);
    }
});
