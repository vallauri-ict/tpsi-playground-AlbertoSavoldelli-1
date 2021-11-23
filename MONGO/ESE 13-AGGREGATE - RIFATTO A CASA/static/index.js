"use strict"

$(document).ready(function(){
    $("#btnInvia").on("click", function() {
        let _lstStudent=$("#lstStudent");
        let classe=$("#txtClasse").val();
        if(classe==""){
            alert("Inserire la classe")
        }
        let request = inviaRichiesta("post", "/api/servizio1", {"classe":classe});
        request.fail(errore);
        request.done(function(students) {
            console.log(students);
            _lstStudent.empty();
            for (const student of students) {
                let opt=$("<option>")
                opt.text(student.nome);
                opt.val(student.nome)
                opt.appendTo(_lstStudent);
            }
            _lstStudent.prop("selectedIndex", -1);
        });
    });
})