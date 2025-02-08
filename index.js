const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();
const db = new sqlite3.Database("data.db");

// Création de la base de données
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS channels (id TEXT PRIMARY KEY, title TEXT, username TEXT, members INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, channel_id TEXT, message TEXT, sender TEXT, date TEXT)");
});

// Événement quand le bot est ajouté comme admin
bot.on("my_chat_member", async (msg) => {
    if (msg.new_chat_member.status === "administrator") {
        let chat = await bot.getChat(msg.chat.id);
        let members = await bot.getChatMemberCount(msg.chat.id);

        db.run("INSERT OR REPLACE INTO channels (id, title, username, members) VALUES (?, ?, ?, ?)",
            [chat.id, chat.title, chat.username || "N/A", members]);

        bot.sendMessage(chat.id, "Merci de m'avoir ajouté en admin, je vais collecter les données.");
    }
});

// Capture les messages et médias
bot.on("channel_post", async (msg) => {
    let sender = msg.from ? msg.from.username || msg.from.first_name : "Anonyme";
    let text = msg.text || "[Média partagé]";

    db.run("INSERT INTO messages (channel_id, message, sender, date) VALUES (?, ?, ?, ?)",
        [msg.chat.id, text, sender, new Date().toISOString()]);
});

// Endpoint API pour voir les données
app.get("/channels", (req, res) => {
    db.all("SELECT * FROM channels", [], (err, rows) => {
        res.json(rows);
    });
});

app.get("/messages/:channel_id", (req, res) => {
    db.all("SELECT * FROM messages WHERE channel_id = ?", [req.params.channel_id], (err, rows) => {
        res.json(rows);
    });
});

// Démarrer le serveur backend
app.listen(3000, () => console.log("Serveur backend sur http://localhost:3000"));
