var redis = require('redis').createClient();

module.exports.VerifyFinish = function VerifyFinish(){//perform a key check validation

}
module.exports.EndGame = function EndGame(AbstractKey){//Clear all race list to clean up cache
    
}

module.exports.StartGame = function StartGame(){//start is needed because we don't want our keys getting used if it wasn't started if by a small chance of key leaks
//--Start Game For All
}

module.exports.JoinRace = function JoinRace(){//when joined the 

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
