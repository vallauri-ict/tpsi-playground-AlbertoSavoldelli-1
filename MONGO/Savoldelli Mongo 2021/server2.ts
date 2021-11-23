"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "Prove";

/*Query $unwind*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    let req=collection.aggregate([
      {"$project":{"status":1,"nDettagli":1}},
      {"$unwind":"$nDettagli"},
      {"$group":{"_id":"$status","totaleDettagli":{"$sum":"$nDettagli"}}}
    
    ]).toArray();
    req.then(function(data){
        console.log("Query 9:" , data);
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