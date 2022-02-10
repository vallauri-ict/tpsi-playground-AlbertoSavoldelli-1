import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import * as mongodb from "mongodb";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import ENVIRONMENT from "./environment.json";
import cloudinary, { UploadApiResponse } from "cloudinary";
import { execPath } from "process";
import { url } from "inspector";
cloudinary.v2.config({
  cloud_name: ENVIRONMENT.CLOUD_NAME,
  api_key: ENVIRONMENT.API_KEY,
  api_secret: ENVIRONMENT.API_SECRET
 });

const mongoClient = mongodb.MongoClient;
const CONNSTRING = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.hdanb.mongodb.net/5B?retryWrites=true&w=majority"  // heroku app
/*
const CONNECTION_STRING =
  "mongodb://admin:admin@cluster0-shard-00-00.zarz7.mongodb.net:27017,cluster0-shard-00-01.zarz7.mongodb.net:27017,cluster0-shard-00-02.zarz7.mongodb.net:27017/test?replicaSet=atlas-bgntwo-shard-0&ssl=true&authSource=admin";
*/
const DB_NAME = "5B";


let port : number = parseInt(process.env.PORT) || 1337;
let app = express();

let server = http.createServer(app);

server.listen(port,function(){
    console.log("Server in ascolto sulla porta " + port)
    
    init();
});
const whitelist = [
  "https://savoldelli-alberto-crud-server.herokuapp.com/",
  "http://savoldelli-alberto-crud-server.herokuapp.com/",
 "http://localhost:1337",
 "http://localhost:4200"
];


let paginaErrore="";
function init(){
    fs.readFile("./static/error.html",function(err, data){
        if(!err){
            paginaErrore = data.toString();
        }
        else{
            paginaErrore = "<h2>Risorsa non trovata</h2>";
        }
    });
}


//****************************************************************
//elenco delle routes di tipo middleware
//****************************************************************
// 1.log 
app.use("/",function(req, res, next){
    console.log("---->" + req.method + ":"+ req.originalUrl);
    next();
});

// 2.static route
//il next lo fa automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3.route lettura parametri post con impostazione dei limiti immagini base64
app.use("/", body_parser.json({"limit":"10mb"}));
app.use("/", body_parser.urlencoded({"extended":true,"limit":"10mb"}));

// 4.log parametri
app.use("/", function(req, res, next){
    if(Object.keys(req.query).length > 0){
        console.log("Parametri GET: ",req.query);
    }
    if(Object.keys(req.body).length > 0){
        console.log("Parametri BODY: ",req.body);
    }
    next();
})

//5.Cors
const corsOptions = {
  origin: function(origin, callback) {
  if (!origin)
   return callback(null, true);
  if (whitelist.indexOf(origin) === -1) {
   var msg = 'The CORS policy for this site does not ' +
   'allow access from the specified Origin.';
   return callback(new Error(msg), false);
  }
  else
   return callback(null, true);
  },
  credentials: true
 };
 app.use("/", cors(corsOptions) as any);

// 6. fileUpload: gestione dimensione massima dei file da caricare
app.use(fileUpload({
  "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));

//7. Base64 upload(limitazione dimensione parametri post)
app.use("/",express.json({"limit":"10mb"}));

// **********************************************************************
// Elenco delle routes di risposta al client
// **********************************************************************
// middleware di apertura della connessione
app.use("/",function(req,res,next){
  mongoClient.connect(CONNSTRING,function(err,client){
      if(err){
          res.status(503).send("Errore nella connessione al DB");
      }
      else{
          console.log(">>>>>> Connected succesfully");
          req["client"] = client;
          next();
      }
  });
});


// listener specifici
app.get("/api/images",function(req,res,next){
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("images");
  let request = collection.find().toArray();
  request.then(function(data){
      res.send(data);
  });
  request.catch(function(err){
      res.status(503).send("Errore esecuzione query");
  })
  request.finally(function(){
      req["client"].close();
  })
});

app.post("/api/uploadBinary",function(req,res,next){
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("images");
  if (!req.files || Object.keys(req.files).length == 0) 
      res.status(400).send('Username o immagine mancante');
  else
  {
      let _file = req.files.img as fileUpload.UploadedFile;
      _file.mv('./static/img/' + _file["name"], function(err) {
          if (err)
              res.status(500).json(err.message);
          else
          {
            let db = req["client"].db(DB_NAME);
            let collection = db.collection("images");
              let user = {
                  "username": req["body"].username,
                  "img": _file.name
              }
              let request = collection.insertOne(user);
              request.then(function(data){
                  res.send(data);
              });
              request.catch(function(err){
                  res.status(503).send("Errore esecuzione query");
              })
              request.finally(function(){
                  req["client"].close();
              })
          }
      })
  }
});

app.post("/api/uploadBase64",function(req,res,next){
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("images");
  let request = collection.insertOne(req.body);
  request.then(function(data){
      res.send(data);
  });
  request.catch(function(err){
      res.status(503).send("Errore esecuzione query");
  })
  request.finally(function(){
      req["client"].close();
  })
});

app.post("/api/cloudinaryBase64", function(req, res, next){
  cloudinary.v2.uploader.upload(req.body.image)
  .catch((error) => {
    res.status(500).send("error uploading file to cloudinary")
  })
  .then((result:UploadApiResponse) => {
    // res.send({"url":result.secure_url})
    let db = req["client"].db(DB_NAME);
    let collection = db.collection("images");
    let user = {
      "username": req.body.username,
      "img": result.secure_url
    }
    let request = collection.insertOne(user);
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(500).send("Errore esecuzione query");
    })
    request.finally(function(){
        req["client"].close();
    })
  })
 })

 app.post("/api/cloudinaryBinary", (req, res, next) => {
    if (!req.files || Object.keys(req.files).length == 0 || !req.body.username) 
    {
      res.status(400).send("No files were uploaded");
    } 
    else {
      let file = req.files.img as fileUpload.UploadedFile;
      let path = './static/img/' + file["name"];
      file.mv(path, function (err) {
        if (err){
          res.status(500).json(err.message);
        }
        else {
          cloudinary.v2.uploader.upload(path, { folder: "5binf/Ese_03 Upload", use_filename: true }) //il primo è il path dove leggere l immagine 
          .catch((error) => {
            res.status(500).send("error uploading file to cloudinary")
          })
          .then((result: UploadApiResponse) => {
            //res.send({"url":result.secure_url})
            let db = req["client"].db(DB_NAME);
            let collection = db.collection("images");
            let user = {
              "username": req.body.username,
              "img": result.secure_url
            }
            let request = collection.insertOne(user);
            request.then((data) => {
              res.send(data);
            });
            request.catch((err) => {
              res.status(503).send("Sintax error in the query");
            });
            request.finally(() => {
              req["client"].close();
            });
          })
        }
      })
    }
  })

// **********************************************************************
// Default route (risorsa non trovata) e route di gestione degli errori 
// **********************************************************************
app.use("/", function (req, res, next) {
    res.status(404);
    res.send("Risorsa non trovata");
});
app.use("/", function (req, res, next) {
  res.status(404);
  if(req.originalUrl.startsWith("/api/")){
      res.send("Risorsa non trovata");
  }
  else{
      res.send(paginaErrore);
  }
});

app.use(function(err, req, res, next) {
  console.log("*************** ERRORE CODICE SERVER",err.message, "***************");
});




