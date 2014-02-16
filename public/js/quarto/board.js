/**
 * Created by haoluo on 2/2/14.
 */
var Backbone = require('backbone');

var spaces = new Backbone.Collection();

var Board = {
    setSpace: function (spaceId, piece) {
        var space = this.getSpace(spaceId);
        if ( !! space.get('occupied')) {
            return false;
        }
        space.set('occupied', piece);
        return true;
    },

    drawWin: function (spaceId, direction) {
        var ins = this;
        var space = ins.getSpace(spaceId).$view.addClass('win');
        _.each(ins.getRelatedCoordinates(spaceId, direction), function (spaceId) {
            ins.getSpace(spaceId).$view.addClass('win');
        });
    },

    spaces: spaces,

    getSpace: function (spaceId) {
        return this.spaces.findWhere({name: spaceId});
    },

    getRelatedCoordinates: function (spaceId, direction) {
        var space = this.getSpace(spaceId);
        return space.get(direction);
    },

    refreshBoard: function () {
        this.refreshOccupied();
    },
    refreshOccupied: function () {
        this.spaces.each(function (space) {
            if (space.$view.find('.piece').length < 1) {
                space.set('occupied', null);
            }
        });
    },
    lockBoard: function () {
        this.spaces.each(function (space) {
            space.$view.find('.piece').attr('draggable', false);
        });
    }
};

module.exports = Board;