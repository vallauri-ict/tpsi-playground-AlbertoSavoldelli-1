"use strict"
$(document).ready(function() {
    let _lstArgomenti=$("#lstArgomenti");
    let _divDomande=$("#domande");
    let request1=inviaRichiesta("GET","/api/argomenti");
    request1.fail(errore);
    request1.done(function(argomenti){
        console.log(argomenti)
        for (const arg of argomenti) {
            let opt=$("<option>").text(arg).appendTo(_lstArgomenti);
        }
    })
    _lstArgomenti.prop('selectedIndex', -1);
    _lstArgomenti.on("change",function(){
        let argomentoSelected=_lstArgomenti.val();
        _divDomande.empty();
        let request2=inviaRichiesta("GET","/api/domande",{'arg':argomentoSelected});
        request2.fail(errore);
        request2.done(function(domande){
            console.log(domande)
            _divDomande.show();
            let h2=$("<h2>").text("Verifica di "+argomentoSelected).appendTo(_divDomande)
            for (const domanda of domande) {
                let p=$("<p>").text(domanda.domanda).appendTo(_divDomande);
                let input=$("<input type='radio'>").prop({"name":"risposta","value":"T","id":domanda.id}).appendTo(p);
                let span=$("<span>").text("T").appendTo(p);
                input=$("<input type='radio'>").prop({"name":"risposta","value":"F","id":domanda.id}).appendTo(p);
                span=$("<span>").text("F").appendTo(p);
            }
            let btnInvia=$("<button>").text("Invia").addClass(".invia").appendTo(_divDomande);
            let vetRisposte=[];
            btnInvia.on("click",function(){
                $(":radio").each(function () {
                    let json={'id':$(this).prop("id"),'risposta':$(this).prop("value")}
                    vetRisposte.push(json);
                });
                console.log(vetRisposte);
                let request3=inviaRichiesta("POST","/api/risposte",{'risposte':vetRisposte})
                request3.fail(errore);
                request3.done(function(message){
                    alert(message.ris);
                })
            })
        })
    })
});
