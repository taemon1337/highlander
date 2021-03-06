<select-files>
  <input onchange={ addFiles } class='hidden' type='file', id='files' multiple />

  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="pull-right">
        <span class="pointer fa fa-chevron-{ hide ? 'down' : 'up' }" onclick={ toggleHide }></span>
      </div>
      <h3 class="panel-title">
        <span class="fa { valid ? 'fa-check-square-o text-success' : 'fa-square-o' }"></span>
        <span class="pointer" onclick={ openDialog }> Select Files</span>
        <small if={ files.length }>({ files.length } selected)</small>
      </h3>
    </div>
    <div if={ !hide } class="panel-body">
      <div if={ files.length } class="list-group">
        <div each={ files } class="file-item list-group-item">
          <span title='Add a note' onclick={ editNote } class="pointer fa fa-pencil-square-o pull-left"></span>
          <b>{ name }</b>
          <span class='pull-right' style="font-size:80%;">({ humanFileSize(size) })</span>
        </div>
      </div>
    </div>
  </div>

  <style>
    .pointer {
      cursor:pointer;
    }
  </style>

  <script>
    var self = this
    this.openDialog = function() { $('#files').click() }
    this.hide = opts.hide || true
    this.valid = opts.valid || false

    this.toggleHide = function() {
      this.update({ hide: !self.hide })
    }

    this.addFiles = function(e) {
      var files = self.parent.files
      var names = files.map(function(f) { return f.name })
      for(var i=0; i<e.target.files.length; i++) {
        if(names.indexOf(e.target.files[i].name) === -1) {
          files.push(e.target.files[i])
        }
      }
      self.update({ hide: false, valid: files.length > 0 })
      self.parent.update({ files: files })
    }

    this.editNote = function(e) {
      Popup({ title: "Add note about " + e.item.name }).one('save', function(evt, body) {
        e.item.note = body.value;
      });
    }

    this.on('update', function() {
      for(var i=0; i<this.files.length; i++) {
        var file = this.files[i];
//        $(file).off('progress')
        $(file).on('progress', function(p) {
          $(".file-item:eq("+i+")").css("background","-webkit-linear-gradient(left, green "+p.percent+"%, white "+(100-p.percent)+"%)")
        })
      }
    })
  </script>
</select-files>
