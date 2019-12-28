var express = require('express')
var router = express.Router();

module.exports = function(pump_jack, pump_coke) {
  var router = express.Router();

  router.get('/status', function (req, res) {
    var stats = {
      pump_jack: pump_jack.GetStatus(),
      pump_coke: pump_coke.GetStatus()
    }
    res.send(stats)
  });
  return router;
}
