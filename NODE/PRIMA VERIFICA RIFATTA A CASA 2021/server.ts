"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()

import HEADERS from "./headers.json"
import facts from "./facts.json";


/* ********************** */

// const categories = []
const categories = ["career","money","explicit","history","celebrity","dev","fashion","food","movie","music","political","religion","science","sport","animal","travel"]

const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]


let port:number=1337;
let server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);
//*******************************************
//*****REGISTRAZIONE DEI SERVIZI*****
dispatcher.addListener("GET","/api/categories",function(req,res){
    res.writeHead(200,HEADERS.json);
    let vetCate=[];
    for (const fact of facts["facts"]) {
        for (const cat of fact["categories"]) {
            if(!vetCate.includes(cat)){
                console.log(cat);
                vetCate.push(cat)
            }
        }
       
    }
    res.write(JSON.stringify(vetCate));
    res.end();
})
dispatcher.addListener("GET","/api/facts",function(req,res){
    let category=req["GET"].category
    res.writeHead(200,HEADERS.json);
    let vetFacts=[];
    for (const fact of facts["facts"]) {
        if(fact["categories"].includes(category)){
            vetFacts.push(fact);
        }
       
    }
    vetFacts.sort();
    res.write(JSON.stringify(vetFacts));
    res.end();
})
dispatcher.addListener("POST","/api/rate",function(req,res){
    let vetId=req["BODY"].vetId;
    for (const id of vetId) {
        for (const fact of facts["facts"]) {
            if(fact.id==id){
                console.log(fact.score)
                fact.score++;
                console.log(fact.score)
            }
           
        }
    }
    _fs.writeFile("./facts.json",JSON.stringify(facts),function(err){
        if(err){
            res.writeHead(404, HEADERS.text);
            res.write(err);
        }
        else
        {
            res.writeHead(200,HEADERS.json);
            res.write(JSON.stringify({"ris":"ok"}));
            res.end();
        }
    })
})
dispatcher.addListener("POST","/api/add",function(req,res){
    let category = req["BODY"].category;
    let value = req["BODY"].value;
    var date = new Date().toString();
    let json = {
        "categories": [category],
        "created_at":date,
        "icon_url": icon_url,
        "id":1,
        "updated_at":date,
        "url":api_url,
        "value":value,
        "score":0
    }
    // facts.facts.push(json)

    _fs.writeFile("./facts.json", JSON.stringify(facts),function(err) {
            if (err)
            {
                res.writeHead(404, HEADERS.text);
                res.write(err); 
                res.end();
            }
            else
            {
                res.writeHead(200, HEADERS.text);
                res.write(JSON.stringify({"ris":"ok"}));
                res.end();
            }
      });
})

