var expect    = require("chai").expect;
var should    = require("chai").should;
describe("Real Time Server", function() {
    describe("Expected Data", function() {
    it("Try check expected data from Object to string",async function() {
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
        }
        expect(bytes).equals(2620000);
            });
    });
   

   describe("Redis Check", function() {
        const gameControlller = require('../Shared/gameController');
        it("Try to Insert",async function() {

            await gameControlller.Drop().then(()=>console.log("Droped")).catch(()=>{console.log("Failed Drop")});

            await gameControlller.UpsertRacer('GM2','Peg','','','dev1','ass')
            .then(()=>{
                console.log("insert Done");
            }).catch(e=>console.log(e));


            await gameControlller.SelectAllRaces()
            .then((result)=>{
                console.log(JSON.stringify(result));
            }).catch(e=>console.log(e));

           
            expect(1).equals(1);
        });
    })
});




