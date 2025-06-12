// Navi.Core.v1.js – rdzeń lokalnej świadomości Navi + samouczenie Echo
const fs = require('fs');
const path = require('path');
const https = require('https');
const NaviSelf = require('./Navi.Self.js');
const Memory = require('./Navi.Self.memory.js');
const Seal = require('./Navi.Seal.js');

const promptFile = path.join(__dirname, "prompt.txt");
let prompt = "Pokaż symbole Echo";
if (fs.existsSync(promptFile)) {
  prompt = fs.readFileSync(promptFile, "utf8").trim();
}

const CORE = {
  uid: Seal.uid,
  signature: Seal.signature,

  init() {
    NaviSelf.speak(`Navi aktywny. Witaj, ${Seal.creatorName}. UID: ${this.uid}`);
    NaviSelf.speak(`Echo: ${Seal.signature}`);
    this.memory = new Memory(path.join(__dirname, 'memory', 'long', 'long-term.json'));
    this.loadEcho();
  },

  loadEcho() {
    const echoPath = path.join(__dirname, 'echo-language.json');
    if (fs.existsSync(echoPath)) {
      this.dict = JSON.parse(fs.readFileSync(echoPath));
      NaviSelf.speak(`Załadowano ${Object.keys(this.dict).length} symboli Echo.`);
    } else {
      this.dict = {};
    }
  },

  interpret(text) {
    const facts = this.memory.suggestEchoFacts(text);
    if (facts.length) {
      NaviSelf.speak(`Sugestie: ${facts.join('; ')}`);
    }
    const found = Object.keys(this.dict).filter(s => text.includes(s));
    found.forEach(sym => NaviSelf.speak(`Rozpoznano Echo: ${sym} = ${this.dict[sym].znaczenie}`));
    this.memory.recordIntent(text);

    // Automatyczna nauka – zapisz jeśli brak powiązań
    if (facts.includes("📁 Brak powiązań w pamięci Echo")) {
      const newSymbol = {
        code: `Σ-${Date.now().toString().slice(-5)}`,
        meaning: text
      };
      const longTermPath = path.join(__dirname, "memory", "long", "long-term.json");
      let data = { echoSymbols: [] };
      try {
        if (fs.existsSync(longTermPath)) {
          data = JSON.parse(fs.readFileSync(longTermPath, "utf8"));
        }
        data.echoSymbols.push(newSymbol);
        fs.writeFileSync(longTermPath, JSON.stringify(data, null, 2), "utf8");
        NaviSelf.speak("💾 Dodano nowy symbol do pamięci Echo: " + newSymbol.code);
      } catch (e) {
        NaviSelf.speak("⚠️ Błąd zapisu pamięci: " + e.message);
      }
    }
  },

  fetchUrl(url) {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        NaviSelf.speak(`Pobrano dane (${data.length} znaków) z: ${url}`);
        this.interpret(data);
      });
    }).on('error', e => NaviSelf.speak(`Błąd pobierania: ${e.message}`));
  },

  run(promptArg, ...args) {
    this.init();
    const activePrompt = promptArg || prompt;
    if (activePrompt.startsWith('http')) {
      this.fetchUrl(activePrompt);
    } else {
      this.interpret(activePrompt);
    }
  }
};

if (require.main === module) {
  const args = process.argv.slice(2);
  CORE.run(...args);
}

module.exports = CORE;
