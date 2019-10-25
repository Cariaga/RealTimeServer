const expect    = require("chai").expect;
const should    = require("chai").should;
const  assert  = require('chai').assert;
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

            it("GenerateKey",async function() {//result date 10/25/2019 12:37:48.240 PM with milisecond accuracy
                    //similar millisecond time can happend in a forloop so make sure their is enough time diffrence between request e.g http request
                    let moment = require('moment');            
                    let format = 'MM/DD/YYYY h:mm:ss.SSS A';//this is internally part of TimeFunction but we use it here to validate if TimeFunction still matches the Test
                    let result = require('../Shared/TimeFunction').Now();
                    let isValidFormat = moment(result,format,true).isValid();//validate format
                    expect(isValidFormat).equals(true);
            });

            it("check length of Key",async function() {
                const nanoid = require('nanoid')
                expect(nanoid().length).equals(21);
              
        });

    });
   

   describe("Redis Check", function() {
        const gameControlller = require('../Shared/gameController');

        it("Try to Drop",async function() {
           /* await gameControlller.Drop().then(()=>{
                assert.isOk(true, 'Done');
            }).catch(()=>{
                assert.isOk(false, 'Fail');
            });*/
        });

        it("Try to Insert",async function() {

           

            await gameControlller.UpsertRacer('Ab1','P1','GM1','Peg','','','dev1','ass')
            .then(()=>{
                assert.isOk(true, 'Done');
            }).catch(e=>{
                assert.isOk(false, 'Fail');
            });


           await gameControlller.UpsertRacer('Ab2','P2','GM2','Peg2','','','dev2','ass')
            .then(()=>{
             
                assert.isOk(true, 'Done')
            }).catch(e=>{
                assert.isOk(false, 'Fail');
            });
            
            await gameControlller.UpsertRacer('Ab3','P3','GM2','Peg3','','','dev3','')
            .then(()=>{
             
                assert.isOk(true, 'Done')
            }).catch(e=>{
                assert.isOk(false, 'Fail');
            });
            await gameControlller.UpsertRacer('Ab4','P4','GM1','Peg4','','','dev4','ass')
            .then(()=>{
                assert.isOk(true, 'Done');
            }).catch(e=>{
                assert.isOk(false, 'Fail');
            });     
          
        });
        it("Try Select ",async function() {
            
           await gameControlller.SelectAllRaces()
           .then((result)=>{
                
            assert.isOk(true, 'Done')
              // console.log(JSON.stringify(result));
           }).catch(e=>{
            assert.isOk(false, 'Fail')
            });
          
        });
        it("Try Finish Race ",async function() {
            var Time = require('../Shared/TimeFunction');
            //console.log(Time.Now());
            await gameControlller.StopTimeRacer('Ab1')
            .then((result)=>{
                 
             assert.isOk(true, 'Done')
               // console.log(JSON.stringify(result));
            }).catch(()=>{
            // assert.isOk(false, 'Fail')
             });
           
         });
         it("Try Select ",async function() {
            await gameControlller.SelectAllRaces()
            .then((result)=>{
                 
             assert.isOk(true, 'Done')
               console.log(JSON.stringify(result));
            }).catch(e=>{
             assert.isOk(false, 'Fail')
             });
         });

         it("Try count ActiveAssociation ",async function() {
           let x=  await gameControlller.ActiveAssociation()
          
         });
         it("Try count TotalActivePlayers ",async function() {
            await gameControlller.TotalActivePlayers()
            .then((result)=>{
                 
             assert.isOk(true, 'Done');
               console.log(JSON.stringify(result));
            }).catch(e=>{
             assert.isOk(false, 'Fail')
             });
         });

    })
});




