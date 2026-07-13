const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./cryptox.db", (err) => {

    if (err) {

        console.log(err);

    } else {

        console.log("SQLite Database Connected");

    }

});

// =====================================
// USERS
// =====================================

db.run(`
CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE,

    email TEXT UNIQUE,

    password TEXT,

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

    user_id INTEGER,

    coin TEXT,

    balance REAL DEFAULT 0,

    UNIQUE(user_id, coin)

)
`);

// =====================================
// MARKET
// =====================================

db.run(`
CREATE TABLE IF NOT EXISTS market (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    coin TEXT,

    symbol TEXT,

    price REAL

)
`);

// =====================================
// TRANSACTIONS
// =====================================

db.run(`
CREATE TABLE IF NOT EXISTS transactions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    type TEXT,

    coin TEXT,

    price REAL,

    amount REAL,

    total REAL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);

db.all(
    "PRAGMA table_info(transactions)",
    (err, columns)=>{

        const exists = columns.some(
            col => col.name === "total"
        );


        if(!exists){

            db.run(`
                ALTER TABLE transactions
                ADD COLUMN total REAL DEFAULT 0
            `);

            console.log("Added total column to transactions");

        }

    }
);

// =====================================
// DEPOSITS
// =====================================

db.run(`
CREATE TABLE IF NOT EXISTS deposits (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    coin TEXT,

    amount REAL,

    status TEXT DEFAULT 'completed',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

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

    status TEXT DEFAULT 'pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);
db.run(`

CREATE TABLE IF NOT EXISTS trades (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    coin TEXT,

    type TEXT,

    amount REAL,

    price REAL,

    total REAL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);

// =====================================
// DEFAULT MARKET DATA
// =====================================

db.get("SELECT COUNT(*) AS total FROM market", (err, row) => {

    if (row.total === 0) {

        db.run(`
        INSERT INTO market
        (coin,symbol,price)

        VALUES

        ('BTC','BTCUSDT',65000),
        ('ETH','ETHUSDT',3500),
        ('SOL','SOLUSDT',150)

        `);

    }

});

console.log("Database Tables Ready");

module.exports = db;