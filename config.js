var config = {};

config.redis = {};

config.redis.host = 'localhost';
config.redis.port = 6379;
config.redis.retry_interval = 5000;

config.data = {};
config.data.folder = 'data';

module.exports = config;
