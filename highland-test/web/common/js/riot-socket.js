/*
  riot.tag('riot-bind-example','<span></span>', function(opts) {
    this.socket = opts.socket
    this.socket.bind(this, 'records', [])
  });
*/

function BindSocketToRiotTag(sock, tag, key, def) {
  tag[key] = def;

  sock.on(key, function(resp) {
    var updated = {};
    updated[key] = resp;
    tag.update(updated);
  });
};
