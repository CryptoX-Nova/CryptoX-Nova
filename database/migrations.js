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
// MIGRATION 003
// ADD DATABASE PERFORMANCE INDEXES
// =====================================

runMigration(

    3,

    "Add database performance indexes",

    (done)=>{


        const indexes = [

            `
            CREATE INDEX IF NOT EXISTS idx_wallets_user
            ON wallets(user_id)
            `,


            `
            CREATE INDEX IF NOT EXISTS idx_transactions_user
            ON transactions(user_id)
            `,


            `
            CREATE INDEX IF NOT EXISTS idx_deposits_user
            ON deposits(user_id)
            `,


            `
            CREATE INDEX IF NOT EXISTS idx_withdrawals_user
            ON withdrawals(user_id)
            `,


            `
            CREATE INDEX IF NOT EXISTS idx_trades_user
            ON trades(user_id)
            `

        ];



        let completed = 0;



        indexes.forEach((query)=>{


            db.run(query, (err)=>{


                if(err){

                    console.log(
                        "INDEX ERROR:",
                        err
                    );

                }


                completed++;


                if(completed === indexes.length){


                    console.log(
                        "Database indexes created"
                    );


                    done();


                }


            });


        });



    }

);

// =====================================
// MIGRATION 004
// ADD WALLET TIMESTAMPS
// =====================================

runMigration(

    4,

    "Add wallet timestamps",

    (done)=>{


        db.all(

            "PRAGMA table_info(wallets)",

            (err,columns)=>{


                if(err){

                    console.log(err);
                    return;

                }


                const hasCreated = columns.some(
                    col => col.name === "created_at"
                );


                const hasUpdated = columns.some(
                    col => col.name === "updated_at"
                );



                let queries = [];



                if(!hasCreated){

                    queries.push(`

                    ALTER TABLE wallets

                    ADD COLUMN created_at DATETIME
                    DEFAULT CURRENT_TIMESTAMP

                    `);

                }



                if(!hasUpdated){

                    queries.push(`

                    ALTER TABLE wallets

                    ADD COLUMN updated_at DATETIME
                    DEFAULT CURRENT_TIMESTAMP

                    `);

                }



                if(queries.length === 0){

                    done();
                    return;

                }



                let finished = 0;



                queries.forEach(query=>{


                    db.run(query,()=>{


                        finished++;


                        if(finished === queries.length){

                            console.log(
                                "Wallet timestamps added"
                            );

                            done();

                        }


                    });


                });



            }

        );


    }

);

// =====================================
// MIGRATION 005
// ADD USER SECURITY FIELDS
// =====================================

runMigration(

    5,

    "Add user account status and login tracking",

    (done)=>{


        db.all(

            "PRAGMA table_info(users)",

            (err, columns)=>{


                if(err){

                    console.log(err);
                    return;

                }



                const hasLastLogin = columns.some(
                    col => col.name === "last_login"
                );


                const hasStatus = columns.some(
                    col => col.name === "status"
                );



                let queries = [];



                if(!hasLastLogin){

                    queries.push(`

                    ALTER TABLE users

                    ADD COLUMN last_login DATETIME

                    `);

                }



                if(!hasStatus){

                    queries.push(`

                    ALTER TABLE users

                    ADD COLUMN status TEXT DEFAULT 'active'

                    `);

                }



                if(queries.length === 0){

                    done();
                    return;

                }



                let finished = 0;



                queries.forEach(query=>{


                    db.run(query,(err)=>{


                        if(err){

                            console.log(
                                "USER MIGRATION ERROR:",
                                err
                            );

                        }


                        finished++;


                        if(finished === queries.length){


                            console.log(
                                "User security fields added"
                            );


                            done();


                        }


                    });


                });



            }

        );


    }

);

// =====================================
// MIGRATION 006
// ADD ADMIN AUDIT DETAILS
// =====================================

