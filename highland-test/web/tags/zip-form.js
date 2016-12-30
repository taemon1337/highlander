<zip-form>
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="pull-right">
        <span class="pointer fa fa-chevron-{ hide ? 'down' : 'up' }" onclick={ toggleHide }></span>
      </div>
      <h3 class="panel-title">
        <span class="fa { valid ? 'fa-check-square-o text-success' : 'fa-square-o' }"></span>
        <span class="pointer" onclick={ toggleHide }> Zip Files</span>
      </h3>
    </div>
    <div if={ !hide } class="panel-body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="control-label col-xs-3">Filename</label>
          <div class="col-xs-9">
            <input onchange={ updateZipName } name="name" type="text" placeholder="out.zip" class="form-control" value={ parent.zip.name }>
          </div>
        </div>
      </form>
    </div>
  </div>

  <script>
    var self = this
    this.hide = opts.hide || true
    this.valid = opts.valid || false

    this.toggleHide = function() {
      this.update({ hide: !self.hide })
    }

    this.updateZipName = function(e) {
      var z = self.parent.zip
      z.name = e.target.value
      self.update({ valid: !!z })
      self.parent.update({ zip: z })
    }
  </script>
</zip-form>
