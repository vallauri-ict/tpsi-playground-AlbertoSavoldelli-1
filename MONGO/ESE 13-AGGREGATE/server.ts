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
//query 2--: Utilizzo della funzione di aggregazione $avg
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

//query 3--Conteggio degli unicorni maschi e degli unicorni femmina
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req=collection.aggregate([
      {"$match": {"gender":{"$exists":true}}},/*per non mostrare id=null*/
      {"$group":{_id:"$gender", /*Id indica campo sul quale vengono fatti i gruppi*/
        "totale":{"$sum":1}/*equivalente del count * */
    }}]).toArray();
    req.then(function(data){
        console.log("Query 3:" , data);
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

//query 4--Calcolare il numero medio di vampiri uccisi dagli unicorni femmina e dagli unicorni maschi
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req=collection.aggregate([
      {"$group":{_id:{"gender":"$gender"},"mediaVampiri":{"$avg":"$vampires"}
    }}]).toArray();
    req.then(function(data){
        console.log("Query 4:" , data);
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

//query 5--raggruppare gli unicorni per genere e tipo di pelo
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req=collection.aggregate([
      {"$match": {"gender":{"$exists":true}}},
      {"$group":{_id:{"gender":"$gender","hair":"$hair"},"nEsemplari":{"$sum":1}}},
      {"$sort":{"nEsemplari":-1,"_id":-1}}/*Se il primo campo è pareggio passsa al secondo*/
    ]).toArray();
    req.then(function(data){
        console.log("Query 4:" , data);
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