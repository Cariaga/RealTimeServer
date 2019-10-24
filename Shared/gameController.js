
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
    {key: "AssciationID", type: "string"}
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


module.exports.UpsertRacer = function UpsertRacer(GameID,PegionID,Location,FinishedTime,DeviceID,AssciationID){
    connect().then(() => {
        // add record
        return nSQL("Race")
        .query("upsert", {GameID: GameID, PegionID: PegionID, Location: Location, FinishedTime: FinishedTime, DeviceID: DeviceID, AssciationID: AssciationID})
        .where(['GameID','=',GameID,'and','PegionID','=',PegionID])
        .exec();
    })
    .catch((error)=>{
      console.log(error);
    })
}

module.exports.StopTimeRacer= function StopTimeRacer(GameID,PegionID,FinishedTime,DeviceID){
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
module.exports.SelectRacersOfGameWithAssociation= function SelectRacersOfGameWithAssociation(GameID,AssciationID){
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
module.exports.EndGame= function EndGame(GameID){//clear out the memory for the game
    connect().then(() => {
        // add record
        return nSQL("Race")
        .query("delete")
        .where(['GameID'=GameID])
        .exec();
    })
    .catch((error)=>{
      console.log(error);
    })
}

module.exports.TotalCompletedRacersByAssociationGameID= function TotalCompletedRacersByAssociationGameID(GameID){//clear out the memory for the game
    connect().then(() => {
        // add record
        return nSQL("Race")
        .query("select(*)")
        .where(['GameID'=GameID])
        .exec();
    })
    .catch((error)=>{
      console.log(error);
    })
}
module.exports.TotalActiveRacesGroupByAssociation= function TotalActiveRacesGroupByAssociation(){
  connect().then(() => {
      // add record
      return nSQL("Race")
      .query("select(*)")
      .where(['GameID'=GameID])
      .exec();
  })
  .catch((error)=>{
    console.log(error);
  })
}
module.exports.TotalActiveAssociation= function TotalActiveAssociation(){
  connect().then(() => {
      // add record
      return nSQL("Race")
      .query("select(*)")
      .where(['GameID'=GameID])
      .exec();
  })
  .catch((error)=>{
    console.log(error);
  })
}
module.exports.TotalActiveRacers= function TotalActiveRacers(){
  connect().then(() => {
      // add record
      return nSQL("Race")
      .query("select(*)")
      .where(['FinishedTime','not',''])
      .exec();
  })
  .catch((error)=>{
    console.log(error);
  })
}
module.exports.TotalActivePlayers= function TotalActivePlayers(){
  connect().then(() => {
      // add record
      return nSQL("Race")
      .query("select(*)")
      .where(['GameID','=',GameID])
      .exec();
  })
  .catch((error)=>{
    console.log(error);
  })
}





////==========


///==========