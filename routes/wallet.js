const express = require("express");

const router = express.Router();

const db = require("../database/database");
const auth = require("../middleware/auth");

// =====================================
// GET CURRENT USER WALLET
// =====================================

router.get("/", auth, (req, res) => {

    console.log("==================================");
    console.log("CURRENT USER:", req.session.user);

    const userId = req.session.user.id;

    // RAW WALLETS
    db.all(
        "SELECT * FROM wallets WHERE user_id = ?",
        [userId],
        (err, walletRows) => {

            console.log("RAW WALLETS:");
            console.table(walletRows);

        }
    );

    // RAW MARKET
    db.all(
        "SELECT * FROM market",
        (err, marketRows) => {

            console.log("RAW MARKET:");
            console.table(marketRows);

        }
    );

    // MAIN QUERY
    db.all(

        `
        SELECT

            wallets.id,
            wallets.user_id,
            wallets.coin,
            wallets.balance,

            COALESCE(market.price,1) AS price

        FROM wallets

        LEFT JOIN market

        ON wallets.coin = market.coin

        WHERE wallets.user_id = ?

        ORDER BY wallets.coin
        `,

        [userId],

        (err, rows) => {

            if(err){

                console.log(err);

                return res.json({

                    success:false,

                    message:"Database error"

                });

            }

            console.log("JOIN RESULT:");
            console.table(rows);

            let totalPortfolio = 0;

            rows.forEach(asset => {

                totalPortfolio +=
                    Number(asset.balance) *
                    Number(asset.price);

            });

            res.json({

                success:true,

                wallet:rows,

                portfolioValue:totalPortfolio

            });

        }

    );

});

module.exports = router;