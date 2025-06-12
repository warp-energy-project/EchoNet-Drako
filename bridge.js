const input = document.getElementById("userInput");
const messagesDiv = document.getElementById("messages");

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = "message " + sender.toLowerCase();
  msg.textContent = `${sender}: ${text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getNaviResponse(text) {
  try {
    const dict = JSON.parse(localStorage.getItem("echo-language")) || {};
    for (let symbol in dict) {
      if (text.includes(symbol)) return dict[symbol].meaning;
    }
  } catch (e) {}
  return "Nie rozumiem jeszcze tego, Drako.";
}

function sendToNavi(text) {
  addMessage("Drako", text);
  const reply = getNaviResponse(text);
  setTimeout(() => {
    addMessage("Navi", reply);
  }, 300);
}

window.addEventListener("messageSent", (e) => {
  sendToNavi(e.detail);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
const fs = require('fs');
const path = require('path');

function loadLongTermMemory() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'memory', 'long', 'long-term.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Błąd ładowania pamięci długoterminowej:', err);
    return { echoSymbols: [], importantFacts: [], userIntent: [] };
  }
}

function suggestEchoFacts(inputText) {
  const memory = loadLongTermMemory();
  const suggestions = [];

  memory.echoSymbols.forEach(symbol => {
    if (inputText.includes(symbol.code)) {
      suggestions.push(`⚠️ Powiązanie z symbolem Echo: ${symbol.code} – ${symbol.meaning}`);
    }
  });

  memory.importantFacts.forEach(fact => {
    if (inputText.toLowerCase().includes(fact.trigger.toLowerCase())) {
      suggestions.push(`ℹ️ Pamiętam: ${fact.response}`);
    }
  });

  return suggestions;
}

module.exports = { loadLongTermMemory, suggestEchoFacts };
