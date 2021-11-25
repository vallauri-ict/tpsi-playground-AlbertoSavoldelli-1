"use strict"

$(document).ready(function(){
    let _lst=$("#lst");
    let _txtValue=$("#txtValue");
    let btnSalva=$("#btnSalva");
    let thisId=""
    let request = inviaRichiesta("post", "/api/servizio1"/*, {"classe":classe}*/);
    request.fail(errore);
    request.done(function(facts) {
        console.log(facts);
        _lst.empty();
        for (const fact of facts) {
            let opt=$("<option>")
            opt.text(fact["_id"]);
            opt.val(fact.value)
            opt.prop("id",fact["_id"])
            opt.appendTo(_lst);
        }
    _lst.prop("selectedIndex", -1);
    });
    _lst.on("change",function(){
        console.log("cambia");
        _txtValue.val(_lst.val());
        _lst.prop("id")
    })
    btnSalva.on("click",function(){
        console.log();
        let id=_lst.prop("id");
        let value=_txtValue.val();
        let request = inviaRichiesta("post", "/api/servizio2", {"id":id,"value":value});
        request.fail(errore);
        request.done(function(data) {
            alert(data)
        });
    })
})