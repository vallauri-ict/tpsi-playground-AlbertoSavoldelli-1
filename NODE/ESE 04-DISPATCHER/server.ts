import * as _http from "http";
import { json } from "stream/consumers";
let HEADERS=require("./headers.json");
let dispatcher=require("./dispatcher.ts");
let port:number=1337;
let server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);

//registrazione dei servizi
dispatcher.addListener("POST","/api/servizio1",function(req,res){
    res.writeHead(200,HEADERS.json);
    //quando c'è solo una write si può mettere nell'end
    res.write(JSON.stringify({"ris":"ok"}))
    res.end();
})