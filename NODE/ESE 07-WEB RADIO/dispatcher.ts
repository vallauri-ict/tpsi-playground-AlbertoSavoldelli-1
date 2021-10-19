import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import * as _querystring from "query-string";
import HEADERS from "./headers.json";
let paginaErrore:string;

export class Dispatcher{
    prompt:string=">>>";
    //ogni listener è costituito da un json del tipo
    //{"risorsa":"callback"}
    //i listeners sono suddivisi in base al tipo di chiamata
    listeners:any={
        "GET":{},
        "POST":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{}
    }
    constructor(){
        init();
    }

    addListener(metodo:string,risorsa:string,callback:any){
        metodo=metodo.toLocaleUpperCase();
        /*if(this.listeners[metodo]){

        }*/
        if(metodo in this.listeners){
            this.listeners[metodo][risorsa]=callback;
        }
        else{
          throw new Error("metodo non valido");
        }
    }
    dispatch(req,res){
        let metodo=req.method.toUpperCase();
        if(metodo=="GET"){
            this.innerDispatch(req,res);
        }
        else{
            let parametriBody:string="";
            req.on("data",function(data){
                parametriBody+=data;
            })
            let parametriJson={};
            let _this=this;//salvo il puntatore alla classe in una variabile
            req.on("end",function(){
                //se i parametri sono json la conversione va a buon fine
                //altrimenti sono URL-ENCODED
                try{
                    parametriJson=JSON.parse(parametriBody);
                }
                catch(error){
                    parametriJson=_querystring.parse(parametriBody);
                }
                finally{
                    req["BODY"]=parametriJson;
                    _this.innerDispatch(req,res);
                }
            })
        }
    }
    innerDispatch(req,res){
        let metodo= req.method;
        let url=_url.parse(req.url,true)
        let risorsa= url.pathname;
        let parametri=url.query;
        req["GET"]=parametri;
        console.log(`${this.prompt} ${metodo}:${risorsa}:${JSON.stringify(parametri)}`)
        if(req["BODY"]){
            console.log(     `${JSON.stringify(req["BODY"])}`)
        }
        
        if(risorsa.startsWith("/api/")){
            if(risorsa in this.listeners[metodo]){
                let _callback=this.listeners[metodo][risorsa];
                _callback(req,res); //lancio in esecuzione la callback
            }
            else{
                //il client si aspetta un json
                //in caso di errore gli possiamo passare una stringa al posto del json
                res.writeHead(404,HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        }
        else{
            staticListener(req,res,risorsa);
        }
    }

}

function staticListener(req,res,risorsa){
    if(risorsa=="/"){
        risorsa="/index.html";
    }
    let fileName="./static/"+risorsa;
    _fs.readFile(fileName,function(err,data){
        if(!err){
            let type={"Content-Type":_mime.getType(fileName)};
            res.writeHead(200,type)
            res.write(data);
            res.end();
        }
        else{
            console.log(`${err.code}:${err.message}`)
            //il client si aspetta una pagina
            res.writeHead(404,HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}

function init(){
    _fs.readFile("./static/error.html",function(err,data){
        if(!err){
            paginaErrore=data.toString();
        }
        else{
            paginaErrore="<h1>Pagina non trovata</h1>";
        }
    });      
}