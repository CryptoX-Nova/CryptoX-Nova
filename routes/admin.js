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

// =====================================
// ADMIN DASHBOARD STATS
// =====================================

router.get("/stats", (req, res, next) => {

    console.log("CURRENT SESSION:", req.session.user);

    next();

}, admin, (req, res) => {


    // TOTAL USERS

    db.get(

        `
        SELECT COUNT(*) AS totalUsers
        FROM users
        `,

        [],

        (err, users) => {


            if(err){

                return res.json({

                    success:false,

                    message:"Users stats error"

                });

            }



            // TOTAL DEPOSITS

            db.get(

                `
                SELECT COALESCE(SUM(amount),0) AS totalDeposits
                FROM deposits
                `,

                [],

                (err, deposits) => {


                    if(err){

                        return res.json({

                            success:false,

                            message:"Deposits stats error"

                        });

                    }





                    // PLATFORM BALANCE

                    db.get(

                        `
                        SELECT COALESCE(SUM(balance),0) AS platformBalance
                        FROM wallets
                        `,

                        [],

                        (err, balance) => {



                            if(err){

                                return res.json({

                                    success:false,

                                    message:"Wallet stats error"

                                });

                            }





                            // TOTAL TRADES

                            db.get(

                                `
                                SELECT COUNT(*) AS totalTrades
                                FROM trades
                                `,

                                [],

                                (err, trades) => {



                                    if(err){

                                        return res.json({

                                            success:false,

                                            message:"Trade stats error"

                                        });

                                    }





                                    res.json({

                                        success:true,

                                        totalUsers:
                                        users.totalUsers,


                                        totalDeposits:
                                        deposits.totalDeposits,


                                        platformBalance:
                                        balance.platformBalance,


                                        totalTrades:
                                        trades.totalTrades


                                    });



                                }

                            );

                        }

                    );

                }

            );

        }

    );


});

// =====================================
// GET PENDING DEPOSITS
// =====================================

router.get("/pending-deposits", admin, (req,res)=>{


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

WHERE deposits.status = 'pending'

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

// =====================================
// APPROVE DEPOSIT
// =====================================

router.post("/deposit/approve/:id", admin, (req,res)=>{


const depositId = req.params.id;



db.get(

`
SELECT *

FROM deposits

WHERE id = ?

`,

[depositId],


(err,deposit)=>{


if(err || !deposit){

return res.json({

success:false,

message:"Deposit not found"

});

}



if(deposit.status !== "pending"){

return res.json({

success:false,

message:"Already processed"

});

}




// ADD BALANCE TO WALLET

db.run(

`
UPDATE wallets

SET balance = balance + ?

WHERE user_id = ?

AND coin = ?

`,

[

deposit.amount,

deposit.user_id,

deposit.coin

],


function(err){


if(err){

return res.json({

success:false,

message:"Wallet update failed"

});

}



if(this.changes === 0){

return res.json({

success:false,

message:"Wallet not found"

});

}




// UPDATE STATUS


db.run(

`
UPDATE deposits

SET status='approved',
approved_at=CURRENT_TIMESTAMP

WHERE id=?

`,

[depositId]

);



res.json({

success:true,

message:"Deposit approved"

});



});


});


});

// =====================================
// REJECT DEPOSIT
// =====================================

router.post("/deposit/reject/:id", admin, (req,res)=>{


const id = req.params.id;


db.run(

`
UPDATE deposits

SET status='rejected'

WHERE id=?

AND status='pending'

`,

[id],


function(err){


if(err){

return res.json({

success:false,

message:"Database error"

});

}


res.json({

success:true,

message:"Deposit rejected"

});


});


});


// =====================================
// APPROVE WITHDRAW
// =====================================

router.post("/withdraw/approve/:id", admin, (req,res)=>{


const id = req.params.id;



db.get(

`
SELECT *

FROM withdrawals

WHERE id = ?

`,

[id],


(err,withdraw)=>{


if(err || !withdraw){

return res.json({

success:false,

message:"Withdrawal not found"

});

}



if(withdraw.status !== "pending"){

return res.json({

success:false,

message:"Already processed"

});

}



// REMOVE BALANCE FROM WALLET


db.run(

`
UPDATE wallets

SET balance = balance - ?

WHERE user_id = ?

AND coin = ?

`,

[

withdraw.amount,

withdraw.user_id,

withdraw.coin

],


function(err){


if(err){

return res.json({

success:false,

message:"Wallet update failed"

});

}



if(this.changes === 0){

return res.json({

success:false,

message:"Wallet not found"

});

}




// UPDATE WITHDRAW STATUS


db.run(

`
UPDATE withdrawals

SET status='approved',
approved_at=CURRENT_TIMESTAMP

WHERE id=?

`,

[id]

);



res.json({

success:true,

message:"Withdrawal approved"

});



});


});


});


// =====================================
// REJECT WITHDRAW
// =====================================

router.post("/withdraw/reject/:id", admin, (req,res)=>{


const id = req.params.id;



db.run(

`
UPDATE withdrawals

SET status='rejected'

WHERE id=?

AND status='pending'

`,

[id],


function(err){


if(err){

return res.json({

success:false,

message:"Database error"

});

}



res.json({

success:true,

message:"Withdrawal rejected"

});


});


});

// =====================================
// GET PENDING WITHDRAWALS
// =====================================

router.get("/pending-withdrawals", admin, (req,res)=>{


    db.all(

`
SELECT

withdrawals.id,

users.username,

withdrawals.coin,

withdrawals.amount,

withdrawals.status,

withdrawals.created_at


FROM withdrawals


JOIN users

ON withdrawals.user_id = users.id


WHERE withdrawals.status='pending'


ORDER BY withdrawals.id DESC

`,

[],


(err,rows)=>{


if(err){

console.log(err);

return res.json({

success:false,

error:err.message

});

}



res.json({

success:true,

withdrawals:rows

});


});


});




module.exports = router;