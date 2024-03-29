const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId, // Correção aqui: 'type' com 't' minúsculo e remoção dos parênteses.
        ref: "categorias", // Certifique-se de que o valor de 'ref' corresponda exatamente ao nome do modelo referenciado.
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("postagens", Postagem);