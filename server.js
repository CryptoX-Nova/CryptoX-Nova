const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// DATABASE
// ===============================
require("./database/database");

// ===============================
// MIDDLEWARE
// ===============================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===============================
// SESSION
// ===============================
app.use(session({
    secret: "cryptoxnova_secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));

// ===============================
// SESSION DEBUG
// ===============================
app.use((req, res, next) => {

    console.log("====================================");
    console.log("URL:", req.method, req.originalUrl);
    console.log("SESSION ID:", req.sessionID);
    console.log("SESSION:", req.session);
    console.log("SESSION USER:", req.session.user);
    console.log("COOKIE:", req.headers.cookie);
    console.log("====================================");

    next();

});

// ===============================
// STATIC FILES
// ===============================
app.use(express.static("public"));

// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const walletRoutes = require("./routes/wallet");
const marketRoutes = require("./routes/market");
const adminRoutes = require("./routes/admin");
const tradeRoutes = require("./routes/trade");
const historyRoutes = require("./routes/history");
const depositRoutes = require("./routes/deposit");
const withdrawRoutes = require("./routes/withdraw");
const exchangeRoutes = require("./routes/exchange");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/exchange", exchangeRoutes);

// ===============================
// HOME
// ===============================
app.get("/", (req, res) => {
    res.send("CryptoX Nova Server Running");
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
    console.log(`🚀 CryptoX Nova running on http://localhost:${PORT}`);
});