var express = require('express');
var router = express.Router();
var _ = require('lodash');
var fs = require('fs');
var ini = require('ini');

function removeExistingDefaultValues(appData, defaultData){
   _.each(_.keys(appData), function(key){
    delete defaultData[key];
  });
}

/* GET users listing. */
router.get('/', function(req, res) {
  var config = ini.parse(fs.readFileSync('./testfiles/testFile.ini', 'utf-8'));
  res.json(config)
});

router.get('/:application', function(req, res) {
  var config = ini.parse(fs.readFileSync('./testfiles/testFile.ini', 'utf-8'));
  var app = req.params.application;
  var appData = _.get(config, app);
  var defaultData = config['DEFAULT'];

  removeExistingDefaultValues(appData, defaultData);

  if (appData){
    var result = appData;
    result.defaultValues = defaultData;
    res.json(result);
  }
  else {
    res.status(204).end();
  }

});

router.post('/:application', function(req, res) {
  var config = ini.parse(fs.readFileSync('./testfiles/testFile.ini', 'utf-8'));

  var app = req.params.application;
  var appData = _.get(config, app);
  var defaultData = config['DEFAULT'];

  var key = req.body.key;
  var value = req.body.value;

  if (key && value){
    appData[key] = value;
  } else if (key && value === null){
    delete appData[key]
  }
  removeExistingDefaultValues(appData, defaultData);

  if (appData){
    var result = appData;
    result.defaultValues = defaultData;
    res.json(result);
  }
  else {
    res.status(204).end();
  }
});

module.exports = router;


