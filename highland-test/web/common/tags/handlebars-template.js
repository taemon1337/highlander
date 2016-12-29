riot.tag('handlebars-template','<span></span>', function(opts) {
  if(!Handlebars) {
    console.warn("Cannot find Handlebars, did you load it?");
    return;
  }

  this.updateContent = function() {
    if(opts.template && opts.context) {
      this.root.innerHTML = Handlebars.compile(opts.template)(opts.context)
    }
  };

  this.on('update', function() {
    this.updateContent();
  });

  this.updateContent();
});
