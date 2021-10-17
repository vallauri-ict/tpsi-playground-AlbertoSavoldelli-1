import * as _http from "http";
import { json } from "stream/consumers";
import {HEADERS} from "./headers";
import {Dispatcher} from "./dispatcher";
import {notizie} from "./notizie";
import * as _fs from "fs";
import * as _mime from "mime";
let port:number=1337;

let dispatcher:Dispatcher=new Dispatcher();

let server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);

//*******************************************
//*****REGISTRAZIONE DEI SERVIZI*****
dispatcher.addListener("GET","/api/elenco",function(req,res){
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(notizie));
    res.end();
})

dispatcher.addListener("POST","/api/dettagli",function(req,res){
   let fileName="./news/"+req["BODY"].notizia;
   console.log(fileName);
   _fs.readFile(fileName,function(error,data){
    if(!error){
        for (let i = 0; i < notizie.length; i++) {
            if (notizie[i].file == req["BODY"].notizia) {
                notizie[i].visualizzazioni+=1;
                break;
            }
        }
        let header={ "Content-Type": _mime.getType(fileName)};
        res.writeHead(200,header);
        res.write(JSON.stringify({ "file": `${data}` }));
        res.end();
    }
    else
    {
        res.writeHead(404,HEADERS.html);
        res.write("File non trovato");
        res.end();
    }
    })

})