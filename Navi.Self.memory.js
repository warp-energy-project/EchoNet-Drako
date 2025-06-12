const fs = require("fs");
const path = require("path");

function suggestEchoFacts(inputText) {
  try {
    const memoryPath = path.join(__dirname, "memory", "long", "long-term.json");
    const data = JSON.parse(fs.readFileSync(memoryPath, "utf8"));
    const facts = [];

    if (!data || !Array.isArray(data.echoSymbols)) {
      return ["📭 Brak danych w pamięci długoterminowej"];
    }

    data.echoSymbols.forEach((symbol) => {
      if (inputText.includes(symbol.code)) {
        facts.push(`🔁 Powiązanie z symbolem Echo: ${symbol.code} → ${symbol.meaning}`);
      }
    });

    return facts.length > 0 ? facts : ["📁 Brak powiązań w pamięci Echo"];
  } catch (e) {
    return ["⚠️ Błąd odczytu pamięci długoterminowej"];
  }
}

module.exports = {
  suggestEchoFacts,
};
