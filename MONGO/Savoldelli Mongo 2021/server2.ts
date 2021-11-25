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
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
"Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
"m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]

/*Query 2 - Visualizzare i facts che appartengono alla categoria music oppure che presentano uno score maggiore di
620. Visualizzare _id, categories e score*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("facts");
      collection.find({"$or":[{"categories":"music"},{"score":{"$gt":620}}]})
      .project({"_id":1,"categories":1,"score":1}).toArray(function(err,data){
          if(!err){
              console.log("Query 2",data);
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

/*Query 3*/
mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db=client.db(DBNAME);
        let collection=db.collection("facts");
        let stringId="";
        for(let i=0;i<22;i++){
          let num=generaNumero(0,base64Chars.length);
          stringId+=base64Chars[num];
        }
        let newRecord={"created_at":new Date(),
        "icon_url":"https://assets.chucknorris.host/img/avatar/chuck-norris.png",
        "updated_at":new Date(),
        "score":0,
        "_id":stringId as any,
        "url":("https://api.chucknorris.io/jokes/"+stringId),
        "value":"I'm inserting a new chuck norris's fact"
      }
        collection.insertOne(newRecord,function(err,data){
            if(!err){
                console.log("INSERT query 3",data);
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
function generaNumero(a, b){
  return Math.floor((b - a + 1) * Math.random()) + a;
}

/*Query 4 - Cancellare tutti i facts creati successivamente al 15 novembre 2021 e con score = 0*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("facts");
      collection.deleteMany({"$and":[{"created_at":{"$gte":"2021-11-15"}},{"score":0}]},function(err,data){
          if(!err){
              console.log("DELETE Query 4",data);
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

/*Query 5 - Visualizzare, per ogni singola categoria, la media degli score di tutti i facts che trattano quella categoria.
Ordinare i risultati sulla base della mediaScore decrescente e, in caso di eventuale parità, ordinare sul nome
crescente della categoria Le mediaScore devono essere arrotondate a due cifre dopo la virgola*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("facts");
    let req=collection.aggregate([
      {"$unwind":"$categories"},
      {"$group":{"_id":"$categories","mediaScore":{"$avg":"$score"}}},
      {"$project":{"categories":1,"mediaScore":{"$round":["$mediaScore",2]}}},
      {"$sort":{"mediaScore":-1,"categories": 1}}
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

/*Query 6A - Visualizzare l’elenco delle categorie contenute nel database, ogni categoria riportata una sola volta*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("facts");
      collection.distinct("categories",function(err,data){
          if(!err){
              console.log("Query 6a",data);
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