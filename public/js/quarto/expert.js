var Board = require('./board');
var Message = require('./util/message');
var Dispatch = require('./util/dispatch');

var expert = {
    analyzeBoard: function () {
        var ops = [
            {
                space: 'a1',
                direction: 'horizontal'
            },
            {
                space: 'a2',
                direction: 'horizontal'
            },
            {
                space: 'a3',
                direction: 'horizontal'
            },
            {
                space: 'a4',
                direction: 'horizontal'
            },
            {
                space: 'a1',
                direction: 'vertical'
            },
            {
                space: 'b1',
                direction: 'vertical'
            },
            {
                space: 'c1',
                direction: 'vertical'
            },
            {
                space: 'd1',
                direction: 'vertical'
            },
            {
                space: 'a1',
                direction: 'diagonal'
            },
            {
                space: 'd1',
                direction: 'diagonal'
            }
        ];
        var result = [];
        for (var i = 0 ; i < ops.length; i++) {
            var op = ops[i];
            var res = this.analyzeDirection(op.space, op.direction);
            if (res) {
                result.push(res);
            }
        }
        return result;
    },

    analyzeMove: function (piece) {
        var spaceId = piece.get('position');

        var result = this.analyzeAllDirections(spaceId);
        return result;
    },

    analyzeAllDirections: function (spaceId) {
        var directions = ['horizontal', 'vertical', 'diagonal'];
        result = [];
        for (var i = 0; i < 3; i++) {
            analyzeResult = this.analyzeDirection(spaceId, directions[i])
            if (!! analyzeResult && analyzeResult.reason.length > 0) {
                result.push(analyzeResult);
            }
        }
        return result;
    },

    analyzeDirection: function (spaceId, direction) {
        var pieces = [];
        var result = {
            space: null,
            direction: direction,
            reason: null
        };
        var piece = Board.getSpace(spaceId).get('occupied');
        if (! piece) {
            return false;
        }
        pieces.push(piece);
        coords = Board.getRelatedCoordinates(spaceId, direction);

        if (coords.length == 0) {
            return false;
        }

        coords.push(spaceId);
        for (var i = 0; i < 3; i++) {
            piece = Board.getSpace(coords[i]).get('occupied');
            if ( ! piece ){
                return false;
            }
            pieces.push(piece);
        }
        result.space = spaceId;
        result.reason = this.analyzePieces(pieces);
        if ( ! result ) {
            return false;
        }
        return result;
    },

    analyzePieces: function (pieces) {
        var attrs = ['color', 'size', 'shape', 'fill'];
        var reasons = [];
        var res;
        for (var i = 0; i < 4; i++ ) {
            res = this.analyzeAttr(pieces, attrs[i]);
            if (res) {
                reasons.push(res);
            }
        }
        return reasons;
    },

    analyzeAttr: function (pieces, attr) {
//        console.log(pieces);
        if (pieces[0].get(attr) == pieces[1].get(attr) && pieces[0].get(attr) == pieces[2].get(attr) && pieces[0].get(attr) == pieces[3].get(attr)) {
            return attr;
        }
        return false;
    }
};

module.exports = expert;