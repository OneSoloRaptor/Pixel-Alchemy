const combinations = {
    "fire-water": "steam",
    "earth-water": "mud",
    "air-fire": "energy",
    "earth-fire": "lava"
};

const descriptions = {
    "fire": "Fire is a combustion reaction that produces heat and light.",
    "water": "Water is essential for life and exists in liquid, solid, and gas forms.",
    "earth": "Earth is the foundation of landscapes and contains minerals.",
    "air": "Air is an invisible gaseous substance that sustains life."
};

let discovered = ["fire", "water", "earth", "air"];

document.getElementById("items-tab").addEventListener("click", () => toggleTab("items-list"));
document.getElementById("explanations-tab").addEventListener("click", () => toggleTab("explanations-list"));

function toggleTab(tabId) {
    document.querySelectorAll(".content").forEach(tab => tab.classList.add("hidden"));
    document.getElementById(tabId).classList.remove("hidden");
    updateSidebar();
}

function updateSidebar() {
    const itemsList = document.getElementById("items-list");
    const explanationsList = document.getElementById("explanations-list");

    itemsList.innerHTML = "";
    explanationsList.innerHTML = "";

    discovered.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "element";
        itemDiv.draggable = true;
        itemDiv.dataset.element = item;
        itemDiv.innerText = item;
        itemDiv.addEventListener("dragstart", drag);
        itemsList.appendChild(itemDiv);

        const explanationDiv = document.createElement("div");
        explanationDiv.className = "element";
        explanationDiv.innerText = item;
        explanationDiv.addEventListener("click", () => showExplanation(item));
        explanationsList.appendChild(explanationDiv);
    });
}

function showExplanation(item) {
    document.getElementById("popup-text").innerText = descriptions[item] || "No description available.";
    document.getElementById("popup").classList.remove("hidden");
}

document.getElementById("popup-close").addEventListener("click", () => {
    document.getElementById("popup").classList.add("hidden");
});

function drag(event) {
    event.dataTransfer.setData("text", event.target.dataset.element);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const firstElement = event.dataTransfer.getData("text");

    if (event.target.id === "workspace") {
        const workspaceItems = Array.from(event.target.children).map(el => el.dataset.element);
        workspaceItems.push(firstElement);
        
        if (workspaceItems.length === 2) {
            const comboKey = `${workspaceItems[0]}-${workspaceItems[1]}`;
            const reverseKey = `${workspaceItems[1]}-${workspaceItems[0]}`;

            if (combinations[comboKey] || combinations[reverseKey]) {
                const newElement = combinations[comboKey] || combinations[reverseKey];
                discovered.push(newElement);
                updateSidebar();
                event.target.innerHTML = `<div class="element" data-element="${newElement}">${newElement}</div>`;
            }
        } else {
            const newDiv = document.createElement("div");
            newDiv.className = "element";
            newDiv.dataset.element = firstElement;
            newDiv.innerText = firstElement;
            newDiv.addEventListener("dragstart", drag);
            event.target.appendChild(newDiv);
        }
    }
}

function trashDrop(event) {
    event.preventDefault();
    const itemToRemove = event.dataTransfer.getData("text");
    discovered = discovered.filter(item => item !== itemToRemove);
    updateSidebar();
}
