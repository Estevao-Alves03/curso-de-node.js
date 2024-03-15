//carregando modulos
    const express = require('express')
    const { engine } = require('express-handlebars');
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuarios")
    const passport = require("passport");
    require("./config/auth")(passport)
    const db = require("./config/db")
//configurçoes
    //Sessao
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //Midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })
    //body parser
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
    //handlebars
        app.engine('handlebars', engine({
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
        }));
        app.set('view engine', 'handlebars');
    //mongoose
        mongoose.connect(db.mongoURI).then(() => {
            console.log("conectado ao mongo")
        }).catch((err) => {
            console.log("erro ao se conectar: "+err)
        })
    //public
        app.use(express.static(path.join(__dirname, "public")))
    //admin
        app.use("/admin", admin)
    //usuarios
        app.use("/usuarios", usuarios)

//rotas
   
// rota para a pagina principal, monstrando a lista das postagens criadas recentemente, rota trabalha junto com o arquivo 
// index.handlebars
    app.get("/", (req, res) =>{
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
            res.render("index", {postagens: postagens})
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro interno")
            res.redirect("/404")
        })  
    })

// rota para acessar uma pagina onde ira mostrar detalhadamente mais sobre a postagem criada, rota trabalha junto com o arquivo
// index.handlebars (da pasta postagem)
    app.get("/postagem/:slug", (req, res) =>{
        Postagem.findOne({slug: req.params.slug}).then((postagem) =>{
          if(postagem){
            res.render("postagem/index", {postagem: postagem})
          } else{
            req.flash("error_msg", "Esta Postagem nao existe")
            res.redirect("/")
          }
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res) =>{
        Categoria.find().then((categorias)=>{
            res.render("categorias/index", {categorias: categorias})
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro interno ao listar as categorias")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug",(req, res) =>{
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
            if(categoria){

                Postagem.find({categoria: categoria._id}).then((postagens)=>{
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                }).catch((err) =>{
                    req.flash("error_msg", "houve um erro interno ao carregar a pagina desta categotria")
                    res.redirect("/")
                })

            }else{
                req.flash("error_msg", "esta categoria nao existe")
                res.redirect("/")
            }
        }).catch((err) =>{
        req.flash("error_msg", "houve um erro interno ao carregar a pagina desta categotria")
        res.redirect("/")
    })
    })
       

// rota criada para levar o cliente a uma pagina de erro 404
    app.get("/404", (req, res) =>{
        res.send("erro 404")
    })
    


//outros
    const PORT = process.env.PORT || 8081
    app.listen(PORT, () => {
        console.log("servidor rodando! ")
    })
