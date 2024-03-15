    // Configurando modulos
const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")

    // Rotas

// Rotas usadas para criar nosso site de categorias
router.get("/", eAdmin, (req, res)=>{
    res.render("admin/index")
})

// rota principal, onde mostra a lista de categorias criadas e um botao para nos levar para a rota onde se cria novas 
// categorias
router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({date: "desc"}).then((categorias) =>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "houve um erro ao salvar a categoria")
        res.redirect("/admin")
    })
})

// rota responsavel por nos levar para o caminho onde vamos adicionar novas rotas
router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

// rota criada para validar nosso formulario caso haja algum erro ou caso o cliente nao tenha digitado nenhum dato na nossa
// categoria
router.post("/categorias/nova", eAdmin, (req, res) => {

    var erros = [];

    if (!req.body.nome){
        erros.push({texto: "Nome inválido!"});
    } else if (req.body.nome.length < 5) {
        erros.push({texto: "Nome da categoria é muito pequeno"});
    }
    
    if (!req.body.slug) {
        erros.push({texto: "Slug inválido!"});
    }
    
    if (erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros});
    }else{
            const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "categoria criada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "houve um erro ao salvar a categoria, tente novamente ")
            res.redirect("/admin")
        })
    }
})

// rota responsavel pela ediçao das categorias 
router.get("/categorias/edit/:id",eAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) =>{
        req.flash("error_msg", "esta categoria nao existe")
        res.redirect("/admin/categorias")
    })
})

// rota responsavel pela validaçao e confirmaçao da ediçao das novas categorias 
router.post("/categorias/edit",eAdmin, (req, res) => {
     
    var erros = []

    if (!req.body.nome) {
        erros.push({texto: "Nome inválido!"});
    } else if (req.body.nome.length < 5) {
        erros.push({texto: "Nome da categoria é muito pequeno"});
    }
    
    if (!req.body.slug) {
        erros.push({texto: "Slug inválido!"});
    }

    if (erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros});
    }else{
        Categoria.findOne({_id: req.body.id}).then((categoria) =>{

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
    
            categoria.save().then(() => {
                req.flash("success_msg", "categoria editada com sucesso")
                res.redirect("/admin/categorias")
            }).catch((err) =>{
                req.flash("error_msg", "houve um erro interno ao salvar a ediçao da categoria")
                res.redirect("/admin/categorias")
            })
    
        }).catch((err) => {
            req.flash("error_msg", "houve um erro ao editar a categoria")
            res.redirect("/admin/categorias")
        })
    }
})

// rota responsavel pela exclusao das categorias 
router.post("/categorias/deletar", eAdmin,(req, res) =>{
    Categoria.deleteOne({_id: req.body.id}).then(() =>{
        req.flash("success_msg", "categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) =>{
        req.flash("error_msg", "houve um erro ao deletar sua categoria")
        res.redirect("/admin/categorias")
    })
})


            // Rotas usadas para criar nossas postagens


// rota de postagem principal
router.get("/postagens",eAdmin, (req, res) =>{
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
        res.render("admin/postagens", {postagens, postagens})
    }).catch((err) =>{
        req.flash("error_msg", "houve um erro ao mostrar sua lista de postagens")
        res.redirect("/admin")
    })
})

// rota usada para criar as postagens 
// nessa rota tambem estamos buscando todas as categorias para que elas apareçam dentro do nosso formulario de postagens 
router.get("/postagens/add", eAdmin,(req, res) =>{
    Categoria.find().then((categorias) =>{
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "houve um erro ao encontrar as categorias criadas")
        res.redirect("/admin")
    })
})


// rota responsavel pela validaçao e confirmaçao da ediçao das novas postagens 
router.post("/postagens/nova",eAdmin, (req, res)=>{
    
    var erros = []

    if(!req.body.titulo){
        erros.push({texto: "titulo invalido!"})
    }else if(req.body.titulo.length < 5){
        erros.push({texto: "titulo muito curto"})
    }

    if(!req.body.slug){
        erros.push({texto: "Slug invalido"})
    }

    if(!req.body.descricao){
        erros.push({texto: "descriçao invalida"})
    }else  if(req.body.descricao.length < 10){
        erros.push({texto: "descriçao muito curta"})
    }

    if(!req.body.conteudo){
        erros.push({texto: "conteudo invalido"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "categoria invalida, registre uma nova categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        const novaPostagem ={
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() =>{
            req.flash("success_msg", "postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro ao cadastrar sua postagem")
            res.redirect("/admin/postagens")
        })
    }   
})

// rota responsavel pela ediçao das postagens, usando metodo de pesquisa, onde quando vamos para a pagina de ediçao, 
// nosso servidor antes pesquisa qual postagem nos queremos editar e qual categoria pertence a essa postagem
//para quando chegarmos na pagina de ediçao, os dados ja estarem la apenas para mudarmos oque queremos
router.get("/postagens/edit/:id",eAdmin, (req, res) =>{

    Postagem.findOne({_id: req.params.id}).then((postagem) =>{

        Categoria.find().then((categorias) =>{
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro ")
            res.redirect("/admin/postagens")
        })
    }).catch((err) =>{
        req.flash("error_msg", "houve um erro ao carregar o formulario de ediçao")
        res.redirect("/admin/postagens")
    })
})

// rota responsavel pela validaçao e confirmaçao do envio e ediçao das postagens ja criadas 
router.post("/postagem/edit",eAdmin, (req, res) =>{

    var erros = []

    if(!req.body.titulo){
        erros.push({texto: "titulo invalido!"})
    }else if(req.body.titulo.length < 5){
        erros.push({texto: "titulo muito curto"})
    }

    if(!req.body.slug){
        erros.push({texto: "Slug invalido"})
    }

    if(!req.body.descricao){
        erros.push({texto: "descriçao invalida"})
    }else  if(req.body.descricao.length < 10){
        erros.push({texto: "descriçao muito curta"})
    }

    if(!req.body.conteudo){
        erros.push({texto: "conteudo invalido"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "categoria invalida, registre uma nova categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        Postagem.findOne({_id: req.body.id}).then((postagem) =>{

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
    
            postagem.save().then(() =>{
                req.flash("success_msg", "postagem editada com sucesso")
                res.redirect("/admin/postagens")
            }).catch((err) =>{
                req.flash("error_msg", "erro interno")
                res.redirect("/admin/postagens")
            })
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro ao salvar a ediçao")
            res.redirect("/admin/postagens")
        })
    }
})

router.post("/postagens/deletar",eAdmin, (req, res) =>{
    Postagem.deleteOne({_id: req.body.id}).then((postagens) =>{
        req.flash("success_msg", "postagem deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err) =>{
        req.flash("error_msg", "houve um erro ao tentar deletar a postagem")
        res.redirect("/admin/postagens")
    })
})

// modulo de exportaçao das nossas rotas
module.exports = router