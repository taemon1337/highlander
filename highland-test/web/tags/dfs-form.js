<dfs-form>
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="pull-right">
        <span class="pointer fa fa-chevron-{ hide ? 'down' : 'up' }" onclick={ toggleHide }></span>
      </div>
      <h3 class="panel-title">
        <span class="fa { valid ? 'fa-check-square-o text-success' : 'fa-square-o' }"></span>
        <span class="pointer" onclick={ toggleHide }> DFS Form</span>
      </h3>
    </div>
    <div if={ !hide } class="panel-body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="control-label col-xs-3">Reference Id</label>
          <div class="col-xs-9">
            <input onchange={ updateField } name="reference_id" type="text" placeholder="issue or case #..." class="form-control" value={ parent.dfs.reference_id }>
          </div>
        </div>

        <div class="form-group">
          <label class="control-label col-xs-3">Add Message</label>
          <div class="col-xs-9">
            <textarea onchange={ updateField } rows='6' name='message' class='form-control' placeholder='enter message...'>
              { parent.dfs.message }
            </textarea>
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

    this.updateField = function(e) {
      var dfs = self.parent.dfs;
      dfs[e.target.name] = e.target.value;
      self.update({ valid: !!dfs.reference_id })
      self.parent.update({ dfs: dfs });
    }
  </script>
</dfs-form>
