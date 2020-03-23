var Config = {
    url: function() {
        if (location.href.indexOf('lifeishao') < 0) {
            return 'http://localhost:2060';
        }
        return 'http://206.189.197.33:2060';
    },
    pieces: [
        'dlrh', 'wlrh', 'dsrh', 'wsrh', 'dlch', 'wlch', 'dsch', 'wsch',
        'dlrf', 'wlrf', 'dsrf', 'wsrf', 'dlcf', 'wlcf', 'dscf', 'wscf'
    ],
    spaces: [
        {
            name: 'a4',
            horizontal: ['b4', 'c4', 'd4'],
            vertical: ['a3', 'a2', 'a1'],
            diagonal: ['b3', 'c2', 'd1']
        },
        {
            name: 'a3',
            horizontal: ['b3', 'c3', 'd3'],
            vertical: ['a4', 'a2', 'a1'],
            diagonal: []
        },
        {
            name: 'a2',
            horizontal: ['b2', 'c2', 'd2'],
            vertical: ['a4', 'a3', 'a1'],
            diagonal: []
        },
        {
            name: 'a1',
            horizontal: ['b1', 'c1', 'd1'],
            vertical: ['a4', 'a3', 'a2'],
            diagonal: ['d4', 'c3', 'b2']
        },
        {
            name: 'b4',
            horizontal: ['a4', 'c4', 'd4'],
            vertical: ['b3', 'b2', 'b1'],
            diagonal: []
        },
        {
            name: 'b3',
            horizontal: ['a3', 'c3', 'd3'],
            vertical: ['b4', 'b2', 'b1'],
            diagonal: ['a4', 'c2', 'd1']
        },
        {
            name: 'b2',
            horizontal: ['a2', 'c2', 'd2'],
            vertical: ['b4', 'b3', 'b1'],
            diagonal: ['a1', 'c3', 'd4']
        },
        {
            name: 'b1',
            horizontal: ['a1', 'c1', 'd1'],
            vertical: ['b4', 'b3', 'b2'],
            diagonal: []
        },
        {
            name: 'c4',
            horizontal: ['a4', 'b4', 'd4'],
            vertical: ['c3', 'c2', 'c1'],
            diagonal: []
        },
        {
            name: 'c3',
            horizontal: ['a3', 'b3', 'd3'],
            vertical: ['c4', 'c2', 'c1'],
            diagonal: ['d4', 'b2', 'a1']
        },
        {
            name: 'c2',
            horizontal: ['a2', 'b2', 'd2'],
            vertical: ['c4', 'c3', 'c1'],
            diagonal: ['a4', 'b3', 'd1']
        },
        {
            name: 'c1',
            horizontal: ['a1', 'b1', 'd1'],
            vertical: ['c4', 'c3', 'c2'],
            diagonal: []
        },
        {
            name: 'd4',
            horizontal: ['a4', 'b4', 'c4'],
            vertical: ['d3', 'd2', 'd1'],
            diagonal: ['c3', 'b2', 'a1']
        },
        {
            name: 'd3',
            horizontal: ['a3', 'b3', 'c3'],
            vertical: ['d4', 'd2', 'd1'],
            diagonal: []
        },
        {
            name: 'd2',
            horizontal: ['a2', 'b2', 'c2'],
            vertical: ['d4', 'd3', 'd1'],
            diagonal: []
        },
        {
            name: 'd1',
            horizontal: ['a1', 'b1', 'c1'],
            vertical: ['d4', 'd3', 'd2'],
            diagonal: ['a4', 'b3', 'c2']
        }
    ],
    messages: {
        'win': {
            bool: true,
            type: 'success',
            message: 'you won! :D'
        },
        'lose': {
            bool: true,
            type: 'info',
            message: 'you lost :('
        },
        'game-not-ready': {
            bool: false,
            type: 'error',
            message: 'The game is not ready to play yet.. probably not enough players'
        },
        'missing-move': {
            bool: false,
            type: 'error',
            message: 'you have to place the piece on the board'
        },
        'missing-select': {
            bool: false,
            type: 'error',
            message: 'you have to select a piece from the available pieces'
        },
        'next-move': {
            bool: true,
            type: 'success',
            message: 'good to go!'
        }
    }
};

module.exports = Config;
