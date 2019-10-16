const app = require('express')();
//exports.app = app;
var needle = require('needle');


const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const securitySetting=  require('./Shared/securitySetting');



var redis = require('redis').createClient()
var CronJob = require('cron-cluster')(redis).CronJob
 
function doCron () {
  var job = new CronJob({
    cronTime: '* * * * * *', 
    onTick: function () {
        // Do some stuff here
    }
  })
  job.start()
}


app.get('/', function (req, res) { res.status(200).send("test"); });



io.on('connection', (socket) => { 
console.log("connected");

socket.on('message', function (data) {
  console.log(data);
});


socket.on('disconnect', function () { });
});



var data = {
    file: '/home/johnlennon/walrus.png',
    content_type: 'image/png'
  };

needle
  .post('https://my.server.com/foo', data, { multipart: true })
  .on('readable', function() { /* eat your chunks */ })
  .on('done', function(err, resp) {
    console.log('Ready-o!');
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
 