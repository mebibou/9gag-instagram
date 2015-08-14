(function() {
  'use strict';

  var express = require('express'),
      router = express.Router();

  router.get('/', function(req, res) {
    res.render('posts/posts');
  });

  module.exports = router;

})();
