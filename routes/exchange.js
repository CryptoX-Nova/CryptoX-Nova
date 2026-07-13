const express = require("express");
const router = express.Router();

const db = require("../database/database");


// =====================================
// EXCHANGE COIN
// =====================================

router.post("/", (req,res)=>{


    const user_id = req.session.user.id;


    const {
        fromCoin,
        toCoin,
        amount,
        receiveAmount
    } = req.body;



    // CHECK BALANCE

    db.get(

    `
    SELECT balance
    FROM wallets
    WHERE user_id=?
    AND coin=?
    `,

    [
        user_id,
        fromCoin
    ],

    (err,wallet)=>{


        if(err){

            console.log(err);

            return res.json({

                success:false,

                message:"Database error"

            });

        }



        if(!wallet || wallet.balance < amount){


            return res.json({

                success:false,

                message:"Insufficient balance"

            });


        }





        // REMOVE PAY COIN

        db.run(

        `
        UPDATE wallets

        SET balance = balance - ?

        WHERE user_id=?
        AND coin=?

        `,

        [
            amount,
            user_id,
            fromCoin
        ],

        function(err){


            if(err){

                console.log(err);

                return res.json({

                    success:false,

                    message:"Failed to remove balance"

                });

            }



        });








        // ADD RECEIVE COIN

        db.run(

        `
        INSERT INTO wallets

        (
            user_id,
            coin,
            balance
        )

        VALUES(?,?,?)

        ON CONFLICT(user_id,coin)

        DO UPDATE SET

        balance = balance + excluded.balance

        `,

        [

            user_id,

            toCoin,

            receiveAmount

        ],

        function(err){


            if(err){

                console.log(err);

                return res.json({

                    success:false,

                    message:"Failed to add coin"

                });

            }


        });









        // SAVE TRANSACTION HISTORY


        const price = receiveAmount > 0

        ? amount / receiveAmount

        : 0;


        const total = amount;




        db.run(

        `
        INSERT INTO transactions

        (
            user_id,
            type,
            coin,
            price,
            amount,
            total
        )

        VALUES(?,?,?,?,?,?)

        `,

        [

            user_id,

            "exchange",

            toCoin,

            price,

            receiveAmount,

            total

        ],

        function(err){


            if(err){

                console.log(err);

                return res.json({

                    success:false,

                    message:"Transaction save failed"

                });

            }



        });







        res.json({

            success:true,

            message:"Exchange successful"

        });




    });



});





module.exports = router;