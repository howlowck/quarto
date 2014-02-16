/**
 * Created by haoluo on 2/3/14.
 */
var Backbone = require('backbone');
var Piece = require('../models/piece');

var Pieces = Backbone.Collection.extend({
    model: Piece,
    onPieceClick: function (piece) {
        this.removeOtherSelects();
    },
    removeOtherSelects: function (orgPiece) {
        this.each(function(piece) {
            if (piece != orgPiece) {
                piece.removeSelect();
            }
        });
    }
});

module.exports = Pieces;