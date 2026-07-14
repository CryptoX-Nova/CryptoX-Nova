const db = require("../database/database");


function adminLog(
    req,
    action,
    target_user,
    description
){


    if(!req.session.user){
        return;
    }


    db.run(

    `
    INSERT INTO admin_logs

    (
        admin_id,
        action,
        target_user,
        description
    )

    VALUES (?,?,?,?)

    `,

    [

        req.session.user.id,

        action,

        target_user,

        description

    ]

    );


}


module.exports = adminLog;