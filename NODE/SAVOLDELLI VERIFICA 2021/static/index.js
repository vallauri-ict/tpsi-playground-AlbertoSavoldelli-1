"use strict"
$(document).ready(function() {

    let _lstCategory=$("#lstCategory");
    let _mainWrapper=$("#mainWrapper");
    let requestElenco=inviaRichiesta("GET","/api/categories");
    requestElenco.fail(errore);
    requestElenco.done(function(data){
        //console.log(data)
        for (let i=0;i<data.categories.length;i++) {
            let opt=$("<option>")
            opt.text(data.categories[i]);
            opt.val(data.categories[i])
            opt.appendTo(_lstCategory);
        }
        caricaFacts(_lstCategory.val());
    })
    function caricaFacts(category){
        _mainWrapper.empty();
        console.log(category)
        let requestFacts=inviaRichiesta("GET","/api/facts",{'category':category});
        requestFacts.fail(errore);
        requestFacts.done(function(data){
            console.log(data)
            for (const fact of data) {
                let input=$("<input type='checkbox'>").prop("value",fact.id).appendTo(_mainWrapper)
                let span=$("<span>").text(fact.value).appendTo(_mainWrapper);
                let br=$("<br>").appendTo(_mainWrapper);
            }
            let btnInvia=$("<button>").text("Invia").prop("id","btnInvia");
            btnInvia.on("click",function(){
                let requestFacts=inviaRichiesta("POST","/api/rate");
                requestFacts.fail(errore);
                requestFacts.done(function(data){})
            })
            btnInvia.appendTo(_mainWrapper);
        })

    }
    /* per l'on change faccio così senno aggiornava subito e data val==null)*/
    _lstCategory.on("change",function(){
        if(_lstCategory.val()=="null"){
            console.log("Impossibile")
        }
        else{
            caricaFacts(_lstCategory.val());
        }
    })
       
});
