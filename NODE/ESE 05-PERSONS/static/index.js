"use strict"
$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");
    let selectedNation;
    _divDettagli.hide();
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
        if($(this).text()){
            selectedNation=$(this).text();
        }
        let nation=$(this).text();
        console.log(nation);
        let requestPersone=inviaRichiesta("GET","/api/persone",{"nazione":selectedNation});
        requestPersone.fail(errore);
        requestPersone.done(function(persons){
            console.log(persons);
            _tabStudenti.empty();
            _divDettagli.hide();
            for(const person of persons){
                let tr=$("<tr>").appendTo(_tabStudenti);
                for (const key in person) {
                    $("<td>").appendTo(tr).html(person[key]);
                }
                let td=$("<td>").appendTo(tr)
                $("<button>").appendTo(td).text("Dettagli").on("click",dettagli).prop("name",person.name);
                td=$("<td>").appendTo(tr)
                /*$("<button>").appendTo(td).text("Elimina")*/;
                /*Posso usare la classe oppure uno pseudoselettore*/
                $("<button>").appendTo(td).text("Elimina").addClass("elimina").prop("name",person.name);
            }
        });

    }
 
    /*_tabStudenti.on("click","button:contains(elimina)",function(){

    })*/
    _tabStudenti.on("click","button.elimina",function(){
        let requestElimina=inviaRichiesta("DELETE","/api/elimina",{"person":$(this).prop("name")});
        requestElimina.fail(errore);
        requestElimina.done(function(message){
            alert(message);
            visualizzaPersone();
        })
    })

    function dettagli(){
        /*Uso patch solo per provare ma andrebbe usato get in genere*/
        let requestDettagli=inviaRichiesta("PATCH","/api/dettagli",{"person":$(this).prop("name")});
        let name=$(this).prop("name");
        requestDettagli.fail(errore);
        requestDettagli.done(function(person){
            console.log(person);
            _divDettagli.show(1000);
            $(".card-img-top").prop('src',person.picture.thumbnail);
            $(".card-title").html(name);
            let s=`<b>gender:</b>${person.gender}</br>`;
            s+=`<b>address:</b>${JSON.stringify(person.location)}</br>`;
            s+=`<b>email:</b>${person.email}</br>`;
            s+=`<b>address:</b>${JSON.stringify(person.dob)}</br>`;
            $(".card-text").html(s);
        })
            
    }
 
 
})