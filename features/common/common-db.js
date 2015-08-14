(function() {
  'use strict';

  var redis = require('redis'),
      client = redis.createClient();

  client.on("error", function(err) {
    console.error("error event - " + client.host + ":" + client.port + " - " + err);
  });

  module.exports = client;

})();
