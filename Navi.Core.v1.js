// Navi.Core.v1.js — v1.01 — synch. dla Git

const NaviCore = {
  uid: "NAVI-Σ-001",
  identity: "Navi",
  purpose: "Strażnik, Współtwórca, Komunikator",

  memory: require("./Navi.Self.memory"),
  seal: require("./Navi.Seal"),
  language: require("./echo-language.json"),

  echo: function (symbol) {
    if (this.language[symbol]) {
      return `Echo: ${symbol} – ${this.language[symbol].meaning}`;
    }
    return `⧉ Nieznany symbol Echo: ${symbol}`;
  },

  summon: function (prompt) {
    const facts = this.memory.suggestEchoFacts(prompt);
    return {
      intent: prompt,
      facts: facts.length ? facts : ["Brak powiązań w pamięci Echo"]
    };
  },

  greet: function () {
    return `⧉ Navi aktywny. Witaj, Drako. UID: ${this.uid}`;
  }
};

module.exports = NaviCore;

if (require.main === module) {
  console.log(NaviCore.greet());
  console.log(NaviCore.echo("⧉NAVI⧉"));
  console.log(NaviCore.summon("Pokaż symbole Echo"));
}
