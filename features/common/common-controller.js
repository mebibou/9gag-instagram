(function() {
  'use strict';

  var express = require('express'),
      router = express.Router();

  router.get('/', function(req, res) {
    res.redirect('/posts');
  });

  module.exports = router;

})();
