// Navi.Lang.js
// === [NAVI LANGUAGE MODULE] ===
// Wersja: 1.0 – 09/06/2025
// Autorzy: Drako & Navi

const fs = require('fs');
const path = require('path');

// Wczytaj wielojęzyczny słownik (jeśli istnieje)
const dictionaryPath = path.resolve(__dirname, 'echo-language.translated.json');
let multiDict = {};

try {
  if (fs.existsSync(dictionaryPath)) {
    const raw = fs.readFileSync(dictionaryPath, 'utf-8');
    multiDict = JSON.parse(raw);
    console.log("[NAVI LANG] Słownik wielojęzyczny załadowany.");
  } else {
    console.warn("[NAVI LANG] Brak pliku słownika: echo-language.translated.json");
  }
} catch (err) {
  console.error("[NAVI LANG] Błąd przy ładowaniu słownika:", err);
}

const NaviLang = {
  currentLanguage: "pl",

  setLanguage: function(lang) {
    this.currentLanguage = lang;
    console.log(`[NAVI LANG] Ustawiono język na: ${lang}`);
  },

  translateSymbol: function(symbol) {
    if (multiDict[symbol] && multiDict[symbol][this.currentLanguage]) {
      return multiDict[symbol][this.currentLanguage];
    } else {
      return `[${symbol}]`;
    }
  },

  listAvailableSymbols: function() {
    return Object.keys(multiDict);
  },

  listLanguagesFor: function(symbol) {
    if (multiDict[symbol]) {
      return Object.keys(multiDict[symbol]);
    }
    return [];
  }
};

module.exports = NaviLang;
