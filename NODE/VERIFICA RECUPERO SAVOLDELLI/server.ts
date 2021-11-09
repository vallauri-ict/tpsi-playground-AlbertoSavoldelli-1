import * as _http from "http";
import { json } from "stream/consumers";
import HEADERS from "./headers.json";
import _strage from "./strage.json";
import {Dispatcher} from "./dispatcher";
let port:number=1337;
let dispatcher:Dispatcher=new Dispatcher();
let server=_http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta "+port);

//registrazione dei servizi
dispatcher.addListener("GET","/api/argomenti",function(req,res){
    res.writeHead(200,HEADERS.json);
    let vetArg=[];
    for (const argoment of _strage) {
        vetArg.push(argoment.argomento);
    }
    res.write(JSON.stringify(vetArg));
    res.end();
})

dispatcher.addListener("GET","/api/domande",function(req,res){
    let argSelected=req["GET"].arg;
    res.writeHead(200,HEADERS.json);
    let vetIdDoma=[];
    let vetIDselect=[];
    let last=0;
    let i=0;
    let json=[];
    for (const sezione of _strage) {
        if(argSelected==sezione.argomento){
            for (const domanda of sezione.domande) {
                vetIdDoma.push(domanda.id);
                last=domanda.id;
            }
            do{
                let num= generaNumero(vetIdDoma[0],last);
                if(!vetIDselect.includes(num)){
                    vetIDselect.push(num);
                }
            }while(vetIDselect.length!=7)
            console.log(vetIDselect);
            for(let i=0;i<vetIDselect.length;i++){
                for (const domanda of sezione.domande) {
                    if(domanda.id==vetIDselect[i]){
                        let jsonDomanda={'id':domanda.id,'domanda':domanda.domanda};
                        json.push(jsonDomanda);
                    }
                }
            }
        }
    }
    res.write(JSON.stringify(json));
    res.end();
   
})
function generaNumero(a, b){
	return Math.floor((b - a + 1) * Math.random()) + a;
}

dispatcher.addListener("POST","/api/risposte",function(req,res){
    let vetId=req["BODY"].risposte;
    res.writeHead(200,HEADERS.json);
            res.write(JSON.stringify({"ris":"ok"}));
            res.end();
    
})