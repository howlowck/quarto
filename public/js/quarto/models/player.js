/**
 * Created by haoluo on 2/2/14.
 */

var Backbone = require('backbone');

var Player = Backbone.Model.extend({
    initialize: function () {
        return this;
    },
    defaults: {
        socket: null,
        inGame: false,
        name: null
    },
    canMove: function () {
        return this.currentMove;
    }
});

module.exports = Player;