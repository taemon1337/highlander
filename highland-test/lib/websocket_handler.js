var EventSocket = require('../web/common/js/es/event-socket-node')
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
  var self = this;
  if(!(self instanceof WebSocketHandler)) {
    return new WebSocketHandler(socket);
  }
  self.socket = new EventSocket(socket);
  self.archives = {};
  self.passthru = {};

  self.socket.on('zip:init', function(data) {
    if(data.id) {
      self.archives[data.id] = new Archiver('zip', { store: false, zlib: { level: 0 }});

      if(data.download) {
        self.socket.pipe(self.archives[data.id], { id: data.id, event: "zip:download" });
      }
      if(data.next && data.next.url) {
        console.log("Forwarding Socket to ", data.next.url);
        var that = self;
        var upload_socket = new EventSocket(data.next.url);
        upload_socket.on('open', function() {
          upload_socket.pipe(that.archives[data.id], data.next);
        });
      }
    }
  });

  self.socket.on('zip:append', function(data) {
    if(!data.id) {
      console.error("No id provided!");
    } else if(!data.name) {
      console.error("Appending to a zip requires a name");
    } else if(!self.archives[data.id]) {
      console.error("Archive not initialized!");
    } else {
      var through = new PassThrough();
      var pid = [data.id,data.name].join(':');
      console.log("APPEND: ", data);

      through.on('end', function() { delete self.passthru[pid] });

      self.archives[data.id].append(through, { name: data.name });
      self.passthru[pid] = through;
    }
  });

  self.socket.on('zip:chunk', function(data) {
    if(data.id && data.name) {
      var pid = [data.id,data.name].join(':');
      if(self.passthru[pid]) {
        console.log("CHUNK: ",data.chunk);
        if(data.chunk) {
          self.passthru[pid].write(new Buffer.from(data.chunk, 'base64'));
        } else {
          console.log("END OF STREAM ", pid);
          self.passthru[pid].end();
        }
      } else {
        console.error("Invalid Passthrough Id: ", pid);
      }
    } else {
      console.error("No 'id' or 'name' provided!");
    }
  });

  self.socket.on('zip:finalize', function(data) {
    if(!data.id) {
      console.error("No id provided!");
    } else if(!self.archives[data.id]) {
      console.error("No archive for that id!", data.id);
    } else {
      self.archives[data.id].finalize();

      self.archives[data.id].on('close', function() {
        delete self.archives[data.id];
      });
    }
  });
};

WebSocketHandler.prototype = {};

module.exports = WebSocketHandler;
