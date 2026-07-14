function admin(req, res, next) {

    console.log("ADMIN DEBUG SESSION:");
console.log("SESSION ID:", req.sessionID);
console.log("USER:", req.session.user);
console.log("ROLE:", req.session.user?.role);


    if (!req.session.user) {

        return res.status(401).json({
            success:false,
            message:"Not logged in"
        });

    }


    if (req.session.user.role.toLowerCase() !== "admin") {

        return res.status(403).json({
            success:false,
            message:"Admin access only"
        });

    }


    console.log("ADMIN ACCESS GRANTED");


    next();

}


module.exports = admin;