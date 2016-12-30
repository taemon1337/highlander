var EventSocket = require('./event-socket')
  , PassThrough = require('stream').PassThrough
  , Archiver = require('archiver')
  ;

/*
 *  var testfile = 'test.txt';
 *  var zipfile = 'test.zip';
 *  var es = new EventSocket('ws://localhost:8080');
 *  var readstream = fs.createReadStream(testfile);
 *  var output = fs.createWriteStream(zipfile);
 *
 *  es.on('zip:download', function(data) {
 *    output.write(new Buffer.from(data.chunk, 'base64'));
 *  });
 *
 *  es.send('zip:init',     { id: zipfile, download: true });
 *  es.send('zip:append',   { id: zipfile, name: testfile })
 *  es.pipe( readstream,    { id: zipfile, event: 'zip:chunk' });
 *  es.send('zip:finalize', { id: zipfile });
 *
 */
function WebSocketHandler(socket) {
  if(!(this instanceof WebSocketHandler)) {
    return new WebSocketHandler(socket);
  }
  this.socket = new EventSocket(socket);
  this.archives = {};
  this.passthru = {};

  this.socket.on('zip:init', function(data) {
    if(data.id) {
      this.archives[data.id] = new Archiver('zip', { store: false, zlib: { level: 0 }});

      if(data.download) {
        this.socket.pipe(this.archives[data.id], data);
      }
      if(data.next && data.next.url) {
        console.log("Forwarding Socket to ", data.next.url);
        var that = this;
        var upload_socket = new EventSocket(data.next.url);
        upload_socket.on('open', function() {
          upload_socket.pipe(that.archives[data.id], data.next);
        });
      }
    }
  });

  this.socket.on('zip:append', function(data) {
    if(!data.id) {
      console.error("No id provided!");
    } else if(!data.name) {
      console.error("Appending to a zip requires a name");
    } else if(!this.archives[data.id]) {
      console.error("Archive not initialized!");
    } else {
      var through = new PassThrough();
      var pid = [data.id,data.name].join(':');

      through.on('end', function() { delete this.passthru[pid] });

      this.archives[data.id].append(this.passthru[pid], { name: data.name });
    }
  });

  this.socket.on('zip:chunk', function(data) {
    if(data.id && data.name) {
      var pid = [data.id,data.name].join(':');
      if(this.passthru[pid]) {
        this.passthru[data.id].write(new Buffer.from(data.chunk, 'base64'));
      } else {
        console.error("Invalid Passthrough Id: ", pid);
      }
    } else {
      console.error("No 'id' or 'name' provided!");
    }
  });

  this.socket.on('zip:finalize', function(data) {
    if(!data.id) {
      console.error("No id provided!");
    } else if(!this.archives[data.id]) {
      console.error("No archive for that id!", data.id);
    } else {
      this.archives[data.id].finalize();

      this.archives[data.id].on('close', function() {
        delete this.archives[data.id];
      });
    }
  });
};

WebSocketHandler.prototype = {};

module.exports = WebSocketHandler;
