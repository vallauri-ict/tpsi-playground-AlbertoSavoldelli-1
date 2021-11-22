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

import {HEADERS} from "./headers";

/*query 1 - Si vogliono selezionare i record che hanno status A, raggrupparli secondo il campo cust_id e, per ogni
gruppo, eseguire la somma sul campo amount*/
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
      {"$group":{"_id":"$cust_id", "totale" :{"$sum": "$amount"}}},
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
    let req=collection.aggregate([
      {"$group":{
        "_id":"$cust_id",
        "avgAmount" :{"$avg": "$amount"},
        "avgTotal":{"$avg":{"$multiply":["$qta","$amount"]}}
      }},
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


//query 3--Conteggio degli unicorni maschi e degli unicorni femmina
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req=collection.aggregate([
      {"$group":{
        "_id":"$gender",
        "totale" :{"$sum": 1}
      }},
    ]).toArray();
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
      {"$group":{
        "_id":"$gender",
        "mediaUccisi" :{"$avg": "$vampires"}
      }},
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

//query 5--raggruppare gli unicorni per genere e tipo di pelo
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req=collection.aggregate([
      {"$group":{
        "_id":{"gender":"$gender","hair":"$hair"},
        "nEsemplari":{$sum:1}}},
        {"$sort" :{"nEsemplari":-1,"_id":-1}}
    ]).toArray();
    req.then(function(data){
        console.log("Query 5:" , data);
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

//query 6--numero medio di vampiri uccisi dagli unicorni complessivamente presenti nella collezione
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("unicorns");
    let req=collection.aggregate([
      {"$group":{
        "_id":{},
        "media":{$avg:"$vampires"}}},
        {"$project" :{"_id":0,"media":{"$round":"$media"}}}
    ]).toArray();
    req.then(function(data){
        console.log("Query 6:" , data);
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

//query 7--
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("quizzes");
    let req=collection.aggregate([
      {"$project": {
        quizAvg: { $avg: "$quizzes"},
        labAvg: { $avg: "$labs" },
        examAvg: { $avg: ["$midterm","$final"] } }},
      {"$project":{
        quizAvg:{"$round":["$quizAvg",1]},
         labAvg:{"$round":["$labAvg",1]},
         examAvg:{"$round":["$quizAvg",1]} }},
      {"$group":{
        _id:{},
        mediaQuiz:{$avg:"$quizAvg"}, 
        mediaLab:{$avg:"$labAvg"},
        mediaExam:{$avg:"$examAvg"} }},
      {"$project":{
        "mediaQuiz":{"$round":["$mediaQuiz",2]},
        "mediaLab":{"$round":["$mediaLab",2]},
        "mediaExam":{"$round":["$mediaExam",2]}
      }}
    ]).toArray();
    req.then(function(data){
        console.log("Query 7:" , data);
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

/*query 8--Supponendo di avere una collezione di studenti dove, per ogni studente è riportato un array
enumerativo con l‟elenco dei suoi voti, individuare nome e codice del secondo studente femmina
con la media più alta*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let regex = new RegExp("F", "i");
    let req=collection.aggregate([
      {"$match":{"genere":{"$regex":regex}}},
      {"$project":{"nome":1,"media":{"$avg":"$voti"}}},
      {"$sort":{"media":-1}},
      {"$skip":1},
      {"$limit":1}
    
    ]).toArray();
    req.then(function(data){
        console.log("Query 7:" , data);
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

//query 9--operatore $unwind

//query 10-- Operatore $expr