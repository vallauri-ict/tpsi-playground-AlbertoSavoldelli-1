
let _http = require("http");
let _url = require("url");
let _colors=require("colors");
let HEADERS = require("./headers.json") // /. rappresenta la cartella corrente

let port = 1337;

let server=_http.createServer(function (req, res) {
    /*
    PRIMA PROVA 
    res.writeHead(200, HEADERS.text);
    res.write("richiesta eseguita correttamente");
    res.end();
    console.log("richiesta eseguita");*/
    let metodo= req.method;
    //parsing della url ricevuta
    let url=_url.parse(req.url,true)//con il true parsifica anche i parametri, sennò parsificherebbe solo la stringa
    let risorsa= url.pathname;
    let parametri=url.query;
    let dominio=req.headers.host;
    res.writeHead(200,HEADERS.html);
    res.write("<h1> Informazioni relative alla richiesta ricevuta </h1>");
    res.write("</br>");
    res.write(`<p><b>Risorsa richiesta: </b> ${risorsa} </p>`);
    res.write(`<p><b>Metodo: </b> ${metodo} </p>`);
    res.write(`<p><b>Parametri: </b> ${JSON.stringify(parametri)} </p>`);
    res.write(`<p><b>Dominio: </b> ${dominio} </p>`);
    res.write("<p>Grazie per la richiesta</p>")
    res.end();
    console.log("Grazie per la richiesta "+req.url.yellow);

    
	
});
// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);
console.log("server in ascolto sulla porta " + port);