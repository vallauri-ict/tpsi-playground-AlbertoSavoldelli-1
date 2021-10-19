import * as _fs from "fs";
import { json } from "stream/consumers";
import HEADERS from "./headers.json";
import {Dispatcher} from "./dispatcher";


//Lettura file radios e states
import radios from "./radios.json";

//in alternativa posso usare readFile--> Es nell'es 6 news dove devo leggere il file aggiornato
_fs.readFile("./states.json",function(err,data){
    if(err){
        console.error(err);
        return;
    }
    else{
        //console.log(data.toString()); //data è il contenuto del file espresso in forma binaria
        //se il file è un testo è necessario eseguire un toString finale
        elabora(JSON.parse(data.toString()));
    }
})

function elabora(states){
    for (const state of states) {
        for (const radio of radios) {
            if(radio.state==state.value){
                //non posso fare ++ perchè è string
                state.stationcount=parseInt(state.stationcount)+1;
                state.stationcount=(state.stationcount).toString();
            }
        }
    }
    //salvo su disco
    _fs.writeFile("./states.json",JSON.stringify(states),function(err){
        if(err){
            console.log(err.message);
            return;
        }
        else{
            /*nodemon --ignore 'states.json'*/
            console.log("file salvato correttamente");
        }
    })
}