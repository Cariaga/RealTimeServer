const app = require('express')();
module.exports.app = app;

var http = require('http').Server(app);
var io = require('socket.io')(http,{pingInterval: 5000});//5000 should be set


const redisAdapter = require('socket.io-redis');
const game = require('./Shared/game');
const model = require('./Shared/gameModel');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const securitySetting=  require('./Shared/securitySetting');

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
}).connect().then(() => {
    // add record
    return nSQL("Race").query("upsert", {GameID: "Jeb", PegionID: 30, Location: 30, FinishedTime: 30, DeviceID: 30, AssciationID: 30,}).exec();
})
.catch((error)=>{
  console.log(error);
})

.then(() => {
  //select record
 return nSQL("Race").query("select").exec();
})
.catch((error)=>{
  console.log(error);
})
.then((rows) => {
  console.log(rows) // [{id: "1df52039af3d-a5c0-4ca9-89b7-0e89aad5a61e", name: "Jeb", age: 30}]
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


//names space is equivalent to route on client without using express route you can sepereate application logic with namespaces
const PlayerIO = io.of('/player-namespace');

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

const AdminIO = io.of('/Admin-namespace');

var redis = require('redis').createClient()
var CronJob = require('cron-cluster')(redis).CronJob

  function doCron () {
    var job = new CronJob({
      cronTime: '* * * * * *', 
      onTick: function () {
          // Do some stuff here
          
      }
    });
    job.start();
  }


AdminIO.on('connection', (socket) => { 
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
 