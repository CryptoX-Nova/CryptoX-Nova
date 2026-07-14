const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");


const app = express();

const PORT = process.env.PORT || 3000;


// ===============================
// DATABASE
// ===============================

const db = require("./database/database");

const sessionDB = new sqlite3.Database(
    "./database/sessions.db"
);

// ===============================
// MIDDLEWARE
// ===============================

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended:true
    })
);


// ===============================
// SESSION
// ===============================

app.use(session({

    store: new SQLiteStore({

        db: sessionDB

    }),

    secret:"cryptoxnova_secret",

    resave:false,

    saveUninitialized:false,

    rolling:true,

    cookie:{

        secure:false,

        httpOnly:true,

        sameSite:"lax",

        maxAge:1000 * 60 * 60 * 24

    }

}));

// ===============================
// SESSION DEBUG
// ===============================

app.use((req,res,next)=>{


    console.log("--------------------------------");

    console.log("METHOD:",req.method);

    console.log("URL:",req.originalUrl);

    console.log("SESSION ID:",req.sessionID);

    console.log(
        "USER:",
        req.session.user || "NO USER"
    );

    console.log("--------------------------------");


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



app.use("/api/auth",authRoutes);

app.use("/api/user",userRoutes);

app.use("/api/wallet",walletRoutes);

app.use("/api/market",marketRoutes);

app.use("/api/admin",adminRoutes);

app.use("/api/trade",tradeRoutes);

app.use("/api/history",historyRoutes);

app.use("/api/deposit",depositRoutes);

app.use("/api/withdraw",withdrawRoutes);

app.use("/api/exchange",exchangeRoutes);



// ===============================
// HOME
// ===============================

app.get("/",(req,res)=>{


    res.send(
        "CryptoX Nova Server Running"
    );


});



// ===============================
// START SERVER
// ===============================

app.listen(PORT,()=>{


    console.log("");

    console.log("================================");

    console.log(
        "🚀 CryptoX Nova Server Running"
    );

    console.log(
        `http://localhost:${PORT}`
    );

    console.log("================================");


});