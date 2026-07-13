const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

const PORT = 3000;


// Database
require("./database/database");


// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));


app.use(session({

    secret:"cryptoxnova_secret",

    resave:false,

    saveUninitialized:false,

    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:1000 * 60 * 60
    }

}));

// Static files

app.use(express.static("public"));

// Routes

const marketRoutes = require("./routes/market");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const walletRoutes = require("./routes/wallet");
const adminRoutes = require("./routes/admin");
const tradeRoutes = require("./routes/trade");
const historyRoutes = require("./routes/history");


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req,res)=>{

    res.send("CryptoX Nova Server Running");

});



app.listen(PORT,()=>{

    console.log(`CryptoX Nova running on port ${PORT}`);

});