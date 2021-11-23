import * as _http from "http";
import { json } from "stream/consumers";
import HEADERS from "./headers.json";
import {Dispatcher} from "./dispatcher";
import * as _mongodb from 'mongodb'
import { parse } from "path/posix";
const mongoClient = _mongodb.MongoClient;
let port:number=1337;
let dispatcher:Dispatcher=new Dispatcher();
let server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
//registrazione dei servizi
dispatcher.addListener("POST","/api/servizio1",function(req,res){
    let txtClasse=req["BODY"].classe;
    mongoClient.connect(CONNSTRING,function(err,client){
        if(!err)
        {
          console.log(txtClasse)
          let db = client.db(DBNAME);
          let collection = db.collection("students");
          collection.find({"classe":txtClasse}).project({"nome":1,"classe":1})
          .toArray(function(err,data){
            if(!err)
            {
                res.writeHead(200,HEADERS.json);
                res.write(JSON.stringify(data));
                res.end();
            }
            else
            {
                res.writeHead(500,HEADERS.json);
                res.write("errore di esecuzione query");
                res.end();
            }
            client.close();
          });
        }
        else
        {
          console.log("Errore nella connessione al database");
        }
      });
    
})