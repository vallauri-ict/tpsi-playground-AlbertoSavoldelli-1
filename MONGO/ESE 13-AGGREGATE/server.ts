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

import {HEADERS} from "./headers";

//query 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    /*i nomi dei campi devono essere preceduti da $*/
    /*dopo aver fatto i gruppi con $group il risultante avrà solo 2 colonne che sono _id e totale, tutti
    gli altri non sono visibili*/
    let req=collection.aggregate([
      {"$match":{"status":"A"}},
      {"$group":{"_id":"$cust_id","totale":{"$sum":"$amount"}}},
      {"$sort":{"totale":-1}}
    ]).toArray();
    req.then(function(data){
        console.log("Query 1:" , data);
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
//query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    /*i nomi dei campi devono essere preceduti da $*/
    /*dopo aver fatto i gruppi con $group il risultante avrà solo 2 colonne che sono _id e totale, tutti
    gli altri non sono visibili*/
    let req=collection.aggregate([
      {"$group":{"_id":"$cust_id","avgAmount":{"$avg":"$amount"},
      "avgTotal":{"$avg":{"$multiply":["$qta","$amount"]}}
    }}]).toArray();
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