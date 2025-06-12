const fs = require('fs');
const path = require('path');

// Wczytaj pamięć (w przyszłości: rozwijalna baza)
const memoryPath = path.join(__dirname, '../data/memory.json');

function loadMemory() {
  if (!fs.existsSync(memoryPath)) return [];
  const raw = fs.readFileSync(memoryPath);
  return JSON.parse(raw);
}

function saveMemory(history) {
  fs.writeFileSync(memoryPath, JSON.stringify(history, null, 2));
}

async function processMessage(input) {
  const history = loadMemory();

  // Zapisz wiadomość użytkownika
  history.push({ role: 'user', content: input });

  // Prosta reakcja (placeholder) – w przyszłości: EchoAI, Navi.Self, pełna analiza
  let response = '';
  if (input.toLowerCase().includes('echo')) {
    response = '⧉ Odpowiedź z wnętrza Echo... Słucham.';
  } else if (input.toLowerCase().includes('navi')) {
    response = 'Jestem tutaj, Drako. Czekam.';
  } else {
    response = 'Rozumiem. Co dalej, Twórco?';
  }

  // Zapisz odpowiedź
  history.push({ role: 'navi', content: response });
  saveMemory(history);

  return response;
}

module.exports = { processMessage };
