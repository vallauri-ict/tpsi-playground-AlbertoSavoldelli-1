"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()

import HEADERS from "./headers.json"
import facts from "./facts.json";

let port:number=1337;
let server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);

/* ********************** */

// const categories = []
const categories = ["career","money","explicit","history","celebrity","dev","fashion","food","movie","music","political","religion","science","sport","animal","travel"]

const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]


//*******************************************
//*****REGISTRAZIONE DEI SERVIZI*****
dispatcher.addListener("GET","/api/categories",function(req,res){
    let vetCategories=[];
    for (const categories of facts["facts"]) {
        for(let i=0;i<(categories["categories"].length);i++){
            if(!vetCategories.includes(categories["categories"][i])){
                vetCategories.push(categories["categories"][i])
            }
        }
        
    }
    categories.sort();
    res.write(JSON.stringify({"categories":vetCategories}));
    res.end();
})

dispatcher.addListener("GET","/api/facts",function(req,res){
    let category=req["GET"].category;
    let vetFacts:object[]=[];
    //console.log(category)
    for (const categories of facts["facts"]){
        if(categories["categories"].includes(category)){
            //console.log(categories["categories"])
            let jsonFacts:object={
                "created_at":categories["created_at"],
                "icon_url":categories["icon_url"],
                "id":categories["id"],
                "updated_at":categories["updated_at"],
                "url":categories["url"],
                "value":categories["value"],
                "score":categories["score"]
            };
            vetFacts.push(jsonFacts);
        }
    }
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(vetFacts));
    res.end();
})



