var $ = require('jquery');
var _ = require('underscore');
var Game = require('./quarto/game');
var Board = require('./quarto/board');
var Socket = require('./quarto/socket');
var Message = require('./quarto/util/message');
var Dispatch = require('./quarto/util/dispatch');
var Route = require('./quarto/route');

Dispatch.on('pieces:setup', function () {
    console.log('the pieces are set up!!!');
});

Game.init();
Game.newGame();

var route = new Route();

Backbone.history.start();


Socket.register('connected', function () {
    if ( ! route.getCurrentGameId()) {
        Socket.io.emit('getId');
    } else {
        Socket.io.emit('register', route.getCurrentGameId());
    }
});

Socket.register('gotId', function (gameId) {
    console.log('I got a gameID of: ' + gameId);
    route.navigate(gameId);
    Socket.io.emit('register', gameId);
});

Socket.register('registered', function (data) {
    Message.say('The game was registered to the Server!');

    _.each(data.players, function (player) {
        Game.addPlayer(player);
    });

    var name = $('#player-name').val();
    var attr = {socket: data.socket, name: name};
    Socket.io.emit('newPlayer', attr);
    Game.validateGameReady();
});

Socket.register('playerJoined', function (data) {
    Game.addPlayer(data.player, data.self);
    Game.validateGameReady();
});

Socket.register('gameReady', function (data) {
});

Socket.register('pickedStartPlayer', function (data) {
    Game.setCurrentPlayer(data.player);
});

Dispatch.on('selectPiece', function (data) {

    Socket.io.emit('selectPiece', {piece: data.piece.get('name')});
});

Socket.register('selectedPiece', function (data) {
    Game.selectPiece(data.piece);
});

Dispatch.on('nextMove', function (data) {
    Socket.io.emit('nextMove', null);
});

Socket.register('nextMove', function(data) {
    Game.preparePiece($('.piece.select').first().attr('id'));
    Game.setCurrentPlayer(data.player);
    Game.newMove();
    $('.waiting-area .piece').attr('draggable', Game.isCurrentPlayer());
});

Dispatch.on('dragPiece', function (data) {
   //data = {piece, x , y}
    Socket.io.emit('dragPiece', data);
});

Socket.register('draggedPiece', function (data) {
    console.log(data);
    if (data.last) {
        return;
    }
    $('#' + data.piece).css(
        {position: 'absolute',
         left: data.x,
         top: data.y,
         'z-index': 100
        }
    );
});

Dispatch.on('dragend', function (data) {
//    data = {piece};

    Socket.io.emit('dragend', data);
});

Socket.register('dragended', function (data) {
    console.log('drag ended');
    console.log(data);
    $('#' + data.piece).css({
        position: 'relative',
        left: 'default',
        top: 'default'
    });
});

Dispatch.on('dropPiece', function (data) {
    //data = {piece, space}
    Socket.io.emit('dropPiece', data);
});

Socket.register('droppedPiece', function (data) {
    $('#' + data.piece).css({
        position: 'relative',
        left: 'default',
        top: 'default'
    });
    Game.movePiece(data.piece, data.space);
});

Socket.register('exit', function (data) {
    // TODO: more user detail
    Game.removePlayer(data.player.name);
    Message.say(data.player.name + ' left the game');
});

$('#connect').on('submit', function () {
    if ($('#player-name').val().length > 0) {
        Socket.connect(route);
        $('#overlay').addClass('hidden');
    }
    return false;
});

window.game = Game;
window.board = Board;
window.route = route;
window.message = Message;
window.dispatch = Dispatch;
