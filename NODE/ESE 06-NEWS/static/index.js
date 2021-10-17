"use strict"
$(document).ready(function() {
    let _wrapper=$("#wrapper");
    let _news=$("#news");
    start();
    function start(){
        let requestElenco=inviaRichiesta("GET","/api/elenco");
        requestElenco.fail(errore);
        requestElenco.done(function(notizie){
            _wrapper.empty();
            console.log(notizie);
            for (const notizia of notizie) {
                let spanTit=$("<span>").addClass("titolo").appendTo(_wrapper);
                spanTit.text(notizia.titolo);
                let a=$("<a>").text("Leggi").appendTo(_wrapper);
                a.prop("href","#");
                a.prop("notizia",notizia.file);
                a.on("click",visualizzaDettagli)
                let spanVis=$("<span>").addClass("nVis").appendTo(_wrapper);
                spanVis.text("[visualizzato "+notizia.visualizzazioni+" volte]");
                let br=$("<br>").appendTo(_wrapper);
            }
        })
    }
   
    function visualizzaDettagli(){
        let notizia=$(this).prop("notizia");
        let requestDettagli=inviaRichiesta("POST","/api/dettagli",{'notizia':notizia});
        requestDettagli.fail(errore);
        requestDettagli.done(function(dettagli){
            console.log(dettagli.file)
            _news.html(dettagli.file)
            start();
        })
    }
})