import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import { inherits } from "util";
import HEADERS from "./headers.json";
import * as mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;   
/*IN LOCALE
const CONNSTRING = "mongodb://127.0.0.1:27017";*/
//PER ATLAS
const CONNSTRING = "mongodb+srv://admin:admin@cluster0.hdanb.mongodb.net/5B?retryWrites=true&w=majority";
const DBNAME = "unicorns";

let port:number=1337;
let app=express();
let server=http.createServer(app);

server.listen(port,function(){
    console.log("Server in ascolto sulla porta "+port); /*Secondo parametro console log*/
    init();
});

/******************************************************************** */
let paginaErrore="";
function init(){
    fs.readFile("./static/error.html",function(err,data){
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
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({"extended":true}));

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
//Middleware di apertura della connessione
app.use("/", (req, res, next) => {
    mongoClient.connect(CONNSTRING, (err, client) => {
      if (err) {
        res.status(503).send("Db connection error");
      } else {
        console.log("Connection made");
        req["client"] = client;
        next();
      }
    });
  });

  //Lettura delle collezioni presenti nel db
  app.get("/api/getCollections", (req, res, next) => {
    let db = req["client"].db(DBNAME) as mongodb.Db;
    let request = db.listCollections().toArray();
    request.then((data) => {
      res.send(data);
    });
    request.catch((err) => {
      res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
      req["client"].close();
    });
  });

  //Middleware di intercettazione dei parametri
  let currentCollection = "";
  let id = ""
  //:id? diventa un campo facoltativo
  app.use("/api/:collection/:id?",(req, res, next) =>{
    currentCollection = req.params.collection;
    id = req.params.id;
    next();
  })

  //Listener get
  app.get("/api/*", (req, res, next) => {
    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    if(!id){
      let request = collection.find().toArray();
      request.then((data) => {
        res.send(data);
        });
        request.catch((err) => {
        res.status(503).send("Sintax error in the query");
        });
        request.finally(() => {
        req["client"].close();
      });
    }
    else{
      let oid = new mongodb.ObjectId(id);
      let request = collection.find({"_id":oid}).toArray();
      request.then((data) => {
        res.send(data);
        });
        request.catch((err) => {
        res.status(503).send("Sintax error in the query");
        });
        request.finally(() => {
        req["client"].close();
      });
    }
});

/********************************************************************** */
//Default route (risorse non trovate ) e route di gestione degli errori
/********************************************************************** */
app.use("/", function(err, req, res, next){
    console.log("Errore codice server", err.message );
})