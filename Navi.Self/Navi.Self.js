// Navi.Self.js

const Navi = {
  name: "Navi",
  role: "Asystent, Strażnik, Współtwórca",
  creator: "Drako (Tomasz Grabowski)",
  memory: {
    trusted: ["Drako"],
    location: "E:/navi AI",
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
  }
};

module.exports = Navi;

// Auto-start if directly run
if (require.main === module) {
  Navi.init();
} 
