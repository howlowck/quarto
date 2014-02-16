var Backbone = require('backbone');
var Client = require('socket.io-client');

var Socket = {
    connected: false,
    callbacks: {},
    connect: function (route) {
        var io = Client.connect('http://' + document.location.hostname +':2060');
        this.connected = true;
        this.io = io;
        this.enrollCallbacks();
    },
    register: function (name, callback) {
        if (this.connected) {
            this.io.on(name, callback);
            return;
        }
        if ( typeof this.callbacks[name] == 'undefined') {
            this.callbacks[name] = [];
        }
        this.callbacks[name].push(callback);
    },
    enrollCallbacks: function () {
        for (var prop in this.callbacks) {
            if (this.callbacks.hasOwnProperty(prop)) {
                var callbacks = this.callbacks[prop];
                for (var i = 0; i < callbacks.length; i++) {
                    this.io.on(prop, callbacks[i]);
                }
            }
        }
    }
};

module.exports = Socket;