var $ = require('jquery');
var selector = '#console';

var Message = {
    lastUpdateTime: null,
    say: function (message) {
        this.updateConsole();
        $(selector).prepend('<div class="message info">' + message + '</div>');
    },
    text: function (message) {
        this.updateConsole();
        var $div = $('<div></div>').addClass('message text');
        $div.text(message);
        $(selector).prepend($div);
    },
    alert: function (message) {
        this.updateConsole();
        $(selector).prepend('<div class="message alert">' + message + '</div>');
    },
    cheer: function (message) {
        this.updateConsole();
        $(selector).prepend('<div class="message cheer">&#9829;&#9829;&#9829; ' + message + ' &#9829;&#9829;&#9829;</div>');
    },
    update: function (message) {
        console.log(message);
    },
    title: function (message) {
        if (!! message) {
            $('title').text('Quarto | ' + message);
        } else {
            $('title').text('Quarto');
        }
    },
    updateConsole: function () {
        if (this.shouldUpdateConsole()) {
            $(selector).find('.message').addClass('read');
        }
    },
    shouldUpdateConsole: function () {
        if (this.lastUpdateTime === null) {
            this.lastUpdateTime = new Date();
            return false;
        }
        var current = new Date;
        var diff = current - this.lastUpdateTime;
        if (diff > 2000) {
            this.lastUpdateTime = current;
            return true;
        }
        return false;
    }
};

module.exports = Message;