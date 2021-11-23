"use strict"

$(document).ready(function(){
    let _lst=$("#lst");
    let request = inviaRichiesta("post", "/api/servizio1"/*, {"classe":classe}*/);
    request.fail(errore);
    request.done(function(students) {
        console.log(students);
        _lst.empty();
        for (const student of students) {
            let opt=$("<option>")
            opt.text(student.nome);
            opt.val(student.nome)
            opt.appendTo(_lst);
        }
    //_lstStudent.prop("selectedIndex", -1);
    });
})