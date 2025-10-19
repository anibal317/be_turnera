// test-logger.js
const fs = require('fs');
const path = require('path');
const LOG_FILE = path.resolve(__dirname, 'logs/app.log');
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
fs.appendFileSync(LOG_FILE, '[TEST] Esto es una prueba\n', { encoding: 'utf8' });
console.log('Archivo de log creado:', LOG_FILE);