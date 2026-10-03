const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const PORT = 3000;

const options = {
    key: fs.readFileSync(path.join(__dirname, "cert", "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "localhost.pem"))
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let lastLocation = null;

app.post("/location", (req, res) => {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return res.status(400).json({ message: "Неверные координаты" });
    }

    lastLocation = {
        latitude,
        longitude,
        time: new Date().toISOString()
    };

    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    console.log("\nПолучено местоположение:");
    console.log("Широта:", latitude);
    console.log("Долгота:", longitude);
    console.log("Карта:", mapUrl);

    res.json({ success: true, mapUrl });
});

app.get("/location", (req, res) => {
    if (!lastLocation) {
        return res.json({ message: "Местоположение пока не получено" });
    }

    res.json({
        ...lastLocation,
        mapUrl: `https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}`
    });
});

https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS сервер запущен: https://localhost:${PORT}`);
    console.log(`Местоположение: https://localhost:${PORT}/location`);
});
