riot.compile(function() {
  var currentTag = null;

  function mount(tag, opts) {
    currentTag && currentTag.unmount(true)
    currentTag = riot.mount('#main', tag, opts)[0]
  }

  var routes = {
    home: function(id, action) {
      mount('home')
    }
  };

  function handler(collection, id, action) {
    var fn = routes[collection || 'home']
    fn ? fn(id, action) : console.error("No route found: ", collection, id, action)
  }

  riot.route(handler)
  riot.mount('*')
  riot.route.exec(handler)
  riot.route.start();
});
