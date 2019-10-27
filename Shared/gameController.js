const now = new Date();

var redis = require('redis').createClient()
const helmet = require('helmet');
const nSQL = require("nano-sql").nSQL;
const RedisAdapter = require("nano-redis").RedisAdapter;
let static = require('../Shared/static');



const Columns = [ // data model
  {key: static.AbstractKey, type: "string", props: ["pk"]},
  {key: static.PlayerID,type:"string"}, 
  {key: static.GameID, type: "string"}, // primary key
  {key: static.PigeonID, type: "string"},
  {key: static.Location, type: "string"},
  {key: static.FinishedTime, type: "string"},
  {key: static.DeviceID, type: "string"},
  {key: static.AssociationID, type: "string"}
];
console.log("Columns Length "+Columns.length)
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

module.exports.UpsertRacer = function UpsertRacer(
    AbstractKey,
    PlayerID,
    GameID,
    PigeonID,
    Location,
    FinishedTime,
    DeviceID,
    AssociationID){

        let object = {
            AbstractKey:AbstractKey,
            PlayerID:PlayerID,
            GameID: GameID,
            PigeonID: PigeonID,
            Location: Location,
            FinishedTime: FinishedTime,
            DeviceID: DeviceID,
            AssociationID: AssociationID};


        return nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
            })
            .query("upsert", object)
     
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
        .where([static.AbstractKey,'=',AbstractKey])
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
        .where([static.GameID,'=',GameID,'and',static.AssociationID,'=',AssociationID])
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
        .where([static.GameID,'=',GameID])
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
        .where([static.GameID,'=',GameID])
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
module.exports.ActivePlayersByAssociation= function ActivePlayersByAssociation(){
return nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
        })
      .query("select",["AssociationID"])
      .where([static.AssociationID,'!=',""])
      .exec().then((rows)=>{
          //flatten
          var listAssoicationID = rows.map(x=>x.AssociationID);
          //count and group by
          var Groups =[];
          for(var i=0;i<listAssoicationID.length;++i){
                let found =false;
                for(var j=0;j<Groups.length;++j){
                    if(listAssoicationID[i]==Groups[j].AssociationID){
                        found =true;
                        break;
                    }
                }
                if(found==false){
                    Groups.push({AssociationID:listAssoicationID[i],PlayersCount:1});
                }else{
                for(var x=0;x<Groups.length;++x){
                    if(Groups[x].AssociationID==listAssoicationID[i]){
                        Groups[x].PlayersCount++;
                        break;
                    }
                }
              }
          }
          return Groups;
        });
}
module.exports.ActivePlayerPigeonNoAssoication= function ActivePlayerPigeonNoAssoication(){
    return nSQL("Race").model(Columns).config({
            mode: new RedisAdapter({ // required
                // identical to config object for https://www.npmjs.com/package/redis
                host: "localhost"
            })
            })
          .query("select",["PlayerID","PigeonID"])
          .where([static.AssociationID,'=',''])
          .exec().then((rows)=>{
              //flatten
              
              return rows;
            });
    }
module.exports.ActivePlayerPigeonHasAssoication= function ActivePlayerPigeonHasAssoication(){
        return nSQL("Race").model(Columns).config({
                mode: new RedisAdapter({ // required
                    // identical to config object for https://www.npmjs.com/package/redis
                    host: "localhost"
                })
                })
              .query("select",["PlayerID","PigeonID"])
              .where([static.AssociationID,'!=',''])
              .exec().then((rows)=>{
                  //flatten
                  
                  return rows;
                });
        }
module.exports.TotalActiveRacers= function TotalActiveRacers(){
       return  nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
    })
      .query("select",["count(PigeonID) ActivePigeonID"])
      .where([static.FinishedTime,'=',""])
      .exec();
}
module.exports.ActivePlayers= function ActivePlayers(){
       return  nSQL("Race").model(Columns).config({
        mode: new RedisAdapter({ // required
            // identical to config object for https://www.npmjs.com/package/redis
            host: "localhost"
        })
    })
    .query("select",["PlayerID"])
    .where([static.FinishedTime,'=',""])
      .exec().then((rows)=>{
            //flatten
            var PlayerList = rows.map(x=>x.PlayerID);
            //count and group by
            var Groups =[];
            for(var i=0;i<PlayerList.length;++i){
                  let found =false;
                  for(var j=0;j<Groups.length;++j){
                      if(PlayerList[i]==Groups[j].PlayerID){
                          found =true;
                          break;
                      }
                  }
                  if(found==false){
                      Groups.push({PlayerID:PlayerList[i],Count:1});
                  }else{
                  for(var x=0;x<Groups.length;++x){
                      if(Groups[x].PlayerID==PlayerList[i]){
                          Groups[x].Count++;
                          break;
                      }
                  }
                }
            }
             // console.log(Groups);
            return Groups;
      });
}

module.exports.ActiveGamesPlayers= function ActiveGamesPlayers(){
    return  nSQL("Race").model(Columns).config({
     mode: new RedisAdapter({ // required
         // identical to config object for https://www.npmjs.com/package/redis
         host: "localhost"
     })
 })
   .query("select",["GameID"])
   .where([static.FinishedTime,'=',""])
   .exec().then((rows)=>{
                    //flatten
                    var GameList = rows.map(x=>x.GameID);
                    //count and group by
                    var Groups =[];
                    for(var i=0;i<GameList.length;++i){
                          let found =false;
                          for(var j=0;j<Groups.length;++j){
                              if(GameList[i]==Groups[j].GameID){
                                  found =true;
                                  break;
                              }
                          }
                          if(found==false){
                              Groups.push({GameID:GameList[i],Count:1});
                          }else{
                          for(var x=0;x<Groups.length;++x){
                              if(Groups[x].GameID==GameList[i]){
                                  Groups[x].Count++;
                                  break;
                              }
                          }
                        }
                    }
                     // console.log(Groups);
                    return Groups;
   });
}