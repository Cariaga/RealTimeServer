const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');
var redis = require('redis').createClient()
var CronJob = require('cron-cluster')(redis).CronJob
module.exports.app = app;

var http = require('http').Server(app);
var io = require('socket.io')(http,{pingInterval: 5000});//5000 should be set


const redisAdapter = require('socket.io-redis');
const game = require('./Shared/game');
//const model = require('./Shared/gameModel');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const securitySetting=  require('./Shared/securitySetting');
const gameController = require('./Shared/gameController');

//app.use('/static', express.static(path.join(__dirname, 'public')))





app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'",],
    scriptSrc :["'self'", "'unsafe-inline'",'cdnjs.cloudflare.com'],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}))
app.disable('x-powered-by');
app.use(helmet.noCache());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));



app.get('/', function (req, res) { 
  res.sendFile(__dirname + '/index.html');
});
app.get('/Developer', function (req, res) { 
  res.sendFile(__dirname + '/public/Developer.htm');
});
app.get('/HeadOffice', function (req, res) { 
  res.sendFile(__dirname + '/public/HeadOffice.htm');
});
app.get('/Association', function (req, res) { 
  res.sendFile(__dirname + '/public/Association.htm');
});
app.get('/Player', function (req, res) { 
  res.sendFile(__dirname + '/public/Player.htm');
});


//names space is equivalent to route on client without using express route you can sepereate application logic with namespaces

//==========PlayerIO
const PlayerIO = io.of('/Player-namespace');
PlayerIO.on('connection', (socket) => { 
  let token = socket.handshake.query.token;
  let GameID = "Room1";//
  console.log("connected :"+token);
  socket.join(GameID);
  PlayerIO.to(GameID).emit('Event','you are now connected on room '+GameID);
  
  socket.on('ChipKey', (data) => {
    console.log("Socket ChipKey : "+data);
    //here we decode the token
  });

  socket.on('error', (error) => {
    console.log("Socket error : "+error);
  });
  socket.on('disconnect', function (reason) {
    console.log("disconnection : "+reason);
  });
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    console.log('disconnecting '+rooms);
  });
});
//============AssociationIO
const AssociationIO = io.of('/Association-namespace');
AssociationIO.on('connection', (socket) => { 
  let token = socket.handshake.query.token;
  console.log("connected :"+token);
  
  let refreshIntervalId= setInterval(function() {
    // Do something every 5 seconds
    console.log(token);
  }, 5000);


  socket.on('error', (error) => {
    console.log("Socket error : "+error);
    clearInterval(refreshIntervalId);
  });
  socket.on('disconnect', function (reason) {
    console.log("disconnection : "+reason);
    clearInterval(refreshIntervalId);
  });
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    console.log('disconnecting '+rooms);
    clearInterval(refreshIntervalId);
  });
});

//======HeadOfficeIO
const HeadOffice = io.of('/HeadOffice-namespace');
HeadOffice.on('connection', (socket) => { 
  let token = socket.handshake.query.token;
  console.log("connected :"+token);
  
  let refreshIntervalId= setInterval(function() {
    // Do something every 5 seconds
    console.log(token);
  }, 5000);

  socket.on('error', (error) => {
    console.log("Socket error : "+error);
    clearInterval(refreshIntervalId);
  });
  socket.on('disconnect', function (reason) {
    console.log("disconnection : "+reason);
    clearInterval(refreshIntervalId);
  });
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    console.log('disconnecting '+rooms);
    clearInterval(refreshIntervalId);
  });
});
//============DeveloperIO
const DeveloperIO = io.of('/Developer-namespace');
DeveloperIO.on('connection', (socket) => { 
  let token = socket.handshake.query.token;
  console.log("connected :"+token);
  
  let refreshIntervalId= setInterval(function() {
    // Do something every 5 seconds
    //console.log(token);
    gameController.SelectAllRaces().then((result)=>{
      socket.emit("Races",result);
    });
   
  }, 1000);

  socket.on('AddRacer', function (result) {
   
    
    let  AbstractKey= result.AbstractKey;
    console.log("Racer Added "+AbstractKey);
    let  PlayerID=result.PlayerID;
    let  GameID= result.GameID;
    let  PigeonID= result.PigeonID;
    let  Location= result.Location;
    let  FinishedTime= result.FinishedTime;
    let  DeviceID= result.DeviceID;
    let  AssociationID= result.AssociationID;
    gameController.UpsertRacer(AbstractKey,PlayerID,GameID,PigeonID,Location,FinishedTime,DeviceID,AssociationID);
  });

  socket.on('EndGame', function (result) {
    let  GameID= result.GameID;
    gameController.EndGame(GameID);
  });
  

  socket.on('error', (error) => {
    console.log("Socket error : "+error);
    clearInterval(refreshIntervalId);
  });
  socket.on('disconnect', function (reason) {
    console.log("disconnection : "+reason);
    clearInterval(refreshIntervalId);
  });
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    console.log('disconnecting '+rooms);
    clearInterval(refreshIntervalId);
  });
});


////=============cron===========

function doCron () {
  var job = new CronJob({
    cronTime: '* * * * * *', 
    onTick: function () {
        // Do some stuff here
        
    }
  });
  job.start();
}

app.use(function (err, req, res, next) {
    // handle error
  });

  http.listen(3000, function() {
    console.log('listening on :3000');
 });


 //development only
 var PrettyError = require('pretty-error');
var pe = new PrettyError();

 process.on('uncaughtException', function(err) {
    var renderedError = pe.render(err);
    console.log(renderedError);
  });
 