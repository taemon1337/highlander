<home>
  <div class="row">
    <div class="col-xs-12">
      <h3>I want to...</h3>
      <select-files></select-files>

      <button onclick={ sendFiles } type="button" class="btn btn-lg btn-{ files.length ? 'success' : 'default disabled' }">Send Files</button>
    </div>
  </div>
  <script>
    this.files = opts.files || []

    this.sendFiles = function() {
      if(this.files.length) {
        console.log('sending...')
      }
    }
  </script>
</home>
