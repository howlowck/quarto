var Backbone = require('backbone');

var Route = Backbone.Router.extend({
    initialize: function () {
        console.log('route initialized');
    },
    routes: {
        "": "root",
        ":gameid": "joinGame"
    },
    root: function () {
        this.isRoot = true;
        this.gameId = false;
    },
    joinGame: function (id) {
        this.isRoot = false;
        this.gameId = id;
    },
    getCurrentGameId: function () {
        return this.gameId;
    }
});



module.exports = Route;