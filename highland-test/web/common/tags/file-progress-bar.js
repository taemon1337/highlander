riot.tag('file-progress-bar', "<div class='progress'></div>", function(opts) {
  var self = this;
  this.file = opts.file
  this.title = opts.title || opts.file.name

  this.bar = $('<div class="progress-bar progress-bar-striped" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>');

  this.on('mount', function() {
    this.root.firstChild.appendChild( this.bar[0] )
  })

  $(this.file).on('progress', function(evt, p) {
    $(self.bar)
      .width(p.percent+"%")
//      .html(p.percent+"% - <span style='font-size:70%;'>"+self.title+"</small>")
      .html(p.percent+"%")
      .attr('aria-valuenow', p.percent)
      .removeClass('progress-bar-success progress-bar-info progress-bar-danger')
      .addClass('progress-bar-'+(p.status || 'info'))
    ;
  });
});

