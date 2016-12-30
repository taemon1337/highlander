"use strict";

(function(exports) {
  var root = this;
  var WebSocket = require('ws');

  var convertToBase64 = function(chunk) {
    return new Buffer(chunk, 'binary').toString('base64');
  };

  var streamFile = function(self, stream, data, conn) {
    var count = 0;
    var stream_id = data.id || Math.random().toString().replace(".","");
    var stream_evt = data.event || "stream";

    stream.on('data', function(chunk) {
      var encoded = convertToBase64(chunk);
      var event_data = { id: stream_id, count: count, chunk: encoded };
      for(var key in data) { event_data[key] = data[key]; }
      var payload = JSON.stringify({ event: stream_evt, data: event_data });

      conn.send(payload);
      count += 1;
    });

    stream.on('end', function() {
      var event_data = { id: stream_id, count: count };
      for(var key in data) { event_data[key] = data[key]; }
      var payload = JSON.stringify({ event: stream_evt, data: event_data });
      conn.send(payload);
    });

    return this;
  };

  var EventSocket = function(url_or_socket) {
    if(!(this instanceof EventSocket)) {
      return new EventSocket(url_or_socket);
    }
    var conn = null;

    if(typeof url_or_socket === 'string') {
      var conn = new WebSocket(url_or_socket);
    } else {
      var conn = url_or_socket;
    }

    var callbacks = {};

    this.on = this.bind = function(event_name, callback) {
      callbacks[event_name] = callbacks[event_name] || [];
      callbacks[event_name].push(callback);
      return this; //chainable
    };

    this.send = function(event_name, event_data) {
      var payload = JSON.stringify({ event: event_name, data: event_data });
      conn.send(payload);
      return this;
    };

    this.pipe = function(stream, data) {
      return streamFile(this, stream, data, conn);
    };

    conn.onmessage = function(evt) {
      var json = JSON.parse(evt.data);
      dispatch(json.event, json.data);
    };

    conn.onclose = function() { dispatch('close', null) }
    conn.onopen = function() { dispatch('open',null) }

    var dispatch = function(event_name, message) {
      var chain = callbacks[event_name];
      if(typeof chain === 'undefined') { return; }
      for(var i=0; i < chain.length; i++) {
        chain[i]( message );
      }
    };
  };

  if(typeof module === 'undefined') {
    exports = EventSocket;
  } else {
    exports = module.exports = EventSocket;
  }

})(exports);
