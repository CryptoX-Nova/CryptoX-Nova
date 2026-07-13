const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./cryptox.db");


db.run(
`
ALTER TABLE deposits
ADD COLUMN approved_at DATETIME
`,
(err)=>{

    if(err){

        console.log("Database error:", err.message);

    }else{

        console.log("approved_at column added successfully");

    }


    db.close();

});