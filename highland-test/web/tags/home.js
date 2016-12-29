<home>
  <input onchange={ showFiles } class='hidden' type='file', id='files' multiple />
  <h3>I want to...</h3>
  <button onclick={ openDialog } class="btn btn-block btn-lg btn-primary">
    Select Files
  </button>

  <div class="list-group">
    <a each={ files } href="{ name }">
      { name } <span style="font-size:80%;">({ size })</span>
    </a>
  </div>

  <script>
    this.openDialog = function() { $('#files').click() }
    this.files = opts.files || []

    
  </script>
</home>
