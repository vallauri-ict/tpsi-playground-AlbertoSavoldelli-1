import * as _http from "http";
import { json } from "stream/consumers";
let HEADERS=require("./headers.json");
let dispatcher=require("./dispatcher.ts");
let persons=require("./persons.json");
let port:number=1337;
let server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);

//*******************************************
//*****REGISTRAZIONE DEI SERVIZI*****
dispatcher.addListener("GET","/api/nazioni",function(req,res){
    res.writeHead(200,HEADERS.json);
    let nazioni=[];
    for (const person of persons["results"]) {
        if(!nazioni.includes(person.location.country)){
            nazioni.push(person.location.country)
        }
    }
    nazioni.sort();//li ordina in automatico con .sort()
    res.write(JSON.stringify({"nazioni":nazioni}));
    res.end();
})