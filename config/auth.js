const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// modelo de usuario
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done)=>{

        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: "essa conta nao existe"})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem)=>{
                if (erro) {
                    // Trata o erro adequadamente
                    return done(erro);
                }
                if(batem){
                    return done(null, usuario)
                }else{
                    console.log(erro)
                    return done(null, false, {message: "senha incorreta"})
                }
            })
        })
    }))


    passport.serializeUser((usuario, done)=>{

        done(null, usuario.id)

    })
    
    passport.deserializeUser(async (id, done) => {
        try {
            const usuario = await Usuario.findById(id);
            done(null, usuario);
        } catch (err) {
            done(err, null);
        }
    });
    

}