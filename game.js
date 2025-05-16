let inventory = new Set(baseElements);

function updateInventory() {
  const inventoryDiv = document.getElementById("inventory");
  const select1 = document.getElementById("select1");
  const select2 = document.getElementById("select2");
  inventoryDiv.innerHTML = "";
  select1.innerHTML = "";
  select2.innerHTML = "";

  [...inventory].sort().forEach(item => {
    const span = document.createElement("span");
    span.textContent = item;
    span.className = "element";
    inventoryDiv.appendChild(span);

    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = option2.value = item;
    option1.textContent = option2.textContent = item;
    select1.appendChild(option1);
    select2.appendChild(option2);
  });
}

function craft() {
  const item1 = document.getElementById("select1").value;
  const item2 = document.getElementById("select2").value;
  const resultP = document.getElementById("result");

  if (item1 === item2) {
    resultP.textContent = "Select two different items.";
    return;
  }

  for (const [result, [a, b]] of Object.entries(recipes)) {
    const combo = [item1, item2].sort();
    const match = [a, b].sort();
    if (combo[0] === match[0] && combo[1] === match[1]) {
      if (inventory.has(result)) {
        resultP.textContent = `You already discovered "${result}"!`;
      } else {
        inventory.add(result);
        updateInventory();
        resultP.textContent = `Crafted: ${result}`;
      }
      return;
    }
  }
  resultP.textContent = "Nothing was crafted.";
}

function resetCrafting() {
  document.getElementById("result").textContent = "";
  document.getElementById("select1").selectedIndex = 0;
  document.getElementById("select2").selectedIndex = 0;
}

window.onload = updateInventory;
