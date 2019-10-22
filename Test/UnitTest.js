const byteof=require('byteof');
const safeStringify = require('fast-safe-stringify')
var PigeonProperties ={//the key used in redis is the abstracted key that is 1 to one with the chip
    P:"asdafasdfgasdfca",
    G:"asdfasca",//GAME
    P:"asdafasdfgasdfca",//Pigeon ChipID // the key represting the written key on chip
    L:"asfasfvasv,asfasfasf",//Location
    FT:"10/10/10 20:20PM",//FinishedTime
    DID:"asdfvcsfwtflpofk",//DeviceID
    As:"asdfocps",
};

let array =[];
let bytes=0;
for(var i =0;i<10000;i++){

    bytes=bytes+byteof(safeStringify(PigeonProperties));

   // array.push(PigeonProperties);
}

console.log(bytes);



