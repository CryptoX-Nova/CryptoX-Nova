const express = require("express");

const router = express.Router();

const db = require("../database/database");


// =====================================
// CREATE WITHDRAW REQUEST
// =====================================

router.post("/", (req,res)=>{


    if(!req.session.user){

        return res.json({

            success:false,

            message:"Please login first."

        });

    }



    const user_id = req.session.user.id;



    const {
        coin,
        amount,
        address
    } = req.body;



    if(!coin || !amount || !address){


        return res.json({

            success:false,

            message:"Missing required fields."

        });


    }



    if(Number(amount) <= 0){


        return res.json({

            success:false,

            message:"Invalid amount."

        });


    }



    db.run(

        `
        INSERT INTO withdrawals

        (
            user_id,
            coin,
            amount,
            address,
            status
        )

        VALUES

        (?,?,?,?, 'pending')

        `,

        [

            user_id,

            coin.toUpperCase(),

            Number(amount),

            address

        ],


        function(err){


            if(err){

                console.log(err);


                return res.json({

                    success:false,

                    message:"Database error."

                });


            }



            res.json({

                success:true,

                message:"Withdrawal request submitted.",

                withdrawalId:this.lastID

            });


        }


    );


});



module.exports = router;