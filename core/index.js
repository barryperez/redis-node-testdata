module.exports.config = config;

var redis = require("redis");
var config = require('../config');

function config(req, res){
  res.json(config);
};