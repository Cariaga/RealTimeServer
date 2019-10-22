const byteof=require('byteof');
const safeStringify = require('fast-safe-stringify')
var PigeonProperties ={//the key used in redis is the abstracted key that is 1 to one with the chip generated
    G:"",//GAME
    P:"",//Pigeon ChipID // the key represting the written key on chip this never changes
    L:"",//Location
    FT:"",//FinishedTime
    DID:"",//DeviceID
    As:"",//Association so we don't have to query the server
    S:"",//GameStarted? boolean only when it is officiated we can Set The FinishedTime//Prevent Unwanted scans
};



console.log(PigeonProperties);



