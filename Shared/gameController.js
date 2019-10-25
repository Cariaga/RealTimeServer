const now = new Date();

var redis = require('redis').createClient()
const helmet = require('helmet');
const nSQL = require("nano-sql").nSQL;
const RedisAdapter = require("nano-redis").RedisAdapter;
const Columns = [ // data model
  {key: "AbstractKey", type: "string", props: ["pk"]},
  {key: "PlayerID",type:"string"}, 
  {key: "GameID", type: "string"}, // primary key
  {key: "PegionID", type: "string"},
  {key: "Location", type: "string"},
  {key: "FinishedTime", type: "string"},
  {key: "DeviceID", type: "string"},
  {key: "AssociationID", type: "string"}
];

//important you can do upsert select delete drop but not Insert


//this redis adoptor can't be put to a variable it will not execute 
//the model need to attach again to the redis adoptor when doing connect() or query()
 nSQL("Race").model(Columns).config({
    mode: new RedisAdapter({ // required
        // identical to config object for https://www.npmjs.com/package/redis
        host: "localhost"
    })
}).connect();


module.exports.SelectAllRaces = function SelectAllRaces(){
  //  console.log("test");
  return nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
    })
      .query("select").exec();//use then to access  the result over the caller
}

module.exports.UpsertRacer = function UpsertRacer(AbstractKey,PlayerID,GameID,PegionID,Location,FinishedTime,DeviceID,AssociationID){

        return nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
            })
            .query("upsert", {AbstractKey:AbstractKey,PlayerID:PlayerID,GameID: GameID, PegionID: PegionID, Location: Location, FinishedTime: FinishedTime, DeviceID: DeviceID, AssociationID: AssociationID})
     
    .exec(); // use .emit() instead of .exec()
    
}


module.exports.StopTimeRacer= function StopTimeRacer(AbstractKey){

        let Now = require('../Shared/TimeFunction').Now();
        return  nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
            })
        .query("upsert", {FinishedTime: Now})
        .where(['AbstractKey','=',AbstractKey])
        .exec();

}
module.exports.SelectRacersOfGameWithAssociation= function SelectRacersOfGameWithAssociation(GameID,AssociationID){
        return  nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
            })
        .query("select")
        .where(['GameID','=',GameID,'and','AssociationID','=',AssociationID])
        .exec();
}

module.exports.SelectPlayersOfGame= function SelectPlayersOfGame(GameID){
        return  nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
            })
        .query("select")
        .where(['GameID','=',GameID])
        .exec().catch(e=>e);
}
module.exports.EndGame= function EndGame(GameID){//clear out the memory for the game
        return  nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
            })
        .query("delete")
        .where(['GameID','=',GameID])
        .exec();
}
module.exports.Drop= function Drop(){//clear out the memory for the game
        return  nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
            })
        .query("drop")
        .exec();
}
module.exports.TotalCompletedRacersByAssociationGameID= function TotalCompletedRacersByAssociationGameID(GameID){//clear out the memory for the game

       return  nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
    })
        .query("select(*)")
        .where(['GameID','=',GameID])
        .exec();

}
module.exports.TotalActiveRacesGroupByAssociation= function TotalActiveRacesGroupByAssociation(){

       return  nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
    })
      .query("select(*)")
      .where([])
      .exec();
}
module.exports.ActiveAssociation= function ActiveAssociation(){

return nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
        })
      .query("select",["AssociationID"])
      .where(['AssociationID','!=',""])
      .exec().then((rows)=>{
        const Enumerable = require('node-enumerable');
        let seq4 = Enumerable.from(rows).groupBy(x=>x.AssociationID).select(x=>{x.AssociationID,x.count()});
        //Wrong!
                console.log(seq4);
                return seq4;
        });
}
module.exports.TotalActiveRacers= function TotalActiveRacers(){

       return  nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
    })
      .query("select",["count(PlayerID) AS ActiveRacers"])
      .where(['PlayerID','!=',""])
      .exec().catch(e=>e);
}
module.exports.TotalActivePlayers= function TotalActivePlayers(){

       return  nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
    })
    .query("select",["count(PlayerID) AS ActivePlayers"])
    .where(['FinishedTime','=',""])
      .exec().catch(e=>e);
}

