<home>
  <div class="row">
    <div class="col-xs-12">
      <h3>I want to...</h3>
      <select-files></select-files>
      <dfs-form></dfs-form>
      <zip-form></zip-form>

      <div each={ file in files }>
        <file-progress-bar file={ file }></file-progress-bar>
      </div>

      <button onclick={ send } type="button" class="btn btn-lg btn-{ validated ? 'success' : 'default disabled' }">Send Files</button>
      <button onclick={ reset } type="button" class="btn btn-lg btn-default">Reset</button>

      <div if={ download }>
        <a class="download" href="" download={ zip.name }>Save As</a>
      </div>
    </div>
  </div>
  <script>
    this.files = opts.files || []
    this.dfs = opts.dfs || {}
    this.zip = opts.zip || { name: Math.random().toString().replace(".","")+".zip" }
    this.validated = opts.validated || false
    this.download = opts.download || true

    this.validate = function() {
      this.update({ validated: this.tags['select-files'].valid && this.tags['dfs-form'].valid && this.tags['zip-form'].valid })
    }

    this.send = function() {
      var self = this
      if(this.validated) {
        var es = new EventSocket('ws://'+window.location.host);
        var download = document.createElement("a");
        download.download = this.zip.name;
        download.uri = "data:Application/octet-stream;base64,";

        es.on('open', function() {
          var id = Math.random().toString().replace('.','')

          es.send('zip:init', { id: id })

          es.on('zip:download', function(data) {

          });

          self.files.forEach(function(file) {
            es.send('zip:append', { id: id, name: file.name })
            es.pipe( file, { id: id, name: file.name, event: "zip:chunk" })
          })
          es.send('zip:finalize', { id: id })
        });
      } else {
        this.validate();
      }
    }

    this.reset = function() {
      var a = confirm("Are you sure you want to reset everything?")
      if(a) {
        window.location = '/';
      }
    }

    this.on('update', function() {
      this.validate()
    });

  </script>
</home>
