const express = require("express");

const router = express.Router();

const db = require("../database/database");

// =====================================
// CREATE DEPOSIT REQUEST
// =====================================

router.post("/", (req, res) => {

    console.log("========== DEPOSIT ==========");
    console.log("SESSION:", req.session);
    console.log("SESSION USER:", req.session.user);

    if (!req.session.user) {

        return res.json({
            success: false,
            message: "Please login first."
        });

    }

    const user_id = req.session.user.id;

    const { coin, amount } = req.body;

    if (!coin || !amount) {

        return res.json({
            success: false,
            message: "Missing required fields."
        });

    }

    if (Number(amount) <= 0) {

        return res.json({
            success: false,
            message: "Invalid amount."
        });

    }

    db.run(

        `
        INSERT INTO deposits
        (user_id, coin, amount, status)
        VALUES
        (?, ?, ?, 'pending')
        `,

        [user_id, coin, amount],

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

                message:"Deposit request submitted.",

                depositId:this.lastID

            });

        }

    );

});

module.exports = router;