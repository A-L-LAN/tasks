// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./taskmanager.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the taskmanager database.');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT
    )
  `);
});

module.exports = db;