config = require('../config');
var redis = require('redis'),
var isReady = false;
var client = redis.createClient(config.redis.port, config.redis.host, {
    retry_strategy: function (options) {
        console.log('Couldn\'t connect to Redis host: ' + config.redis.host + ', port: ' + config.redis.port + '. Retrying in ' + config.redis.retry_interval + 'ms');
        return config.redis.retry_interval;
    }
});

client.on("error", function (err) {
    console.log("Error " + err);
}).on('ready', function() {
	isReady = true;
	console.log('Connected to Redis host: ' + config.redis.host + ', port: ' + config.redis.port);
});;

module.exports.lpush = lpush;
module.exports.rpush = rpush;
module.exports.rpop = rpop;
module.exports.lpop = lpop;
module.exports.incr = incr;
module.exports.decr = decr;
module.exports.get = get;
module.exports.set = set;
module.exports.flushdb = flushdb;
module.exports.importCSV = importCSV;

// Function to check if Redis client is ready (i.e. connected) and return a server 500 error if not
function checkReady(res)
{
	if (!isReady) {
		res.status(500).end();
	}
}

// lpush implementation (add a value to the head of a list)
function lpush(req,res)
{
	checkReady(res);
	var key = req.params.key;
	var value = req.params.value;
	client.lpush(key,value);
	res.json({"rc": 0});
};

// rpush implementation (add a value to the tail of a list)
function rpush(req,res)
{
	checkReady(res);
	var key = req.params.key;
	var value = req.params.value;
	client.rpush(key,value);
	res.json({"rc": 0});
};

// Pop a value from the tail of a list
function rpop(req,res)
{
	checkReady(res);
	var key = req.params.key;
	client.rpop(key, function (err, reply) {
		if (reply == null) {
			res.status(204).end();
		}
		else {
			res.status(200).json({value: reply});
		}	
	});
};

// Pop a value from the head of a list
function lpop(req,res)
{
	checkReady(res);
	var key = req.params.key;
	client.lpop(key, function (err, reply) {
		if (reply == null) {
			res.status(204).end();
		}
		else {
			res.status(200).json({value: reply});
		}	
	});
};

function set(req,res)
{
	checkReady(res);
	var key = req.params.key;
	var value = req.params.value;
	client.set(key,value);
	res.status(204).end();
}

function get(req,res)
{
	checkReady(res);
	var key = req.params.key;
	client.get(key, function (err, reply) {
		if (reply == null) {
			res.status(204).end();
		}
		else {
			res.status(200).json({value: reply});
		}	
	});
}

// Decrement a value
function decr(req,res)
{
	checkReady(res);
	var key = req.params.key;
	client.decr(key);
	res.status(204).end();
}

// Increment a value
function incr(req,res)
{
	checkReady(res);
	var key = req.params.key;
	client.incr(key);
	res.status(204).end();
}

// Flush the DB
function flushdb(req,res)
{
	checkReady(res);
	client.flushdb();
	res.status(204).end();
}

// TODO Utility function to load the contents of a CSV file into a Redis list
function importCSV(req,res)
{
	res.status(200).end();
}