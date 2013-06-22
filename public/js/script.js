(function(global) {
	"use strict";
	var memory,
	gameId,
	cardElements = document.querySelectorAll('.cardcontent'),
	ClientMemory = function(callback) {
		var merkfix = new Merkfix(2, 16);
		this.play = function(index) { callback(merkfix.rotateMemoryCard(index)); };
		this.reset = function() { callback(merkfix.resetGame()); }
	},
	ServerMemory = function(callback) {
		var socket = io.connect(document.location.protocol + '//' + document.location.hostname);
		function joinGame(id) {
			gameId = id;
			socket.on(gameId, function (data) {
				refresh(data);
			});
		};
		this.createGame = function(numberOfPlayers, gameName) {
			 socket.on('gameCreated', function (data) {
				alert("Game created");
				joinGame(gameName);
			});
			socket.emit('createGame', { 'numberOfPlayers' : numberOfPlayers, 'gameName' : gameName });
		};
		this.joinGame = joinGame;
		this.play = function(index) { 
			socket.emit('play', {gameId : gameId, index : index}); 
		};
		this.reset = function() { 
			socket.emit('reset', {gameId : gameId});
		}
	};
	function draw(index, memorycards) {
		var elm = cardElements[index];
		elm.classList.add('cardshow');
		elm.style.backgroundPositionX = memorycards[index].key * 14.2857 + '%';
	}
	function refresh(token) {
		var i, memorycards = token.memorycards,
		length = memorycards.length, 
		elm;
		for (i = 0; i < length; i++) {
			if (memorycards[i].rotated) {
				draw(i, memorycards);
			} else {
				cardElements[i].classList.remove('cardshow');
			}
		}
		if (token.indexOfFirstRotated !== undefined) {
			draw(token.indexOfFirstRotated, memorycards);
		}
		if (token.indexOfSecondRotated !== undefined) {
			draw(token.indexOfSecondRotated, memorycards);
		}
		document.getElementById('title').innerHTML = 'A: ' + token.activePlayer + ', P: ' + token.points;
	}
	function createClickHandler(index) {
		return function(e) {
			memory.play(index);
		};
	};
	function toggleMenu() {
		document.getElementById('menu').classList.toggle('open');
	};
	function resetGame() {
		memory.reset();
		toggleMenu();
	};
	function newServerGame() {
		var numberOfPlayers = prompt('Anzahl Spieler');
		var gameName = prompt('Spielname');
		memory = new ServerMemory(refresh);
		memory.createGame(numberOfPlayers, gameName);
		toggleMenu();
	};
	function joinServerGame() {
		var gameId = prompt('Game-ID');
		memory = new ServerMemory(refresh);
		memory.joinGame(gameId);
		toggleMenu();
	};
	function register(elm, func) {
		var eventType = ('ontouchstart' in window) ? 'touchstart' : 'click';
		elm.addEventListener(eventType, func, true);
	};
	(function init() {
		var i, allCardElements = document.querySelectorAll('#playground .cardcontent');
		for (i = 0; i < allCardElements.length; i++) { register(allCardElements[i], createClickHandler(i))};
		register(document.getElementById('menubar'), toggleMenu);
		register(document.getElementById('newgamebutton'), resetGame);
		register(document.getElementById('newservergame'), newServerGame);
		register(document.getElementById('joinservergame'), joinServerGame);
		register(document, function(e) {e.preventDefault();});
		memory = new ClientMemory(refresh);
	})();
})(window);

