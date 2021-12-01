import express from "express";
import * as _fs from "fs";
import * as _http from "http";
import * as bodyParser from "body-parser";
import { inherits } from "util";

let port:number=1337;
let app=express();
let server=_http.createServer(app);
server.listen(port,function(){
    console.log("Server in ascolto sulla porta "+port); /*Secondo parametro console log*/
    init();
});

/******************************************************************** */
let paginaErrore="";
function init(){
    _fs.readFile("./static/error.html",function(err,data){
        if(!err){
            paginaErrore=data.toString();
        }
        else{
            paginaErrore="<h2>Risorsa non trovata</h2>"
        }
    })
}
/********************************************************************* */
//Elenco delle route di tipo middleware
/********************************************************************** */
// 1-Log 
app.use("/",function(req, res, next){
    console.log("---->" + req.method + ":"+ req.originalUrl);
    next();
});

// 2-Static route
//il next lo fa automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3-Route lettura parametri post
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({"extended":true}));

// 4-Log parametri
app.use("/", function(req, res, next){
    if(Object.keys(req.query).length > 0){
        console.log("Parametri GET: ",req.query);
    }
    if(Object.keys(req.body).length > 0){
        console.log("Parametri BODY: ",req.body);
    }
    next();
})
/********************************************************************* */
//Elenco delle route di risposta al client
/********************************************************************** */
app.get("/api/risorsa1",function(req,res,next){
    let nome=req.query.nome;
    res.send({"nome":nome})
})
app.post("/api/risorsa1",function(req,res,next){
    let nome=req.body.nome;
    res.send({"nome":nome})
})
/********************************************************************** */
//Default route (risorse non trovate ) e route di gestione degli errori
/********************************************************************** */
app.use("/", function (req, res, next) {
    if(req.originalUrl.startsWith("/api/")){
        res.send("Servizio non trovato");
    }
    else{
        res.send(paginaErrore);
    }
});