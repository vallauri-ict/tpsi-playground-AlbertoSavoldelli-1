"use strict";
import http from "http";
import colors from "colors";
import express from "express";
import fs from "fs";
import body_parser from "body-parser";
import * as mongodb from "mongodb";
const app = express()
const httpServer = http.createServer(app);
import {Server, Socket} from "socket.io";// import solo l‟oggetto Server
const io = new Server(httpServer);
import { json } from 'body-parser';
import fileUpload, { UploadedFile } from "express-fileupload";
import ENVIRONMENT from "./environment.json";
const mongoClient = mongodb.MongoClient;
const DB_NAME = "5B";

const PORT = 1337

httpServer.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});

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

// 3.route lettura parametri post
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({"extended":true}));

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
// 5. binary fileUpload
app.use(fileUpload({
  "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));

//****************************************************************
//elenco delle routes di risposta al client
//****************************************************************
// middleware di apertura della connessione
app.use("/api/", (req, res, next) => {
	mongoClient.connect(process.env.MONGODB_URI || ENVIRONMENT.CONNECTION_STRING, function (err, client) {
      if (err) {
        res.status(503).send("Db connection error");
      } 
	  else {
        console.log("Connection made");
        req["client"] = client;
        next();
      }
    });
  });

  // listener specifici: 
  //listener GET
  app.get("/api/elenco", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("imagesCasa");
    let request = collection.find().toArray();
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

/************************* gestione web socket ********************** */
let users = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function(clientSocket) {
	let user = {}as {username:string,socket:Socket,room:string};

	// 1) ricezione username
	clientSocket.on('login', function(userInfo) {
		userInfo=JSON.parse(userInfo)
		// controllo se user esiste già
		let item = users.find(function(item) {
			return (item.username == userInfo.username)
		})
		if (item != null) {
			clientSocket.emit("loginAck", "NOK")
		}
		else{
			user.username = userInfo.username;
			user.room=userInfo.room;
			user.socket = clientSocket;
			users.push(user);
			clientSocket.emit("loginAck", "OK")
			log('User ' + colors.yellow(user.username) +
						" (sockID=" + user.socket.id + ') connected!');
			log(user.room)
			this.join(user.room)
		}
	});

	// 2) ricezione di un messaggio	 
	clientSocket.on('message', function(msg) {
		log('User ' + colors.yellow(user.username) + 
		          " (sockID=" + user.socket.id + ') sent ' + colors.green(msg))
		// notifico a tutti i socket (mittente compreso) il messaggio ricevuto 
		let img="";
		mongoClient.connect(process.env.MONGODB_URI || ENVIRONMENT.CONNECTION_STRING, function (err, client) {
			if(!err){
				let db = client.db(DB_NAME) as mongodb.Db;
				let collection = db.collection("imagesCasa");
				let request = collection.findOne({"username":user.username});
				request.then((data) => {
					if(data==null){
						img=""
					}
					else{
						img=data.img;
					}
					let response = {
						'from': user.username,
						"img":img,
						'message': msg,
						'date': new Date()
					}
					io.to(user.room).emit('message_notify', JSON.stringify(response));
				  });
				  request.catch((err) => {
					  log("NOT FOUND")
				  });
				  request.finally(() => {
				  	client.close();
				});
				
			}
		})

		
	});

    // 3) disconnessione dell'utente
    clientSocket.on('disconnect', function() {
		// ritorna -1 se non lo trova
		let index = users.findIndex(function(item){
			return (item.username == user.username)
		})
		users.splice(index, 1)
		log(' User ' + user.username + ' disconnected!');
    });
});

// stampa i log con data e ora
function log(msg) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " +msg)
}