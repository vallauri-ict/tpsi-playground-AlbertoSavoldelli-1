import * as _http from "http";
import { json } from "stream/consumers";
import HEADERS from "./headers.json";
import {Dispatcher} from "./dispatcher";
import * as _mongodb from 'mongodb'
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
    //quando c'è solo una write si può mettere nell'end
    let dataStart=req["BODY"].dataStart;
    let dataEnd=req["BODY"].dataEnd;
    mongoClient.connect(CONNSTRING,function(err,client){
        if(!err)
        {
          let db = client.db(DBNAME);
          let collection = db.collection("unicorns");
          collection.find({"$and":[{"$gte":{"dob":dataStart}},{"$lte":{"dob":dataEnd}}]}
          ).project({"nome":1,"classe":1})
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