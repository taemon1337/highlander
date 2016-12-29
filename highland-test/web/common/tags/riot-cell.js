riot.tag('riot-cell','<span></span>', function(opts) {
  this.updateContent = function() {
    if(opts.text) {
      this.root.innerHTML = opts.text;
    } else if(opts.glyphicon) {
      this.root.className = "glyphicon glyphicon-"+opts.glyphicon;
    } else if(opts.fa) {
      this.root.className = "fa fa-"+opts.fa;
    } else if(opts.template && opts.record) {
      this.root.innerHTML = riot.util.tmpl(opts.template,opts.record)
    } else if(opts.field && opts.record) {
      this.root.innerHTML = opts.record[opts.field];
    }
    if(opts.title) {
      this.root.setAttribute('title', opts.title);
    }
  };

  this.on('update', function() {
    this.updateContent();
  });

  this.updateContent();
});
