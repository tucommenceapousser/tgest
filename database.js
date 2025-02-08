const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("data.db");

// Création des tables
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS channels (id TEXT PRIMARY KEY, title TEXT, username TEXT, members INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, channel_id TEXT, message TEXT, sender TEXT, date TEXT)");
});

module.exports = db;
