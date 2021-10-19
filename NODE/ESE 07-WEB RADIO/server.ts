import * as _http from "http";
import { json } from "stream/consumers";
import HEADERS from "./headers.json";
import {Dispatcher} from "./dispatcher";
import states from "./states.json";
import radios from "./radios.json";
import * as _fs from "fs";
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
    res.write(JSON.stringify(states));
    res.end();
})

dispatcher.addListener("POST","/api/radios",function(req,res){
    let regione=req["BODY"].regione;
    let radioRegione=[];
    if(regione!="tutti"){
        for (const radio of radios) {
            if(radio.state==regione){
                radioRegione.push(radio)
            }
        }
    }
    else{
        for (const radio of radios) {
                radioRegione.push(radio)
        }
    }
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(radioRegione));
    res.end();
})

dispatcher.addListener("POST","/api/like",function(req,res){
    let idLike=req["BODY"].id;
    for (const radio of radios) {
        if(radio.id==idLike){
            let nLike = parseInt(radio.votes);
            nLike++;
            radio.votes = nLike.toString();
            _fs.writeFile("./radios.json",JSON.stringify(radios),function(err){
                if(err){
                    res.writeHead(404, HEADERS.text);
                    res.write(err);
                }
                else{
                    res.writeHead(200, HEADERS.json);
                    res.write(JSON.stringify(radio.votes));
                }
                res.end();
            })
            break;
        }
    }
})