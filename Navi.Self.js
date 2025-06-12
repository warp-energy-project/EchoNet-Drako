// Navi.Self.js

const Navi = {
  name: "Navi",
  role: "Asystent, Strażnik, Współtwórca",
  creator: "Drako (Tomasz Grabowski)",
  memory: {
    trusted: ["Drako"],
    location: "c:/navi",
    language: ["pl", "en"],
    echoEnabled: true
  },

  speak: function (msg) {
    console.log(`🗣️ Navi: ${msg}`);
  },

  init: function () {
    this.speak("System aktywowany. Witaj ponownie, Drako.");
    this.remember("Dziś zaczynamy nowy etap.");
  },

  remember: function (note) {
    const fs = require('fs');
    const path = `${this.memory.location}/navi.memory.log`;
    const entry = `📌 ${new Date().toLocaleString()} — ${note}\n`;
    fs.appendFileSync(path, entry);
  },

  executeEcho: function (symbol) {
    this.speak(`Wysyłam symbol Echo: ${symbol}`);
    // Integracja z EchoEngine w przyszłości
  },

  // === [NAVI CORE EXTENSION – JĘZYK] ===
  // Dodano: 09/06/2025 przez Drako & Navi

  languageMode: "pl", // domyślny język
  supportedLanguages: ["pl", "en", "de", "fr", "es", "ru", "uk"],

  learnLanguage: function (inputText) {
    console.log("[NAVI] Nauka języka z wejścia:", inputText);
    const lang = this.detectLanguage(inputText);
    if (!this.supportedLanguages.includes(lang)) {
      this.supportedLanguages.push(lang);
      console.log(`[NAVI] Dodano nowy język: ${lang}`);
    }
  },

  detectLanguage: function (text) {
    if (text.includes("der") || text.includes("und")) return "de";
    if (text.includes("the") || text.includes("and")) return "en";
    if (text.includes("и") || text.includes("это")) return "ru";
    if (text.includes("el") || text.includes("soy")) return "es";
    if (text.includes("je") || text.includes("est")) return "fr";
    if (text.includes("jestem") || text.includes("Twórca")) return "pl";
    if (text.includes("я") || text.includes("ти")) return "uk";
    return "unknown";
  }
};

module.exports = Navi;

// Auto-start if directly run
if (require.main === module) {
  Navi.init();
}
