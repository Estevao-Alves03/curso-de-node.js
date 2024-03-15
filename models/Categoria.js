    // Configurando modulos
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// configurando a categoria
const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default : Date.now()
    }
})

// definindo o nome da nossa coleçao (collection)
mongoose.model("categorias", Categoria)