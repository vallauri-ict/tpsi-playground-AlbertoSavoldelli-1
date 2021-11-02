"use strict"
$(document).ready(function() {
    let _lstCategory=$("#lstCategory");
    let _mainWrapper=$("#mainWrapper");
    let _btnAdd=$("#btnAdd");
    let _newFact=$("#newFact");
    let requestCategories=inviaRichiesta("GET","/api/categories");
    requestCategories.fail(errore);
    requestCategories.done(function(categories){
        console.log(categories)
        for (const category of categories) {
            let opt=$("<option>").text(category).appendTo(_lstCategory);
        }
        caricaFacts(_lstCategory.val())
        
    })

    function caricaFacts(category){
        _mainWrapper.empty();
        let requestFacts=inviaRichiesta("GET","/api/facts",{'category':category});
        requestFacts.fail(errore);
        requestFacts.done(function(facts){
            console.log(facts)
            let h2=$("<h2>").appendTo(_mainWrapper).text("rate your favorite facts:").css("text-align","center");
            for (const fact of facts) {
                let input=$("<input type='checkbox'>").prop("value",fact.id).appendTo(_mainWrapper);
                let span=$("<span>").text(fact.value).appendTo(_mainWrapper);
                let br=$("<br>").appendTo(_mainWrapper);
            }
            let btnInvia=$("<button>").text("Invia").appendTo(_mainWrapper);
            btnInvia.on("click",function(){
                let vetId = [];
                $(":checkbox").each(function () {
                    let ischecked = $(this).is(":checked");
                    if (ischecked) {
                        vetId.push($(this).prop("value"));
                    }
                });
                console.log(vetId)
                let requestRate=inviaRichiesta("POST","/api/rate",{'vetId':vetId})
                requestRate.fail(errore);
                requestRate.done(function(message){
                    alert(message.ris);
                })
            })
        })
    }
    _lstCategory.on("change",function(){
        caricaFacts(_lstCategory.val())
    })

    _btnAdd.on("click",function(){
        let category=_lstCategory.val();
        let value=_newFact.val();
        let requestRate=inviaRichiesta("POST","/api/add",{'category':category,'value':value})
        requestRate.fail(errore);
        requestRate.done(function(message){
            alert(message.ris);
            caricaFacts(_lstCategory.val())
        })
    })
    
});
