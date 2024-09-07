var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
   res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    console.log('A user connected')
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected')
    })

    socket.on('change', (msg) => {
        console.log(JSON.parse(msg))
        socket.broadcast.emit('change', msg)
    })
})

http.listen(3000, function(){
   console.log('listening on *:3000');
});