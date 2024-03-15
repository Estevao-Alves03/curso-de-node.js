const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", (req, res) =>{
    res.render("usuarios/registro")
})

router.post("/registro", (req, res)=>{
    var erros = []

    if(!req.body.nome){
       erros.push({texto: "nome invalido"}) 
    }
    if(!req.body.email){
        erros.push({texto: "email invalido"})
    }
    if(!req.body.senha){
        erros.push({texto: "senha invalida"})
    }
    if(req.body.senha.length < 5){
        erros.push({texto: "senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "senhao diferentes, tente novamente"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{

        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "ja existe uma conta com esse email")
                res.redirect("/usuarios/registro")
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "houve um erro durante o salvamento do usuário");
                            res.redirect("/");
                        }
                
                        novoUsuario.senha = hash; // Corrigido para atribuir o hash correto à senha
                
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "usuário criado com sucesso");
                            res.redirect("/");
                        }).catch((err) => {
                            req.flash("error_msg", "houve um erro ao criar o usuário, tente novamente");
                            res.redirect("/usuarios/registro");
                        });
                    });
                });
                
            }
        }).catch((err)=>{
            req.flash("error_msg", "houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res)=>{
    res.render("usuarios/login")
})
               
router.post("/login", (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res) =>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success_msg", "Deslogado com sucesso");
        res.redirect("/");
    });
});

module.exports = router