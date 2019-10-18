const app = require('express')();
//exports.app = app;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
const securitySetting=  require('./Shared/securitySetting');
var redis = require('redis').createClient()
 
app.get('/', function (req, res) { res.status(200).send("test"); });

io.on('connection', (socket) => { 
console.log("connected");
socket.on('GPS', function (data) {
});
socket.on('Chip', function (data) {
});
socket.on('RacerToken', function (data) {
  //get the connected PAD check if it is accociated with the RacerToken
});




socket.on('disconnect', function () { });
});





app.use(function (err, req, res, next) {
    // handle error
  });

app.listen(8081, function () {
    console.log("Started");
 });


 //development only
 var PrettyError = require('pretty-error');
var pe = new PrettyError();

 process.on('uncaughtException', function(err) {
    var renderedError = pe.render(err);
    console.log(renderedError);
  });
 