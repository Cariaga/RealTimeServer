const app = require('express')();
module.exports.app = app;

var http = require('http').Server(app);
var io = require('socket.io')(http,{pingInterval: 5000});//5000 should be set


const redisAdapter = require('socket.io-redis');
const game = require('./Shared/game');

io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const securitySetting=  require('./Shared/securitySetting');

var redis = require('redis').createClient()
const helmet = require('helmet');

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
const PlayerIO = io.of('/my-namespace');

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
 