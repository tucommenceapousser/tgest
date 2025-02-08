const express = require("express");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint pour voir les canaux collectés
app.get("/channels", (req, res) => {
    db.all("SELECT * FROM channels", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Endpoint pour voir les messages d’un canal
app.get("/messages/:channel_id", (req, res) => {
    db.all("SELECT * FROM messages WHERE channel_id = ?", [req.params.channel_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Démarrer le serveur
app.listen(PORT, () => console.log(`Serveur backend sur http://localhost:${PORT}`));
