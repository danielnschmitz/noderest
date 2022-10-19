const express = require('express'); //resolve as requisições http
const bodyParser = require('body-parser'); //utilitario para extração de informações do JSON

const app = express(); // app deve usar o express


app.use(bodyParser.json()); //define o json com linguagem para o parser
app.use(bodyParser.urlencoded({extended: false})); // permite que parser identifique aninhamento de objetos no json

app.use('/',require('./controllers/projectController'));

app.listen(3000);
console.log("API rodando na porta 3000");