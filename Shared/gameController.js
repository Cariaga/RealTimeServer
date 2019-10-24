
var redis = require('redis').createClient()
const helmet = require('helmet');
const nSQL = require("nano-sql").nSQL;
const RedisAdapter = require("nano-redis").RedisAdapter;
const Columns = [ // data model
  {key: "GameID", type: "string", props: ["pk"]}, // primary key
  {key: "PegionID", type: "string"},
  {key: "Location", type: "string"},
  {key: "FinishedTime", type: "string"},
  {key: "DeviceID", type: "string"},
  {key: "AssciationID", type: "string"}
];


nSQL("Race").model(Columns).config({
    mode: new RedisAdapter({ // required
        // identical to config object for https://www.npmjs.com/package/redis
        host: "localhost"
    })
}).connect();


module.exports.SelectAllRaces = function SelectAllRaces(){
  //  console.log("test");
 nSQL().query("select").exec().then(x=>console.log("TEST"+x));
}

module.exports.UpsertRacer = function UpsertRacer(GameID,PegionID,Location,FinishedTime,DeviceID,AssciationID){
  
    return nSQL("Race").query("upsert", {GameID: GameID, PegionID: PegionID, Location: Location, FinishedTime: FinishedTime, DeviceID: DeviceID, AssciationID: AssciationID})
    .where(['GameID','=',GameID,'and','PegionID','=',PegionID])
    .exec(); // use .emit() instead of .exec()
    
}


module.exports.StopTimeRacer= function StopTimeRacer(GameID,PegionID,FinishedTime,DeviceID){
  
        // add record
        return nSQL("Race")
        .query("update", {FinishedTime: FinishedTime})
        .where(['GameID','=',GameID,'and','PegionID','=',PegionID,'and','DeviceID','=',DeviceID])
        .exec().catch(e=>e);

}
module.exports.SelectRacersOfGameWithAssociation= function SelectRacersOfGameWithAssociation(GameID,AssciationID){
        return nSQL("Race")
        .query("select")
        .where(['GameID','=',GameID,'and','AssciationID','=',AssciationID])
        .exec().catch(e=>e);
}

module.exports.SelectPlayersOfGame= function SelectPlayersOfGame(GameID){
        return nSQL("Race")
        .query("select")
        .where(['GameID','=',GameID])
        .exec().catch(e=>e);
}
module.exports.EndGame= function EndGame(GameID){//clear out the memory for the game
        return nSQL("Race")
        .query("delete")
        .where(['GameID','=',GameID])
        .exec().catch(e=>e);
}

module.exports.TotalCompletedRacersByAssociationGameID= function TotalCompletedRacersByAssociationGameID(GameID){//clear out the memory for the game

        return nSQL("Race")
        .query("select(*)")
        .where(['GameID','=',GameID])
        .exec().catch(e=>e);

}
module.exports.TotalActiveRacesGroupByAssociation= function TotalActiveRacesGroupByAssociation(){

      // add record
      return nSQL("Race")
      .query("select(*)")
      .where([])
      .exec().catch(e=>e);
}
module.exports.TotalActiveAssociation= function TotalActiveAssociation(){

      return nSQL("Race")
      .query("select(*)")
      .where([])
      .exec().catch(e=>e);

}
module.exports.TotalActiveRacers= function TotalActiveRacers(){

      return nSQL("Race")
      .query("select(*)")
      .where(['FinishedTime','not',''])
      .exec().catch(e=>e);

}
module.exports.TotalActivePlayers= function TotalActivePlayers(){

      return nSQL("Race")
      .query("select(*)")
      .where([])
      .exec().catch(e=>e);
}