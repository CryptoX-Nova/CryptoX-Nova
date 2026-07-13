function admin(req, res, next) {

    console.log("ADMIN MIDDLEWARE CHECK:", req.session.user);


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