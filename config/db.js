var redis       = require('redis');
var Promise     = require("bluebird");
var mysql = require('mysql');
var mongoose = require('mongoose');
Promise.promisifyAll(mongoose);
Promise.promisifyAll(redis);

global.Promise = Promise;
var options = {
    auto_reconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    keepAlive: 1,
    bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
    useNewUrlParser: true
};
mongoose.connect(config.mongodb.uri, options, function (err, db) {
    if (err) {
        throw err;
    }
    global.db = db;
});

mongoose.connection.on('error', function (e) {
    console.log("db: mongodb error " + e);
    // reconnect here
});

mongoose.connection.on('connected', function (e) {
    console.log('db: mongodb is connected: ' + config.mongodb.uri);
});

mongoose.connection.on('disconnected', function () {
    console.log('db: mongodb is disconnected');
});

mongoose.connection.on('reconnected', function () {
    console.log('db: mongodb is reconnected: ' + config.mongodb.uri);
});

mongoose.connection.on('timeout', function (e) {
    console.log("db: mongodb timeout " + e);
    // reconnect here
});

mongoose.connection.on('close', function () {
    console.log('db: mongodb connection closed');
});

//mongoose.set('bufferCommands', false);

global.mongoose = mongoose;
global.Schema = mongoose.Schema;

var connection;
function handleDisconnect() {
    connection = mysql.createConnection(config.mysql);
    global.mysqldb = Promise.promisifyAll(connection);
    connection.connect(function (err) {      
        if (err) {                             
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); 
        } else {
            console.log("mysql: mysql connected")
        }                               
    });                                     
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        connection.end(function (err) {
        });
        handleDisconnect();
    });
}

handleDisconnect();
var redisClient = redis.createClient(config.redis);

redisClient.on('connect', function(){
    global.redisClient = redisClient;
    console.log('redis: redis connected');
});
redisClient.on('error', function(e){
    console.log('redis: redis error');
});
