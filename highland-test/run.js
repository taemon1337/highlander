var server = require('http').createServer()
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , _ = require('highland')
  , app = express()
  , WebSocketHandler = require('./lib/websocket_handler')
  , WebFormHandler = require('./lib/webform_handler')
  , port = process.env.PORT || 8080
  ;

app.use(express.static('web'));

app.post('/', function(req, res) {
  return WebFormHandler(req, res);
});

wss.on('connection', function(socket) {
  WebSocketHandler(socket);
});

server.on('request', app);
server.listen(port, function() { console.log('Listening on ' + server.address().port) });
