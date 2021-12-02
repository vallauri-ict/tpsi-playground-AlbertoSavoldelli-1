$(document).ready(function() {

    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("get", "/api/risorsa1", {"nome":"Roodles"});
        request.fail(errore);
        request.done(function(data) {
            if(data.length > 0){
                alert(JSON.stringify(data));
            }
            else{
                alert("Nessuna corrispondenza")
            }
           
        });
    });
    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("patch", "/api/risorsa2", {"nome":"Unico","vampiri":3});
        request.fail(errore);
        request.done(function(data) {
            if(data.modifiedCount>0){
                alert("Aggiornato correttamente")
            }
            else {
                alert("Nessuna Corrispondenza");
              }
        });
    });
    $("#btnInvia3").on("click", function() {
        let request = inviaRichiesta("get", "/api/risorsa3/m/brown");
        request.fail(errore);
        request.done(function(data) {
            if(data.length > 0){
                alert(JSON.stringify(data));
            }
            else{
                alert("Nessuna corrispondenza")
            }
        });
    });
});
