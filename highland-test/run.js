var server = require('http').createServer()
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , _ = require('highland')
  , app = express()
  , port = process.env.PORT || 8080
  ;

app.use(express.static('web'));

wss.on('connection', function(socket) {
  console.log("WS CONNECTED");
});

server.on('request', app);
server.listen(port, function() { console.log('Listening on ' + server.address().port) });
