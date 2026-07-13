const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    res.json({

        success: true,

        market: [

            {
                coin: "BTC",
                symbol: "BTCUSDT",
                price: 65000
            },

            {
                coin: "ETH",
                symbol: "ETHUSDT",
                price: 3500
            },

            {
                coin: "SOL",
                symbol: "SOLUSDT",
                price: 150
            }

        ]

    });

});

module.exports = router;