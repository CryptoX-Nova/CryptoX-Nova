const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./cryptox.db");


db.serialize(()=>{


    db.run(`
        ALTER TABLE withdrawals
        ADD COLUMN network TEXT
    `,(err)=>{

        if(err){

            console.log("Network:", err.message);

        }else{

            console.log("network added");

        }

    });



    db.run(`
        ALTER TABLE withdrawals
        ADD COLUMN address TEXT
    `,(err)=>{

        if(err){

            console.log("Address:", err.message);

        }else{

            console.log("address added");

        }

    });



    db.run(`
        ALTER TABLE withdrawals
        ADD COLUMN approved_at DATETIME
    `,(err)=>{

        if(err){

            console.log("Approved:", err.message);

        }else{

            console.log("approved_at added");

        }

    });


});


db.close();