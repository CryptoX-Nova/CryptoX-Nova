const sqlite3 = require("sqlite3").verbose();
const path = require("path");


// =====================================
// DATABASE CONNECTION
// =====================================

const dbPath = path.join(__dirname, "..", "cryptox.db");

console.log("DATABASE V2 PATH:", dbPath);


const db = new sqlite3.Database(dbPath, (err)=>{

    if(err){

        console.error("DATABASE ERROR:", err);

    }else{

        console.log("SQLite Database V2 Connected");

    }

});


// =====================================
// SQLITE SETTINGS
// =====================================

db.serialize(()=>{


    db.run(`
        PRAGMA foreign_keys = ON
    `);


    db.run(`
        PRAGMA journal_mode = WAL
    `);


});



// =====================================
// USERS
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    role TEXT DEFAULT 'user',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);



// =====================================
// WALLETS
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS wallets (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    coin TEXT NOT NULL,

    balance REAL DEFAULT 0,

    FOREIGN KEY(user_id)
    REFERENCES users(id)

)

`);


// wallet protection

db.run(`

CREATE UNIQUE INDEX IF NOT EXISTS wallet_user_coin_unique

ON wallets(user_id, coin)

`);



// =====================================
// TRANSACTIONS
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS transactions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    type TEXT NOT NULL,

    coin TEXT NOT NULL,

    amount REAL NOT NULL,

    price REAL DEFAULT 0,

    total REAL DEFAULT 0,

    status TEXT DEFAULT 'completed',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
    REFERENCES users(id)

)

`);



// =====================================
// DEPOSITS
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS deposits (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    coin TEXT,

    amount REAL,

    status TEXT DEFAULT 'pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    approved_at DATETIME,

    FOREIGN KEY(user_id)
    REFERENCES users(id)

)

`);



// =====================================
// WITHDRAWALS
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS withdrawals (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    coin TEXT,

    amount REAL,

    network TEXT,

    address TEXT,

    status TEXT DEFAULT 'pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    approved_at DATETIME,

    FOREIGN KEY(user_id)
    REFERENCES users(id)

)

`);



// =====================================
// TRADES
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS trades (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    coin TEXT,

    type TEXT,

    amount REAL,

    price REAL,

    total REAL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
    REFERENCES users(id)

)

`);



// =====================================
// MARKET
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS market (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    coin TEXT UNIQUE,

    symbol TEXT,

    price REAL

)

`);



// default market

db.run(`

INSERT OR IGNORE INTO market

(coin,symbol,price)

VALUES

('BTC','BTCUSDT',65000),

('ETH','ETHUSDT',3500),

('SOL','SOLUSDT',150)

`);



// =====================================
// USER SESSIONS
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS user_sessions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    session_id TEXT UNIQUE,

    user_id INTEGER,

    username TEXT,

    role TEXT,

    expires DATETIME,

    FOREIGN KEY(user_id)
    REFERENCES users(id)

)

`);



// =====================================
// ADMIN LOGS
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS admin_logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    admin_id INTEGER,

    action TEXT,

    target_user INTEGER,

    description TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);



// =====================================
// DATABASE CHECK
// =====================================

db.all(

    "SELECT name FROM sqlite_master WHERE type='table'",

    (err, rows)=>{

        if(err){

            console.log(err);

        }else{

            console.log("DATABASE V2 TABLES:", rows);

        }

    }

);



console.log("Database V2 Ready");



module.exports = db;