<modal>
  <div id={ modalId } class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div if={ title } class="modal-header">
          <span class="close pull-right" data-dismiss="modal">&times;</span>
          { title }
        </div>

        <div class="modal-body">
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    this.title = opts.title || ""
    this.modalId = opts.modalId || Math.random().toString().replace('.','')
    this.content = opts.content || ""

    this.on('update', function(options) {
      if(options && options.show && options.content) {
        $("#"+this.modalId).find('.modal-body').html(options.content)
        $("#"+this.modalId).modal('show')
      } else {
        $("#"+this.modalId).find('.modal-body').html('')
        $("#"+this.modalId).modal('hide')
      }
    })

  </script>
</modal>
