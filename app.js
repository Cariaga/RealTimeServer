const app = require('express')();
module.exports.app = app;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
const game = require('./Shared/game');

io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
const securitySetting=  require('./Shared/securitySetting');
var redis = require('redis').createClient()
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"]
    }
}));
app.disable('x-powered-by');
app.use(helmet.noCache());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.get('/', function (req, res) { res.status(200).send("test"); });

io.on('connection', (socket) => { 
console.log("connected");

socket.on('Message', function (data) {
  
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
 