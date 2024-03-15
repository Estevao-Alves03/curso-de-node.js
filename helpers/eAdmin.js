module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash("error_msg", "Você precisa ser um Administrador"); // Também corrigi a vírgula que estava fora das aspas
        res.redirect("/");
    }
}
