"use strict";

(function() {
  var root = this;

  var convertToBase64 = function(dataurl) {
    return dataurl.split(',')[1];
  };

  var chunkReaderBlock = function(_offset, length, _file, cb) {
    var r = new FileReader();
    var blob = _file.slice(_offset, length + _offset);
    r.onload = cb;
    r.readAsDataURL(blob);
  }

  var streamFile = function(self, file, data, conn) {
    var fileSize = file.size;
    var filename = file.name;
    var chunkSize = data.chunkSize || 1024*1024; // 1MB
    var offset = data.offset || 0;
    var count = 0;
    var stream_id = data.id || Math.random().toString().replace(".","");
    var stream_evt = data.event || "stream";

    var sendChunk = function(evt) {
      if(evt.target.error == null) {
        offset += evt.target.result.length;
        var encoded = convertToBase64(evt.target.result);
        var event_data = { id: stream_id, count: count, chunk: encoded };
        for(var key in data) { event_data[key] = data[key]; }
        var payload = JSON.stringify({ event: stream_evt, data: event_data });

        conn.send(payload);
        $(file).trigger('progress', { percent: Math.floor(offset/fileSize*100), status: "info" });
        count += 1;
      } else {
        console.error("Error reading file ", evt.target.error);
        $(file).trigger('progress', { percent: Math.floor(offset/fileSize*100), status: "danger" });
        return;
      }

      if(offset >= fileSize) {
        console.log("Done reading file");
        var event_data = { id: stream_id, count: count, chunk: null };
        for(var key in data) { event_data[key] = data[key]; }
        var payload = JSON.stringify({ event: stream_evt, data: event_data });

        conn.send(payload);
        $(file).trigger('progress', { percent: 100, status: "success" });
        return;
      }
      chunkReaderBlock(offset, chunkSize, file, sendChunk); // do next chunk
    };

    chunkReaderBlock(offset, chunkSize, file, sendChunk); // start with 1st block
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

  window.EventSocket = EventSocket;
})();
