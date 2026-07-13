const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const db = require("../database/database");


// ===============================
// REGISTER
// ===============================

router.post("/register", async (req,res)=>{


    const {username,email,password} = req.body;


    if(!username || !email || !password){

        return res.json({

            success:false,
            message:"All fields required"

        });

    }



    const hashedPassword = await bcrypt.hash(password,10);



    db.run(

        `
        INSERT INTO users
        (username,email,password)

        VALUES (?,?,?)

        `,

        [
            username,
            email,
            hashedPassword
        ],

       function(err){

    if(err){

        return res.json({

            success:false,
            message:"Username or email already exists"

        });

    }

    const userId = this.lastID;

    const stmt = db.prepare(

        `INSERT INTO wallets (user_id, coin, balance)
         VALUES (?, ?, ?)`

    );

    stmt.run(userId, "USDT", 0);
    stmt.run(userId, "BTC", 0);
    stmt.run(userId, "ETH", 0);
    stmt.run(userId, "SOL", 0);

    stmt.finalize();

    res.json({

        success:true,
        message:"Account created",
        user_id:userId

    });

}


    );



});


// ===============================
// LOGIN
// ===============================

router.post("/login",(req,res)=>{


    const {username,password}=req.body;



    db.get(

        `SELECT * FROM users WHERE username=?`,

        [username],

        async(err,user)=>{


            if(err || !user){

                return res.json({

                    success:false,
                    message:"User not found"

                });

            }



            const match = await bcrypt.compare(

                password,

                user.password

            );



            if(!match){

                return res.json({

                    success:false,
                    message:"Wrong password"

                });

            }



            req.session.user={

                id:user.id,

                username:user.username,

                role:user.role

            };



            res.json({

    success:true,

    message:"Login successful",

    user:{

        id:user.id,

        username:user.username,

        role:user.role

    }

});


        }


    );


});

// ===============================
// LOGOUT
// ===============================

router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({

            success: true,
            message: "Logout successful"

        });

    });

});

module.exports = router;