import express from "express";
import * as _fs from "fs";
import * as _http from "http";
import * as bodyParser from "body-parser";
import { inherits } from "util";
import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;   
/*IN LOCALE
const CONNSTRING = "mongodb://127.0.0.1:27017";*/
//PER ATLAS
const CONNSTRING = "mongodb+srv://admin:admin@cluster0.hdanb.mongodb.net/5B?retryWrites=true&w=majority";
const DBNAME = "5B";

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
app.use("/",function(req,res,next){
    mongoClient.connect(CONNSTRING,function(err,client){
        if(err){
            res.status(503).send("DB connection err");
        }
        else{
            req["client"]=client;/*Per creare vanno usate le quadre*/
            next();

        }
    })
})
app.get("/api/risorsa1",function(req,res,next){
    let unicorn=req.query.nome;
    if(unicorn){
        let db = req["client"].db(DBNAME) as _mongodb.Db;/*Per tipizzare la nuova variabile per l'intellisense*/
        let collection = db.collection("unicorns");
        let request=collection.find({"name":unicorn}).toArray();
        request.then(function(data){
            res.send(data)
        })
        request.catch(function(date){
            res.status(503).send("Errore nella query");
        })
        request.finally(function(){
            req["client"].close();
        });
    }
    else{
        res.status(400).send("Manca il parametro unicornName")
        req["client"].close();
    }
})
app.patch("/api/risorsa2",function(req,res,next){
    let unicorn=req.body.nome;
    let incVampires=req.body.vampiri;
    if(unicorn && incVampires){
        let db = req["client"].db(DBNAME) as _mongodb.Db;/*Per tipizzare la nuova variabile per l'intellisense*/
        let collection = db.collection("unicorns");
        let request=collection.updateOne({"name":unicorn},{"$inc":{"vampires":incVampires}});
        request.then(function(data){
            res.send(data)
        })
        request.catch(function(date){
            res.status(503).send("Errore nella query");
        })
        request.finally(function(){
            req["client"].close();
        });
    }
    else{
        res.status(400).send("Manca un parametro tra name e vampires");
        req["client"].close();
    }
})
app.get("/api/risorsa3/:gender/:hair",function(req,res,next){
    let gender=req.params.gender;
    let hair=req.params.hair;
    /*La if sull'esistenza dei parametri non serve perchè se mancano non entra nella route*/
        let db = req["client"].db(DBNAME) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.find({ $and: [{ gender: gender }, { hair: hair }] }).toArray();
        request.then(function(data){
            res.send(data)
        })
        request.catch(function(date){
            res.status(503).send("Errore nella query");
        })
        request.finally(function(){
            req["client"].close();
        });
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
/* *******************************************************************/
//route di gestione degli errori
/*********************************************************************/
app.use((err, req, res, next) => {
    console.log("Errore codice server: " + err.message);
});