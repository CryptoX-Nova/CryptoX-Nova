const express = require("express");

const router = express.Router();

const db = require("../database/database");
const admin = require("../middleware/admin");


// ===============================
// GET ALL USERS
// ===============================

router.get("/users", admin, (req, res) => {

    db.all(

        `
        SELECT
            id,
            username,
            email,
            role,
            created_at
        FROM users
        ORDER BY id
        `,

        [],

        (err, rows) => {

            if (err) {

                return res.json({
                    success: false,
                    message: "Database error"
                });

            }

            res.json({
                success: true,
                users: rows
            });

        }

    );

});

// =====================================
// ADMIN DEPOSIT
// =====================================

router.post("/deposit", admin, (req,res)=>{

    console.log("ADMIN SESSION:", req.session.user);

const {user_id, coin, amount} = req.body;



if(!user_id || !coin || !amount){

    return res.json({

        success:false,

        message:"Missing fields"

    });

}




// UPDATE WALLET

db.run(

`
UPDATE wallets

SET balance = balance + ?

WHERE user_id = ?

AND coin = ?

`,

[
amount,
user_id,
coin.toUpperCase()
],


function(err){



if(err){

    console.log(err);

    return res.json({
        success:false,
        message:err.message
    });

}


if(this.changes === 0){

return res.json({

success:false,

message:"Wallet not found"

});

}




// SAVE DEPOSIT HISTORY


db.run(

`
INSERT INTO deposits

(user_id,coin,amount)

VALUES (?,?,?)

`,

[

user_id,

coin.toUpperCase(),

amount

],



function(err){


if(err){

return res.json({

success:false,

message:"Deposit history error"

});

}




res.json({

success:true,

message:"Deposit successful"


});



}



);



}



);



});

// =====================================
// GET DEPOSIT HISTORY
// =====================================

router.get("/deposits", admin, (req,res)=>{


    db.all(

    `
    SELECT

    deposits.id,

    users.username,

    deposits.coin,

    deposits.amount,

    deposits.status,

    deposits.created_at


    FROM deposits


    JOIN users

    ON deposits.user_id = users.id


    ORDER BY deposits.id DESC

    `,


    [],


    (err,rows)=>{


        if(err){

            return res.json({

                success:false,

                message:"Database error"

            });

        }



        res.json({

            success:true,

            deposits:rows

        });



    });


});

module.exports = router;