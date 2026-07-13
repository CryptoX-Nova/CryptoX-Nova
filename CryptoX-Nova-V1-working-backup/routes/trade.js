const express = require("express");

const router = express.Router();

const db = require("../database/database");


// =====================================
// BUY CRYPTO
// =====================================

router.post("/buy",(req,res)=>{


    if(!req.session.user){

        return res.json({
            success:false,
            message:"Not logged in"
        });

    }


    const user_id = req.session.user.id;


    const {coin, amount} = req.body;



    db.get(

        `
        SELECT price
        FROM market
        WHERE coin=?
        `,

        [coin],

        (err,market)=>{


            if(err || !market){

                return res.json({
                    success:false,
                    message:"Coin not found"
                });

            }



            const price = market.price;


            const coinAmount = amount / price;



            db.get(

                `
                SELECT balance
                FROM wallets
                WHERE user_id=?
                AND coin='USDT'
                `,

                [user_id],

                (err,wallet)=>{


                    if(!wallet || wallet.balance < amount){

                        return res.json({
                            success:false,
                            message:"Insufficient USDT"
                        });

                    }




                    // REMOVE USDT

                    db.run(

                        `
                        UPDATE wallets
                        SET balance = balance - ?
                        WHERE user_id=?
                        AND coin='USDT'
                        `,

                        [
                            amount,
                            user_id
                        ]

                    );





                    // ADD COIN

                    db.run(

                        `
                        UPDATE wallets
                        SET balance = balance + ?
                        WHERE user_id=?
                        AND coin=?
                        `,

                        [
                            coinAmount,
                            user_id,
                            coin
                        ]

                    );





                    // SAVE BUY HISTORY

                  db.run(

`
INSERT INTO trades
(
user_id,
type,
coin,
amount,
price,
total
)

VALUES (?,?,?,?,?,?)

`,

[
    user_id,
    "BUY",
    coin,
    coinAmount,
    price,
    amount
]

);



                    res.json({

                        success:true,

                        message:
                        "Bought "+coin

                    });



                }


            );


        }


    );


});









// =====================================
// SELL CRYPTO
// =====================================

router.post("/sell",(req,res)=>{


    if(!req.session.user){

        return res.json({
            success:false,
            message:"Not logged in"
        });

    }



    const user_id = req.session.user.id;


    const {coin,amount} = req.body;



    db.get(

        `
        SELECT price
        FROM market
        WHERE coin=?
        `,

        [coin],

        (err,market)=>{


            if(err || !market){

                return res.json({
                    success:false,
                    message:"Coin not found"
                });

            }



            const usdtValue = amount * market.price;




            db.get(

                `
                SELECT balance
                FROM wallets
                WHERE user_id=?
                AND coin=?
                `,

                [
                    user_id,
                    coin
                ],

                (err,wallet)=>{


                    if(!wallet || wallet.balance < amount){

                        return res.json({
                            success:false,
                            message:"Insufficient coin"
                        });

                    }





                    // REMOVE COIN

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
                            coin
                        ]

                    );





                    // ADD USDT

                    db.run(

                        `
                        UPDATE wallets
                        SET balance = balance + ?
                        WHERE user_id=?
                        AND coin='USDT'
                        `,

                        [
                            usdtValue,
                            user_id
                        ]

                    );






                    // SAVE SELL HISTORY

                   db.run(

`
INSERT INTO trades
(
user_id,
type,
coin,
amount,
price,
total
)

VALUES (?,?,?,?,?,?)

`,

[
    user_id,
    "SELL",
    coin,
    amount,
    market.price,
    usdtValue
]

);




                    res.json({

                        success:true,

                        message:
                        "Sold "+coin

                    });



                }


            );



        }


    );



});



module.exports = router;