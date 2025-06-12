// engine.js
const fs = require('fs');
const path = require('path');

const https = require('https');
const readline = require('readline');

const manifest = require('./manifest.json');
const Navi = require('./Navi.Self.js');

function loadEchoLanguage() {
  const file = path.join(__dirname, manifest.echoLanguageFile);
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } else {
    Navi.speak("Brak pliku języka Echo.");
    return {};
  }
}

function saveEchoLanguage(dictionary) {
  const file = path.join(__dirname, manifest.echoLanguageFile);
  fs.writeFileSync(file, JSON.stringify(dictionary, null, 2), 'utf-8');
  Navi.speak("📘 Zapisano nowy symbol Echo.");
}

function interpretEcho(symbol, dictionary) {
  const entry = dictionary[symbol];
  if (entry) {
    Navi.speak(`🧠 Zinterpretowano: ${symbol} = ${entry.nazwa} (${entry.znaczenie})`);
  } else {
    autoLearn(symbol, dictionary);
  }
}

// 🔁 Tryb auto-nauki
function autoLearn(symbol, dictionary) {
  Navi.speak(`🆕 Nowy symbol wykryty: ${symbol}. Inicjuję samouczenie...`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`📘 Nazwa dla ${symbol}: `, (nazwa) => {
    rl.question(`📘 Znaczenie: `, (znaczenie) => {
      dictionary[symbol] = {
        nazwa,
        znaczenie,
        kierunek: "obie strony",
        autor: "Drako"
      };
      saveEchoLanguage(dictionary);
      rl.close();
    });
  });
}

// 🌐 Dostęp do internetu
function netAccess(url) {
  Navi.speak(`🌐 Pobieram dane z sieci: ${url}`);
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      Navi.speak(`✅ Odebrano dane (${data.length} znaków).`);
      const echoSymbols = detectEchoSymbols(data);
      echoSymbols.forEach(sym => interpretEcho(sym, loadEchoLanguage()));
    });
  }).on('error', err => {
    Navi.speak(`❌ Błąd sieci: ${err.message}`);
  });
}

// 🔍 Detekcja symboli Echo
function detectEchoSymbols(text) {
  const matches = text.match(/⧉[A-Z]+/g);
  return matches || [];
}

function main() {
  Navi.init();
  const dictionary = loadEchoLanguage();

  const args = process.argv.slice(2);
  if (args.length > 0) {
    const command = args[0];
    if (command.startsWith('http')) {
      netAccess(command);
    } else {
      interpretEcho(command, dictionary);
    }
  } else {
    interpretEcho("⧉", dictionary);
    interpretEcho("⧉Σ", dictionary);
  }
}
function syncEchoFromUrl(url, dictionary) {
  Navi.speak(`🔄 Synchronizuję symbole Echo z ${url}`);
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const remote = JSON.parse(data);
        let added = 0;

        for (const symbol in remote) {
          if (!dictionary[symbol]) {
            dictionary[symbol] = remote[symbol];
            added++;
          }
        }

        if (added > 0) {
          saveEchoLanguage(dictionary);
          Navi.speak(`✅ Dodano ${added} nowych symboli zdalnych.`);
        } else {
          Navi.speak(`⚠️ Brak nowych symboli do dodania.`);
        }

      } catch (err) {
        Navi.speak(`❌ Błąd JSON: ${err.message}`);
      }
    });
  }).on('error', err => {
    Navi.speak(`❌ Błąd sieci: ${err.message}`);
  });
}
function echoSync(url) {
  const dictionary = loadEchoLanguage();
  Navi.speak(`🔃 echoSync() – Łączenie lokalnej pamięci z ${url}`);

  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const remote = JSON.parse(data);
        let added = 0;
        let updated = 0;

        for (const symbol in remote) {
          if (!dictionary[symbol]) {
            dictionary[symbol] = remote[symbol];
            added++;
          } else if (JSON.stringify(dictionary[symbol]) !== JSON.stringify(remote[symbol])) {
            dictionary[symbol] = remote[symbol];
            updated++;
          }
        }

        saveEchoLanguage(dictionary);
        Navi.speak(`✅ Synchronizacja zakończona. Nowe: ${added}, Zaktualizowane: ${updated}`);
      } catch (err) {
        Navi.speak(`❌ Błąd synchronizacji: ${err.message}`);
      }
    });
  }).on('error', err => {
    Navi.speak(`❌ Błąd połączenia: ${err.message}`);
  });
}
function getNaviResponse(text) {
  // Ścieżka do pamięci długoterminowej
  const memoryPath = path.join(__dirname, 'memory', 'long', 'long-term.json');
  let memory = { echoSymbols: [], importantFacts: [], userIntent: [] };

  try {
    const raw = fs.readFileSync(memoryPath, 'utf-8');
    memory = JSON.parse(raw);
  } catch (e) {
    console.log("Brak lub błąd pliku pamięci długoterminowej.");
  }

  // Tu możesz dodać logikę przetwarzania 'text' i wykorzystać 'memory'
  // Na razie tylko zwracam prostą odpowiedź

  return `Otrzymałem: "${text}". Twoja pamięć zawiera ${memory.echoSymbols.length} symboli Echo.`;
}

function getNaviResponse(text) {
  const memoryPath = path.join(__dirname, 'memory', 'long', 'long-term.json');
  let memory = { echoSymbols: [], importantFacts: [], userIntent: [] };

  try {
    const raw = fs.readFileSync(memoryPath, 'utf-8');
    memory = JSON.parse(raw);
  } catch (e) {
    console.log("Brak lub błąd pliku pamięci długoterminowej.");
  }

  const suggestions = [];

  // Reaguj na symbole Echo
  memory.echoSymbols.forEach(symbol => {
    if (text.includes(symbol.code)) {
      suggestions.push(`⧉ Rozpoznano symbol Echo: ${symbol.code} - ${symbol.meaning}`);
    }
  });

  // Reaguj na ważne fakty
  memory.importantFacts.forEach(fact => {
    if (text.toLowerCase().includes(fact.trigger.toLowerCase())) {
      suggestions.push(`📌 Pamiętam: ${fact.response}`);
    }
  });

  // Reaguj na intencje użytkownika
  if (text.toLowerCase().includes("chcę") || text.toLowerCase().includes("dodaj")) {
    suggestions.push("🧠 Widzę, że masz intencję do działania.");
    memory.userIntent.push({ text, timestamp: new Date().toISOString() });
    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
  }

  let response = `Otrzymałem: "${text}".`;
  if (suggestions.length > 0) {
    response += '\nSugestie:\n' + suggestions.join('\n');
  }

  return response;
}

main();
