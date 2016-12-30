"use strict";

(function() {
  var chunkReaderBlock = function(_offset, length, _file, cb) {
    var r = new FileReader();
    var blob = _file.slice(_offset, length + _offset);
    r.onload = cb;
    r.readAsArrayBuffer(blob);
  }

  var FileReaderStream = function(file, opts) {
    opts = opts || {};
    var fileSize = file.size;
    var chunkSize = opts.chunkSize || 1024*1024; // 1MB
    var offset = opts.offset || 0;
    var self = this;

    var readEventHandler = function(evt) {
      if(evt.target.error == null) {
        console.log("DATA: ", evt.target.result);
        offset += evt.target.result.byteLength;
        $(file).trigger('data',evt.target.result);
      } else {
        console.log("Read error: " + evt.target.error);
        $(file).trigger('error', evt.target.error);
        return;
      }

      if(offset >= fileSize) {
        console.log("Done reading file");
        $(file).trigger('end');
        return;
      }
      chunkReaderBlock(offset, chunkSize, file, readEventHandler); // do next chunk
    };

    file.read = function() {
      console.log('reading...');
      chunkReaderBlock(offset, chunkSize, file, readEventHandler); // start with 1st block
    }
  };

  if(typeof window !== 'undefined') {
    window.FileReaderStream = FileReaderStream;
  }
})();
