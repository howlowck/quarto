/**
 * Created by haoluo on 2/2/14.
 */
var Backbone = require('backbone');
var $ = require('jquery');

var Piece = Backbone.Model.extend({
    initialize: function (attr) {
        this.setViewById(attr.name);
        this.setAttributeById(attr.name);
        this.events();
    },

    defaults: {
        state: 'idle',
        name: null,
        position: null,
        color: null,
        size: null,
        shape: null,
        fill: null,
        movable: true
    },

    events: function () {
//        var ins = this;
//        ins.$view.on('click', function () {
//            if (ins.get('state') == 'idle') {
//                ins.addSelect();
//            }
//        });
    },

    addSelect: function() {
        this.set('state', 'selected');
        this.$view.addClass('select');
        this.collection.removeOtherSelects(this);
    },

    removeSelect: function () {
        this.$view.removeClass('select');
        if (this.get('state') == 'selected') {
            this.set('state', 'idle');
        }
    },

    setAttributeById: function (id) {
        var abbr = id.split('');

        if (abbr[0] == 'd') {
            this.set('color', 'dark');
        } else if (abbr[0] == 'w'){
            this.set('color', 'white');
        }

        if (abbr[1] == 'l') {
            this.set('size', 'large');
        } else if (abbr[1] == 's') {
            this.set('size', 'small');
        }

        if (abbr[2] == 'r') {
            this.set('shape', 'rect');
        } else if (abbr[2] == 'c') {
            this.set('shape', 'circle');
        }

        if (abbr[3] == 'h') {
            this.set('fill', 'hollow');
        } else if (abbr[3] == 'f') {
            this.set('fill', 'full');
        }
    },

    setViewById: function (id) {
        this.$view = $('#' + id);
    }
});

module.exports = Piece;