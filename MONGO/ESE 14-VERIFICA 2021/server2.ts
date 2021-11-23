"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";

//query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("vallauri");
    let req=collection.aggregate([
        {"$project":{
        "mediaItaliano":{"$avg":"$italiano"},
        "mediaInformatica":{"$avg":"$informatica"},
        "mediaMatematica":{"$avg":"$matematica"},
        "mediaSistemi":{"$avg":"$sistemi"},
        "classe":1
        }},
        {"$project":{
            "mediaStudente":{"$avg":["$mediaItaliano","$mediaInformatica","$mediaMatematica","$mediaSistemi"]},
            "classe":1
        }},
        {"$group":{"_id":"$classe","mediaClasse":{"$avg":"$mediaStudente"}}},
        {$sort:{"mediaClasse":-1}},
        {$project:{"mediaClasse":{"$round":["$mediaClasse",2]}}}
    ]).toArray();
    req.then(function(data){
        console.log("Query 2:" , data);
    })
    req.catch(function(date){
      console.log("errore esecuzione query " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 3
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("vallauri");
      collection.updateMany({"$and":[{"genere":"f"},{"classe":"4A"}]},{$push: {informatica:(7 as never)}},function(err,data){
          if(!err){
              console.log("Query 3",data);
          }
          else{
              console.log("Errore esecuzione query " + err.message);
          }
          client.close();
      });
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});

//Query 4
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("vallauri");
      collection.deleteMany({"classe":"3B","sistemi":3},function(err,data){
          if(!err){
              console.log("Query 4",data);
          }
          else{
              console.log("Errore esecuzione query " + err.message);
          }
          client.close();
      });
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});

/*Query 5 Per ciascuna classe calcolare il totale dei giorni di assenza.
Ordinare i risultati sul totale dei giorni di assenza in ordine decrescente.*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("vallauri");
    let req=collection.aggregate([
        {"$group":{"_id":"$classe","assenzeClasse":{"$sum":"$assenze"}}},
        {"$project":{"classe":1,"assenzeClasse":1}},
        {$sort:{"assenzeClasse":-1}}
    ]).toArray();
    req.then(function(data){
        console.log("Query 2:" , data);
    })
    req.catch(function(date){
      console.log("errore esecuzione query " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});