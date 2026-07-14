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
// EXPORT
// =====================================

module.exports = {
    runMigration
};