import * as _http from "http";
import { json } from "stream/consumers";
import {HEADERS} from "./headers";
import {Dispatcher} from "./dispatcher";
import {persons} from "./persons";
let port:number=1337;

let dispatcher:Dispatcher=new Dispatcher();

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

dispatcher.addListener("GET","/api/persone",function(req,res){
    let nazione:string=req["GET"].nazione;
    let vetPersons:object[]=[];
    for (const person of persons.results) {
        if(person.location.country==nazione){
            let jsonPerson:object={
                "name":person.name.title+" "+person.name.first+" "+person.name.last,
                "city":person.location.city,
                "state":person.location.state,
                "cell":person.cell
            };
            vetPersons.push(jsonPerson);
        }
    }
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(vetPersons));
    res.end();
})

dispatcher.addListener("PATCH","/api/dettagli",function(req,res){
    /*parametri di get sono in req["GET"] tutti gli altri sono in req["BODY"]*/
    let personReq=req["BODY"].person;
    let trovato=false;
    let person;
    for (person of persons.results) {
        if((person.name.title+" "+person.name.first+" "+person.name.last)==personReq){
            trovato=true;
            break;
        }
    }
    if(trovato){
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify(person));
        res.end();
    }
    else{
        res.writeHead(404,HEADERS.text);
        res.write("Persona non trovata");
        res.end();
    }
})

dispatcher.addListener("DELETE","/api/elimina",function(req,res){
    let personReq=req["BODY"].person;
    let trovato=false;
    let i;
    for (i=0;i<persons.results.length;i++) {
        if((persons.results[i].name.title+" "+persons.results[i].name.first+" "+persons.results[i].name.last)==personReq){
            trovato=true;
            break;
        }
    }
    if(trovato){
        persons.results.splice(i,1);
        /*Con 200 devo sempre ritornare HEADERS.json*/
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify("Eliminato correttamente"));
        res.end();
    }
    else{
        res.writeHead(404,HEADERS.text);
        res.write("Persona non trovata");
        res.end();
    }
})