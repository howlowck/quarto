var Config = require('./config');
var _ = require('underscore');
var Piece = require('./models/piece');
var Pieces = require('./collections/pieces');
var Board = require('./board');
var Space = require('./models/space');
var Expert = require('./expert');
var Player = require('./models/player');
var Message = require('./util/message');
var Dispatch = require('./util/dispatch');

pieces = new Pieces();
players = new Backbone.Collection();
Events = Backbone.Events;

var Game = {
    init: function () {
        var ins = this;
        var offsetX;
        var offsetY;
        $('.piece')
            .on('dragstart', function (evt) {
                var e = evt.originalEvent;
                e.dataTransfer.setData('text', this.id);
                offsetX = evt.originalEvent.offsetX;
                offsetY = evt.originalEvent.offsetY;
            })
            .on('drag', function (evt) {
                var data = {
                    piece: evt.currentTarget.id,
                    x: evt.originalEvent.offsetX - offsetX,
                    y: evt.originalEvent.offsetY - offsetY,
                    last: (evt.originalEvent.clientX == 0 && evt.originalEvent.clientY == 0)
                };
                Dispatch.trigger('dragPiece', data);
            })
            .on('dragend', function () {
                $('.space').removeClass('drag-over');
                $(this).css('position', 'relative');
                Dispatch.trigger('dragend', {piece: this.id});
            });

        $('.space')
            .on('dragenter', function () {
                $(this).addClass('drag-over');
            })
            .on('dragover', function (evt) {
                evt.preventDefault();
            })
            .on('dragleave', function () {
                $(this).removeClass('drag-over');
            })
            .on('drop', function (evt) {
                var e = evt.originalEvent;
                pieceId = e.dataTransfer.getData('text');
                ins.movePiece(pieceId, this.id);
                Dispatch.trigger('dropPiece', {piece: pieceId, space: this.id});
                ins.updateGame();
            });

        $('.readyMoveButton').on('click', function () {
            if ( ! $('html').hasClass('current-player')) {
                return;
            }
           ins.nextMove();
        });

        $('.pieces .piece').on('click', function () {
            if ( $('html').hasClass('current-player') && $(this).parent().hasClass('pieces')) {
                var piece = ins.getPiece(this.id);
                piece.addSelect();
                Dispatch.trigger('selectPiece', {piece: piece});
            }
        });

        this.events();

    },
    ready: false, //Game Ready? Are All Players Present?
    started: false, //Game Started? Is move count > 0?
    inPlay: true, //Game is actively inplay or just displaying..
    pieces: pieces,
    players: players,
    you: null,
    currentPlayer: null,
    nextButton: $('.readyMoveButton'),
    events: function () {
        var ins = this;
        Dispatch.on('gameStarted', function () {
            ins.analyzeProgress();
        });
        Dispatch.on('gameend', function() {
            Board.lockBoard();
            if (ins.isCurrentPlayer()) {
                Message.cheer('You won!!');
            } else {
                Message.alert('sorry you didn\'t win');
            }
        });

    },
    bindMoveEvents: function () {
        this.move.on('change', this.handleMoveChange, this);
    },
    getPiece: function (id) {
        return this.pieces.findWhere({name: id});
    },

    setUpPieces: function () {
        var ins = this;
        _.each(Config.pieces, function (pieceId) {
            ins.pieces.add(new Piece({name: pieceId}));
        });
        _.each(Config.spaces, function (space) {
            Board.spaces.add(new Space(space));
        });
        ins.pieces.on('change:state', this.handlePieceStateChange, this);
        Dispatch.trigger('pieces:setup');
    },
    addPlayer: function (attr, self) {
        var name = attr.name;
        var player = new Player(attr);
        this.players.add(player);

        if (self) {
            this.you = player;
            Message.say(name + ' (you) entered the game');
        } else {
            Message.say(name + ' entered the game');
        }

        if (self && this.players.length < 2 && ! this.playerMatch) {
            Message.say('pass this url: <br>'+ location.href +'<br> to a friend to start a game');
        } else if (self && this.players.length < 2 && this.playerMatch) {
            Message.say('please be patient... wait for another player to join');
        } else if (! self && this.players.length == 2 && this.playerMatch) {
            Message.say('your patience paid off! Player found');
        }

    },
    removePlayer: function (name) {
        this.players.remove(this.players.findWhere({name: name}));
    },
    newGame: function () {
        this.firstMove();
        this.setUpPieces();
    },
    startGame: function () {
    },
    setCurrentPlayer: function (attr) {
        this.currentPlayer = this.players.findWhere(attr);

        if (this.you == this.currentPlayer) {
            $('html').addClass('current-player');
            Message.title('Your Turn!');
            Message.say('you now have the move');
        } else {
            $('html').removeClass('current-player');
            Message.title('Not Your Turn!');
            Message.say('Player: ' + this.currentPlayer.get('name') + ' now has the move.');
        }
        if (this.move.get('first')) {
            Dispatch.trigger('gameStarted');
        }
    },
    isCurrentPlayer: function () {
        return this.you == this.currentPlayer;
    },
    handlePieceStateChange: function (model, value) {
        if (value == 'selected') {
            this.move.set('selected', true);
        }
        this.updateGame();
    },
    handleMoveChange: function () {
        this.analyzeProgress();
    },
    validateGameReady: function () {
        var players = this.players.where({inGame: true});
        if (players.length == 2) {
            this.ready = true;
        }
        this.updateGame();
    },
    setBoard: function (board) {
        var ins = this;
        _.each(board, function (space) {
            if (!! space.occupied) {
                console.log(space.occupied);
                Board.setSpace(space.name, space.occupied);
                $('#' + space.name).append($('#' + space.occupied));
            }
        });
    },
    validateMove: function () {
        if (this.ready == false) {
            return Config.messages['game-not-ready'];
        }
        if (this.move.get('count') == 0)  {
            if (this.move.get('selected') === false) {
                return Config.messages['missing-select'];
            }
            return Config.messages['next-move'];
        }

        if (this.move.get('selected') === false) {
            return Config.messages['missing-select'];
        }

        if (this.move.get('moved') === false) {
            return Config.messages['missing-move'];
        }

        return Config.messages['next-move'];
    },
    updateGame: function () {
        if (this.validateMove().bool && this.isCurrentPlayer()) {
            this.nextButton.attr('disabled', false);
        }
    },
    selectPiece: function (pieceId) {
        this.getPiece(pieceId).addSelect();
    },

    preparePiece: function (pieceId) {
        var piece = this.getPiece(pieceId);
        $('.waiting-area').append(piece.$view);
        piece.$view.attr('draggable', true);
        piece.removeSelect();
        this.pieces.removeOtherSelects();
    },

    movePiece: function(pieceId, spaceId) {
        var piece = this.getPiece(pieceId);
        piece.set('state', 'inplay');
        piece.set('position', spaceId);
        var setBoard = Board.setSpace(spaceId, piece);
        if (setBoard) {
            $('#' + spaceId).append(piece.$view);
            this.move.set('moved', true);
        }
        Board.refreshBoard();
        this.processAnalysis(Expert.analyzeMove(piece));

    },

    processAnalysis: function (results) {
        if (results.length > 0) {
            Dispatch.trigger('gameend', {player: this.you.get('socket'), reasons: results.reasons});
            _.each(results, function(result) {
                Board.drawWin(result.space, result.direction);
            });
        }
    },

    firstMove: function () {
        this.move = new Backbone.Model({
            count: 0,
            moved: false,
            selected: false,
            first: true
        });
        this.bindMoveEvents();
    },

    nextMove: function () {
        var count = this.move.get('count');
        this.move.set('count', count + 1, {silent: true});
        this.move.set('moved', false, {silent: true});
        this.move.set('selected', false, {silent: true});
        this.move.set('first', false, {silent: true});
        this.nextButton.attr('disabled', true);
        Board.lockBoard();
        Dispatch.trigger('nextMove');
    },
    newMove: function () {
        var count = this.move.get('count', {silent: true});
        this.move.set('count', count + 1, {silent: true});
        this.move.set('moved', false, {silent: true});
        this.move.set('selected', false, {silent: true});
        this.move.set('first', false, {silent: true});
        this.nextButton.attr('disabled', true);
        this.analyzeProgress();
    },
    analyzeProgress: function () {
        console.log(this.move);
        if ( ! this.isCurrentPlayer()) {
            return;
        }
        if ( this.move.get('selected') && this.move.get('first')) {
            Message.say('Click Next Move to finish your move');
            return;
        }
        if ( ! this.move.get('moved') && ! this.move.get('first')) {
            Message.say('Move piece from Waiting Area');
        } else if ( ! this.move.get('selected')) {
            Message.say('Select a Piece for the next move');
        } else {
            Message.say('Click Next Move to finish your move');
        }
    },
    disableMatchInput: function () {
        $('#nobody').attr('disabled', true);
        $('#nobody-label').addClass('disabled');
    }
};

module.exports = Game;
