import * as _http from "http";
import { json } from "stream/consumers";
import HEADERS from "./headers.json";
import {Dispatcher} from "./dispatcher";
import * as _mongodb from "mongodb";
import { copyFile } from "fs";
const mongoClient=_mongodb.MongoClient;
/*
const port:number=1337;

const dispatcher:Dispatcher=new Dispatcher();
const server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);*/
const CONNECTIONSTRING="mongodb://127.0.0.1:27017";
//INSERIMENTO DI UN NUOVO RECORD
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db=client.db("5B_Studenti");
        let collection=db.collection("Studenti");
        let student={"Nome":"Mauro","Indirizzo":"Informatica","Cognome":"Bima","Sezione":"B",
        "Lavoratore":false,"hobbies":["nuoto", "tennis"],"Residenza":{"Citta":"Genola","Provincia":"Cuneo","Cap":"12045"}}
        collection.insertOne(student,function(err,data){
            if(!err){
                console.log("INSERT ",data);
            }
            else{
                console.log("Errore esecuzione query "+err.message);
            }
            client.close();
        })
    }
    else{
        console.log("Errore nella connessione al database"+err.message);
    }
})
//MODELLO DI ACCESSO AL DATABASE
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db=client.db("5B_Studenti");
        let collection=db.collection("Studenti");
        collection.find().toArray(function(err,data){
            if(!err){
                console.log(data);

            }
            else{
                console.log("Errore esecuzione query "+err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore nella connessione al database");
    }
})

//UPDATE (filtro, azione)
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db=client.db("5B_Studenti");
        let collection=db.collection("Studenti");
        collection.updateOne({"Nome":"Luca"},{$set:{"Eta":"66"}}),(function(err,data){
            if(!err){
                console.log("UPDATE ",data);

            }
            else{
                console.log("Errore esecuzione query "+err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore nella connessione al database");
    }
})
//DELETE
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db=client.db("5B_Studenti");
        let collection=db.collection("Studenti");
        collection.deleteMany({"Eta":"18"}),(function(err,data){
            if(!err){
                console.log("DELETE "+data);

            }
            else{
                console.log("Errore esecuzione query "+err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore nella connessione al database");
    }
})
