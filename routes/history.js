// =====================================
// CryptoX Pro V5 - Trade History Route
// routes/history.js
// =====================================

const express = require("express");

const router = express.Router();

const db = require("../database/database");


// =====================================
// GET USER TRADE HISTORY
// =====================================

router.get("/", (req, res) => {


    // Check login

    if (!req.session.user) {

        return res.status(401).json({

            success: false,
            message: "Login required"

        });

    }



    const userId = req.session.user.id;



    db.all(

        `
        SELECT

            id,
            type,
            coin,
            price,
            amount,
            total,
            created_at

        FROM trades

        WHERE user_id = ?

        ORDER BY id DESC

        `,

        [userId],


        (err, rows) => {


            if (err) {


                console.log(
                    "HISTORY DATABASE ERROR:",
                    err.message
                );


                return res.json({

                    success:false,

                    message:"Database error",

                    error:err.message

                });


            }



            res.json({

                success:true,

                count:rows.length,

                history:rows

            });


        }


    );


});



module.exports = router;