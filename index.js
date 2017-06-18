var express = require('express');
var app = require('express')();
var io = require('socket.io')({transports: ['xhr-polling','websocket']});
var path = require('path');
var fs = require('fs');

var clients = [];

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    console.log(files);
    for (var i in files){
        var name = '/' + files[i];
        files_.push(name);
    }
    return files_;
}

console.log(getFiles('pdf'));

var files = getFiles('pdf');

app.get('/',function(req,res){
	res.sendFile(__dirname + '/pdfiles.html');
});

app.get('/index',function(req,res){
	res.sendFile(__dirname + '/begin.html');
});

app.get('/chat',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'pdf')));

io.on('connection', function (socket){
	clients.push({socket:socket});	
	console.log(clients.length);
	socket.on("chat message",function(msg){
		io.emit('chat message',msg);
	});
	socket.emit('pdf files',files);
});

io.on('disconnection',function (){
	console.log("thala !");
});

app.set('port', process.env.port || 3000);

var server = app.listen(app.get("port"),function () {
	io.listen(server);
	console.log("listening on 3000");
});