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

/*Query 1 - Trovare gli unicorni che hanno un peso compreso tra 700 e 800*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"weight":{"$gte":700,"$lte":800}}).toArray(function(err,data){
          if(!err){
              console.log("Query 1",data);
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

/*Query 2 - Trovare gli unicorni di genere maschile che amano l’uva e che hanno ucciso più di 60 vampiri*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"$and":[{"gender":'m'},{"loves":"grape"},{"vampires":{"$gt":60}}]}).toArray(function(err,data){
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

/*Query 3 - Trovare gli unicorni di genere femminile o che pesano meno di 700 kg*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"$or":[{"gender":'f'},{"weight":{"$lt":700}}]}).toArray(function(err,data){
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

/*Query 4 - Trovare gli unicorni che amano (l’uva o le mele) e che hanno ucciso più di 60 vampiri*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"$and":[{"loves":{"$in":["grape","apple"]}},{"vampires":{"$gt":60}}]}).toArray(function(err,data){
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

/*Query 5 - Trovare gli unicorni che amano (l’uva e il watermelon) e che hanno ucciso più di 60 vampiri*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"$and":[{"loves":{"$all":["grape","watermelon"]}},{"vampires":{"$gt":60}}]}).toArray(function(err,data){
          if(!err){
              console.log("Query 5",data);
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

/*Query 6 - Trovare gli unicorni che hanno il pelo marrone oppure grigio*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"$or":[{"hair":"grey"},{"hair":"brown"}]}).toArray(function(err,data){
          if(!err){
              console.log("Query 6",data);
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

/*Query 7 - Trovare gli unicorni non vaccinati*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"$and":[{"vaccinated":{"$exists":true}},{"vaccinated":false}]}).toArray(function(err,data){
          if(!err){
              console.log("Query 7",data);
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

/*Query 8 - Trovare gli unicorni maschi che NON amano le mele*/
// mongoClient.connect(CONNSTRING,function(err,client){
//   if(!err){
//       let db = client.db(DBNAME);
//       let collection = db.collection("unicorns");
//       collection.find({"loves":{"$not":"apple"}}).toArray(function(err,data){
//           if(!err){
//               console.log("Query 8",data);
//           }
//           else{
//               console.log("Errore esecuzione query " + err.message);
//           }
//           client.close();
//       });
//   }
//   else{
//       console.log("Errore nella connessione al DB " + err.message);
//   }
// });

/*Query 9 - Trovare gli unicorni di genere femminile il cui nome inizia con la lettera A*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      let regex = new RegExp("^A","i")
      collection.find({$and:[{name:regex},{gender:"f"}]}).toArray(function(err,data){
          if(!err){
              console.log("Query 9",data);
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

/*Query 10 - Trovare un unicorno sulla base dell’ID*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.find({_id:new _mongodb.ObjectId("61823943699b9dda310fd39e")}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 10: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

/*Query 11A - Visualizzare nome e vampiri uccisi per tutti gli unicorni di genere maschile*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"gender":"m"}).project({"name":1,"vampires":1}).toArray(function(err,data){
          if(!err){
              console.log("Query 11 A",data);
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

/*Query 11 B - Visualizzare i dati precedenti in modo ordinato sul n. decrescente di vampiri uccisi*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"gender":"m"}).project({"name":1,"vampires":1}).sort({name: 1, vampires: -1}).toArray(function(err,data){
          if(!err){
              console.log("Query 11 B",data);
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

/*Query 11 C - Rispetto al recordset precedente, visualizzare soltanto i primi 3 record*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"gender":"m"}).project({"name":1,"vampires":1}).sort({name: 1, vampires: -1}).limit(3).toArray(function(err,data){
          if(!err){
              console.log("Query 11 B",data);
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

/*Query 12 - Contare il numero di vampiri che pesano più di 500 kg*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.find({"weight":{"$gt":500}}).count(function(err,data){
          if(!err){
              console.log("Query 12 : Ci sono "+data+" unicorni che pesano più di 500kg");
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

/*Query 13 - Visualizzare peso e pelo dell’unicorno Aurora (findOne)*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.findOne({name:"Aurora"},{projection:{weight:1,hair:1}},function(err,data){
          if(!err){
              console.log("Query 13",data);
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

/*Query 14 - Visualizzare i frutti amati dagli unicorni di genere femminile (ogni frutto una sola volta)*/
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection("unicorns");
      collection.distinct("loves",{"gender":"f"},function(err,data){
          if(!err){
              console.log("Query 14",data);
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

/*Query 15 - Inserire un nuovo unicorno e, al termine dell’inserimento, cancellarlo nella stessa query*/
mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.insertOne({"name":"Alberto","gender":"m","loves":["apple","lemon"]},function(err,data){
            if(!err){
                console.log("Query 15 insert",data);
                collection.deleteMany({"name":"Alberto"},function(err,data){
                    if(!err)
                    {
                        console.log("Query 15 delete",data);
                    }
                    else
                    {
                        console.log("Errore esecuzione query " + err.message);
                    }
                    client.close();
                });
            }
            else{
                console.log("Errore esecuzione query " + err.message);
            }
        });
    }
    else{
        console.log("Errore nella connessione al DB " + err.message);
    }
  });

  /*Query 16 - Incrementare di 1 il numero dei vampiri uccisi da Pilot*/
  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateOne({"name":"Pilot"},{"$inc":{"vampires":1}},function(err,data){
            if(!err){
                console.log("Query 16",data);
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

  /*Query 17 - Aggiungere che l’unicorno Aurora ama anche le carote ed il suo peso è aumentato di 10kg*/
  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateOne({"name":"Aurora"},{"$addToSet":{"loves":"carrot"},"$inc":{"weight":10}},function(err,data){
            if(!err){
                console.log("Query 17",data);
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
  /*Query 18- Incrementare di 1 il numero di vampiri uccisi dall’unicorno Pluto. Se il record non esiste crearlo*/
  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateOne({"name":"Pluto"},{"$inc":{"vampires":1}},{"upsert":true},function(err,data){
            if(!err){
                console.log("Query 18",data);
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

  /*Query 19 - Aggiungere il campo vaccinated=false a tutti gli unicorni che non dispongono del campo vaccinated*/
  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateMany({vaccinated:{"$exists":false}},{"$set":{"vaccinated":true}},function(err,data){
            if(!err){
                console.log("Query 19",data);
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

  /*Query 20 - Rimuovere gli unicorni che amano sia l’uva sia le carote*/
  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.deleteMany({"loves":{"$all":["carrot","grape"]}},function(err,data){
            if(!err){
                console.log("Query 20",data);
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

  /*Query 21 - Trovare l’unicorno femmina che ha ucciso il maggior numero di vampiri.
Restituire nome e numero di vampiri uccisi*/
mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"gender":"f"}).sort({"vampires":-1}).limit(1).project({"name":1,"vampires":1}).toArray(function(err,data){
            if(!err){
                console.log("Query 21",data);
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

  /*Query 22 - Sostituire completamente il record dell’unicorno Pluto con un nuovo record*/
  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.replaceOne({"name":"Pluto"},{"name":"Aldo","residenza":"Fossano","loves":["grape"]},{"upsert":true},function(err,data){
            if(!err)
            {
                console.log("Query 22",data);
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