runMigration(

    6,

    "Add admin audit details",

    (done)=>{


        db.all(

            "PRAGMA table_info(admin_logs)",

            (err, columns)=>{


                if(err){

                    console.log(err);
                    return;

                }



                const hasIp = columns.some(
                    col => col.name === "ip_address"
                );


                const hasAgent = columns.some(
                    col => col.name === "user_agent"
                );



                let queries = [];



                if(!hasIp){

                    queries.push(`

                    ALTER TABLE admin_logs

                    ADD COLUMN ip_address TEXT

                    `);

                }



                if(!hasAgent){

                    queries.push(`

                    ALTER TABLE admin_logs

                    ADD COLUMN user_agent TEXT

                    `);

                }



                if(queries.length === 0){

                    done();
                    return;

                }



                let finished = 0;



                queries.forEach(query=>{


                    db.run(query,(err)=>{


                        if(err){

                            console.log(
                                "ADMIN LOG MIGRATION ERROR:",
                                err
                            );

                        }


                        finished++;


                        if(finished === queries.length){

                            console.log(
                                "Admin audit fields added"
                            );

                            done();

                        }


                    });


                });



            }

        );


    }

);

// =====================================
// MIGRATION 007
// ADD TRANSACTION REFERENCE SYSTEM
// =====================================

runMigration(

    7,

    "Add transaction reference system",

    (done)=>{


        db.all(

            "PRAGMA table_info(transactions)",

            (err, columns)=>{


                if(err){

                    console.log(err);
                    return;

                }



                const hasReference = columns.some(
                    col => col.name === "reference_id"
                );


                const hasNotes = columns.some(
                    col => col.name === "notes"
                );



                let queries = [];



                if(!hasReference){

                    queries.push(`

                    ALTER TABLE transactions

                    ADD COLUMN reference_id TEXT

                    `);

                }



                if(!hasNotes){

                    queries.push(`

                    ALTER TABLE transactions

                    ADD COLUMN notes TEXT

                    `);

                }



                if(queries.length === 0){

                    done();
                    return;

                }



                let finished = 0;



                queries.forEach(query=>{


                    db.run(query,(err)=>{


                        if(err){

                            console.log(
                                "TRANSACTION MIGRATION ERROR:",
                                err
                            );

                        }


                        finished++;


                        if(finished === queries.length){


                            console.log(
                                "Transaction reference fields added"
                            );


                            done();

                        }


                    });


                });



            }

        );


    }

);

// =====================================
// MIGRATION 008
// ADD DEPOSIT WITHDRAWAL AUDIT FIELDS
// =====================================

runMigration(

    8,

    "Add deposit and withdrawal audit fields",

    (done)=>{


        const tables = [

            {
                table:"deposits",
                columns:[
                    "reference_id TEXT",
                    "approved_by INTEGER"
                ]
            },

            {
                table:"withdrawals",
                columns:[
                    "reference_id TEXT",
                    "approved_by INTEGER"
                ]
            }

        ];



        let completedTables = 0;



        tables.forEach(item=>{


            db.all(

                `PRAGMA table_info(${item.table})`,

                (err, columns)=>{


                    if(err){

                        console.log(err);
                        return;

                    }



                    let queries = [];



                    item.columns.forEach(column=>{


                        const columnName = column.split(" ")[0];


                        const exists = columns.some(
                            col=>col.name === columnName
                        );


                        if(!exists){

                            queries.push(`

                            ALTER TABLE ${item.table}

                            ADD COLUMN ${column}

                            `);

                        }


                    });



                    if(queries.length === 0){

                        completedTables++;

                    }



                    let finished = 0;



                    queries.forEach(query=>{


                        db.run(query,(err)=>{


                            if(err){

                                console.log(
                                    "AUDIT MIGRATION ERROR:",
                                    err
                                );

                            }


                            finished++;


                            if(finished === queries.length){

                                completedTables++;


                                if(completedTables === tables.length){

                                    console.log(
                                        "Deposit and withdrawal audit fields added"
                                    );

                                    done();

                                }

                            }


                        });


                    });



                }

            );


        });



    }

);

// =====================================
// EXPORT
// =====================================

module.exports = {
    runMigration
};