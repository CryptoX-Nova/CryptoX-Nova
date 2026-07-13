const express = require("express");

const router = express.Router();

const db = require("../database/database");
const auth = require("../middleware/auth");


// =====================================
// GET CURRENT USER WALLET
// =====================================

router.get("/", auth, (req, res) => {


    console.log("CURRENT USER:", req.session.user);



    const userId = req.session.user.id;



    db.all(

        `
        SELECT

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



            console.log("WALLET API:", rows);



            // ==============================
            // CALCULATE TOTAL PORTFOLIO VALUE
            // ==============================


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