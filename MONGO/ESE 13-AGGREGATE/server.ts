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
      {"$group":{_id:{},"media":{$avg:"$vampires"}}},
      {"$project":{"_id":0,"ris":{"$round":"$media"}}}
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
      /*le funzioni di aggregazione usate dentro project laorano sui campi del singolo record*/
      {"$project":{
        "quizAvg": { $avg: "$quizzes"},
        "labAvg": { $avg: "$labs" },
        "examAvg": { $avg: ["$midterm","$final"] } }
      },
      {"$project":
      {"quizAvg":{"$round":["$quizAvg",1]},
      "labAvg":{"$round":["$labAvg",1]},
      "examAvg":{"$round":["$examAvg",1]}
      }},
      {"$group":{
        "_id":{},
        "mediaQuiz":{$avg:"$quizAvg"},
        "mediaLab":{$avg:"$labAvg"},
        "mediaExam":{$avg:"$examAvg"}
       }},
      {"$project":{
        "mediaQuiz":{"$round":["$mediaQuiz",1]},
        "mediaLab":{"$round":["$mediaLab",1]},
        "mediaExam":{"$round":["$mediaExam",1]}
      }},
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
  let regex=new RegExp("F","i");
  let req=collection.aggregate([
    {"$match":{"genere":{"$regex":regex}}},
    {"$project":{"nome":1,"mediaVoti":{"$avg":"$voti"}}},
    {"$sort":{"mediaVoti":-1}},
    {"$skip":1},
    {"$limit":1}
  ]).toArray();
  req.then(function(data){
      console.log("Query 8:" , data);
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
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("orders");
    let regex=new RegExp("F","i");
    let req=collection.aggregate([
      {"$project":{"status":1,"nDettagli":1}},
      {"$unwind":"$nDettagli"},
      {"$group":{"_id":"$status","sommaDettagli":{"$sum":"$nDettagli"}}}
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

//query 10-- Operatore $expr
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let regex=new RegExp("F","i");
    let req=collection.find({"$expr":{"$gte":[{"$year":"$nato"},2000]}}).toArray();
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