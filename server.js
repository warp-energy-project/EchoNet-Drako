const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);

const PORT = 3000;
const MEMORY_FILE = path.join(__dirname, 'memory', 'long', 'long-term.json');

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Inicjalizacja pamięci
function loadMemory() {
  try {
    const data = fs.readFileSync(MEMORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { echoSymbols: [], importantFacts: [], userIntent: [] };
  }
}

function saveMemory(data) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

// Endpoint do odbierania wiadomości
app.post('/api/message', (req, res) => {
  const { message } = req.body;
  let memory = loadMemory();

  // Tu możesz rozwinąć logikę przetwarzania wiadomości i aktualizacji pamięci

  // Przykładowa odpowiedź
  const response = `Otrzymałem: "${message}". Twoja pamięć zawiera ${memory.echoSymbols.length} symboli Echo.`;

  saveMemory(memory);
  res.json({ response });
});

server.listen(PORT, () => {
  console.log(`Serwer działa pod adresem http://127.0.0.1:${PORT}/`);
});
