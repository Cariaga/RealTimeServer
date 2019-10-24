
var redis = require('redis').createClient()
const helmet = require('helmet');
const nSQL = require("nano-sql").nSQL;
const RedisAdapter = require("nano-redis").RedisAdapter;
nSQL("Race") // table name
.model([ // data model
    {key: "GameID", type: "string", props: ["pk"]}, // primary key
    {key: "PegionID", type: "string"},
    {key: "Location", type: "string"},
    {key: "FinishedTime", type: "string"},
    {key: "DeviceID", type: "string"},
    {key: "AssciationID", type: "string"},
])
.config({
    mode: new RedisAdapter({ // required
        // identical to config object for https://www.npmjs.com/package/redis
        host: "localhost"
    })
})

.then(() => {
  //select record
 return nSQL("Race").query("select").exec();
})
.catch((error)=>{
  console.log(error);
})
.then((rows) => {
  console.log(rows) 
})
.catch((error)=>{
  console.log(error);
})
.then(() => {
  // delete record
  return nSQL("Race").query("delete", {name: "Jeb", age: 30}).exec();
})
.catch((error)=>{
console.log(error);
});


module.exports.UpsertPlayer = function UpsertPlayer(GameID,PegionID,Location,FinishedTime,DeviceID,AssciationID){
    connect().then(() => {
        // add record
        return nSQL("Race")
        .query("upsert", {GameID: GameID, PegionID: PegionID, Location: Location, FinishedTime: FinishedTime, DeviceID: DeviceID, AssciationID: AssciationID})
        .where(['GameID'=GameID,'and',['PegionID'=PegionID]])
        .exec();
    })
    .catch((error)=>{
      console.log(error);
    })
}

module.exports.StopTimePlayer= function StopTimePlayer(GameID,PegionID,FinishedTime,DeviceID){
    connect().then(() => {
        // add record
        return nSQL("Race")
        .query("update", {FinishedTime: FinishedTime})
        .where(['GameID'=GameID,'and',['PegionID'=PegionID],'and',['DeviceID'=DeviceID]])
        .exec();
    })
    .catch((error)=>{
      console.log(error);
    })
}
module.exports.SelectPlayersOfGameWithAssociation= function SelectPlayersOfGameWithAssociation(GameID,AssciationID){
    connect().then(() => {
        // add record
        return nSQL("Race")
        .query("select")
        .where(['GameID'=GameID],'and',['AssciationID'=AssciationID])
        .exec();
    })
    .catch((error)=>{
      console.log(error);
    })
}

module.exports.SelectPlayersOfGame= function SelectPlayersOfGame(GameID){
    connect().then(() => {
        // add record
        return nSQL("Race")
        .query("select")
        .where(['GameID'=GameID])
        .exec();
    })
    .catch((error)=>{
      console.log(error);
    })
}


////==========
//this are private functions they are never public with export
function FindAbstractKey(AbstractKey){//can be used to filter just the Pigeon and get all its properties

}
function GetAllPegionAssociationIDGameID(AssociationID,GameID){//Dual keys to make sure its for the association

}
function GetAllPegionDeviceID(DeviceID){//could be used to get all pegions pointing on one loft

}
function PigeonTimeStop(AbstractKey){//Finish and set time

}
function ClearGame(GameID){// Clean up memory this completely ends the game you can only access information via api now

}

///==========