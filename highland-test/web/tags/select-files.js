<select-files>

  <input onchange={ addFiles } class='hidden' type='file', id='files' multiple />

  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="pull-right">
        <span class="fa fa-chevron-{ hide ? 'down' : 'up' }" onclick={ toggleHide }></span>
      </div>
      <h3 class="panel-title">
        <span class="pointer" onclick={ openDialog }> Select Files</span>
        <small if={ files.length }>({ files.length } selected)</small>
      </h3>
    </div>
    <div if={ !hide } class="panel-body">
      <div class="list-group">
        <div each={ files } class="list-group-item">
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
      self.update({ hide: false })
      self.parent.update({ files: files, hide: false })
    }

    this.editNote = function(e) {
      e.item.note = prompt('Add note about ' + e.item.name) || "";
    }
  </script>
</select-files>
