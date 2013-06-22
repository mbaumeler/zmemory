// TODO clean up var
var Merkfix = require('./public/js/memory.js').Merkfix,
    express = require('express'),
	app = express(),
    path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
	games =  {};

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));
});  
  
server.listen(80);

io.sockets.on('connection', function (socket) {
	socket.on('createGame', function (token) {
		var gameId = token.gameName;
		if (games.gameId === undefined) {
			games.gameId = new Merkfix(token.numberOfPlayers, 16);
			socket.emit('gameCreated', true);
		} else {
			socket.emit('gameCreated', false);
		}
	});
	socket.on('play', function (token) {
		var gameId = token.gameId, index = token.index,
		result = games.gameId.rotateMemoryCard(index);
		io.sockets.emit(gameId, result);
	});
	socket.on('reset', function (token) {
		var gameId = token.gameId,
		result = games.gameId.resetGame();
		io.sockets.emit(gameId, result);
	});
});
