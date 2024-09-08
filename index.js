var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function bin2String(bin) {
    return bin.split(' ').map(bin => {
        return String.fromCharCode(parseInt(bin, 2))
    }).join('')
}

function string2Bin(str) {
    return str.split(' ').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0')
    }).join(' ')
}

function setCharAt(string, i, character) {
    if (i > string.length-1) return string;
    return string.substring(0, i) + character + string.substring(i + 1)
}

//https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-specific-index-in-javascript

global.boardState = '00000000'

app.get('/', function(req, res){
   res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    console.log('A user connected')
    
    socket.emit('board', bin2String(global.boardState))

    socket.on('disconnect', function () {
        console.log('A user disconnected')
    })

    socket.on('change', (msg) => {
        console.log(JSON.parse(msg))
        socket.broadcast.emit('change', msg)

        let location = JSON.parse(msg).location
        let state = ((JSON.parse(msg).state == false) ? '0' : '1')
        global.boardState = setCharAt(global.boardState, parseInt(location), state)
        console.log(global.boardState)
    })
})

http.listen(3000, function(){
   console.log('Listening on Port 3000');
});