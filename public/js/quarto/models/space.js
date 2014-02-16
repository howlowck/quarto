var Backbone = require('backbone');

var Space = Backbone.Model.extend({
    initialize: function (attr) {
        this.$view = $('#' + attr.name);
    },

    defaults: {
        occupied: null,
        name: null,
        horizontal: [],
        vertical: [],
        diagonal: []
    }
});

module.exports = Space;