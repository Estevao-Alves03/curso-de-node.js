if(process.env.NODE.ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://estevaogalves24:<-tr/2UBc9EXLb,.>@blogapp-node.ypmkgdd.mongodb.net/?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://127.0.0.1:27017/blogapp"}
}