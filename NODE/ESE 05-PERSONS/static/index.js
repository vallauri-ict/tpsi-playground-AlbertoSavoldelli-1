"use strict"
$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");
    _divDettagli.hide()
    let requestNazioni=inviaRichiesta("GET","/api/nazioni");
    requestNazioni.fail(errore);
    requestNazioni.done(function(data){
        console.log(data);
        for(let i=0;i<data.nazioni.length;i++){
            $('<a>',{
                'class':'dropdown-item',
                'href':'#',
                'text':data.nazioni[i],
                'click':visualizzaPersone
            }).appendTo(_lstNazioni);
        }
    });

    function visualizzaPersone(){
        let nation=$(this).text();
        console.log(nation);
        let requestPersone=inviaRichiesta("GET","/api/persone",{"nazione":nation});
        requestPersone.fail(errore);
        requestPersone.done(function(persons){
            console.log(persons);
            _tabStudenti.empty();
            for(const person of persons){
                let tr=$("<tr>").appendTo(_tabStudenti);
                for (const key in person) {
                    $("<td>").appendTo(tr).html(person[key]);
                }
                let td=$("<td>").appendTo(tr)
                $("<button>").appendTo(td).text("Dettagli");
                td=$("<td>").appendTo(tr)
                $("<button>").appendTo(td).text("Elimina");
            }
        })
    }
 
 
 
 
})