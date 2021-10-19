"use strict"
$(document).ready(function() {
    let _lstRegioni=$("#lstRegioni");
    let _tbody=$("#tbody");
    caricaTabella();
    let requestElenco=inviaRichiesta("GET","/api/elenco");
        requestElenco.fail(errore);
        requestElenco.done(function(regioni){
            _lstRegioni.empty();
            let opt=$("<option>").text("tutti").appendTo(_lstRegioni);
            for (const regione of regioni) {
                //console.log(regione)
                opt=$("<option>")
                opt.text(regione.name+ " [ "+regione.stationcount+" emittenti]");
                opt.val(regione.name)
                opt.appendTo(_lstRegioni);
            }
        })

    _lstRegioni.on("change",caricaTabella);
    
    function caricaTabella(){
        _tbody.empty();
        console.log(_lstRegioni.val())
        let requestRadios=inviaRichiesta("POST","/api/radios",{'regione':_lstRegioni.val()});
        requestRadios.fail(errore);
        requestRadios.done(function(radios){
            //console.log(radios)
            for (const radio of radios) {
                let tr=$("<tr>").appendTo(_tbody);

                let td=$("<td>").appendTo(tr);
                let img=$("<img>")
                img.prop("src",radio.favicon)
                img.css("width","40px");
                img.appendTo(td);
                
                td=$("<td>").text(radio.name).appendTo(tr);
                td=$("<td>").text(radio.codec).appendTo(tr);
                td=$("<td>").text(radio.bitrate).appendTo(tr);
                td=$("<td>").text(radio.votes).appendTo(tr);

                td=$("<td>").appendTo(tr);
                img=$("<img>")
                img.prop("src","./like.jpg")
                img.css("width","40px");
                img.prop("id",radio.id)
                img.on("click",like)
                img.appendTo(td);
            }
        })
    }
    function like(){
        //console.log($(this).prop("id"));
        let _this=$(this);
        let requestLike=inviaRichiesta("POST","/api/like",{'id':$(this).prop("id")});
        requestLike.fail(errore);
        requestLike.done(function(data){
            console.log(data);
            _this.parent().prev().text(data);
        })
    }
});
