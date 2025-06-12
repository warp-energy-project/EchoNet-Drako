let data = {};

async function loadLanguage() {
  try {
    const response = await fetch("../../language/navi.language.pl.json");
    data = await response.json();
    renderEntries();
  } catch (err) {
    console.error("Błąd ładowania JSON:", err);
  }
}

function renderEntries() {
  const container = document.getElementById("entries");
  container.innerHTML = "";

  Object.keys(data).forEach(key => {
    const entry = data[key];
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${key}</strong><br>
      Synonimy: ${entry.synonimy.join(", ")}<br>
      Znaczenie: ${entry.znaczenie}<br>
      Reakcja: <em>${entry.reakcja}</em>
    `;
    container.appendChild(div);
  });
}

function addEntry() {
  const key = document.getElementById("key").value.trim();
  const synonyms = document.getElementById("synonyms").value.split(",").map(s => s.trim());
  const meaning = document.getElementById("meaning").value.trim();
  const reaction = document.getElementById("reaction").value.trim();

  if (key && synonyms.length && meaning && reaction) {
    data[key] = {
      synonimy: synonyms,
      znaczenie: meaning,
      reakcja: reaction
    };
    saveToFile();
    renderEntries();
  } else {
    alert("Wypełnij wszystkie pola!");
  }
}

function saveToFile() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "navi.language.pl.json";
  a.click();
}

window.onload = loadLanguage;
