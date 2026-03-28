exports.isLoggedIn = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/");
    }
    next();
};

exports.isAdopter = (req, res, next) => {
    if (req.session.user.account === "Shelter") {
        return res.redirect("/home-shelter");
    }
    next();
};
