const db = require("./database_v2");


// =====================================
// CREATE MIGRATION TABLE
// =====================================

db.run(`

CREATE TABLE IF NOT EXISTS schema_versions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    version INTEGER UNIQUE,

    name TEXT,

    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);




// =====================================
// MIGRATION CHECKER
// =====================================

function runMigration(version, name, callback){


    db.get(

        `
        SELECT *
        FROM schema_versions
        WHERE version = ?
        `,

        [version],

        (err,row)=>{


            if(err){

                console.log(err);
                return;

            }



            if(row){

                console.log(
                    "Migration already applied:",
                    version,
                    name
                );

                return;

            }



            callback(()=>{


                db.run(

                    `
                    INSERT INTO schema_versions
                    (version,name)

                    VALUES (?,?)

                    `,

                    [
                        version,
                        name
                    ],

                    ()=>{

                        console.log(
                            "Migration applied:",
                            version,
                            name
                        );

                    }

                );


            });


        }

    );

}



// =====================================
// MIGRATION 001
// =====================================

runMigration(

    1,

    "Initial database v2 setup",

    (done)=>{


        console.log(
            "Checking database structure..."
        );


        done();


    }

);

// =====================================
// MIGRATION 002
// ADD TRANSACTION STATUS
// =====================================

runMigration(

2,

"Add transaction status column",

(done)=>{


    db.all(

        "PRAGMA table_info(transactions)",

        (err,columns)=>{


            const exists = columns.some(

                col => col.name === "status"

            );


            if(!exists){


                db.run(`

                ALTER TABLE transactions

                ADD COLUMN status TEXT DEFAULT 'completed'

                `,

                ()=>{

                    console.log(
                        "Added transactions.status"
                    );

                    done();

                });


            }else{


                done();


            }


        }

    );


}

);




// =====================================
// EXPORT
// =====================================

module.exports = {
    runMigration
};