var express = require('express');
var app = express();
var core = require('./core');
var redis = require('./redis');
var config = require('./config');
var errorHandlers = require('./middleware/errorhandlers');
//var log = require('./middleware/log');
//app.use(log.logger);

app.get('/config', core.config);
app.get('/data/lpush/:key/:value', redis.lpush);
app.get('/data/rpush/:key/:value', redis.rpush);
app.get('/data/rpop/:key', redis.rpop);
app.get('/data/lpop/:key', redis.lpop);
app.get('/data/incr/:key', redis.incr);
app.get('/data/decr/:key', redis.decr);
app.get('/data/get/:key', redis.get);
app.get('/data/set/:key/:value', redis.set);
app.get('/data/flushdb', redis.flushdb);
app.get('/data/importCSV/:file', redis.flushdb);

app.use(errorHandlers.notFound);

app.listen(3000);
console.log("App server running on port 3000");
