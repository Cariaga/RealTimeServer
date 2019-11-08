var data = {
    file: '/home/johnlennon/walrus.png',
    content_type: 'image/png'
  };

  var needle = require('needle');
needle
  .post('https://my.server.com/foo', data, { multipart: true })
  .on('readable', function() { /* eat your chunks */ })
  .on('done', function(err, resp) {
    console.log('Ready-o!');
  });

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
  */