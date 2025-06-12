const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');

const engine = require('./Navi/engine.js');

contextBridge.exposeInMainWorld('navi', {
  async sendMessage(input) {
    const response = await engine.processMessage(input);
    return response;
  }
});
