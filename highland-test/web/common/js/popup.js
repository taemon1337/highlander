function Popup(opts) {
  opts = opts || {}
  var title = opts.title || "";
  var body = $(opts.body || "<textarea class='form-control' placeholder='"+(opts.placeholder || 'enter message...')+"' rows='4'></textarea>");

  var modal = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close btn-close'>&times;</button><h4 class='modal-title'></h4></div><div class='modal-body'></div><div class='modal-footer'><button type='button' class='btn btn-default btn-close'>Close</button><button type='button' class='btn btn-primary btn-save'>Save</button></div></div></div></div>");

  var close = function(ret) {
    $(modal).trigger('close', ret);
    $(modal).one('hidden.bs.modal', function() { $(modal).remove() });
    $(modal).modal('hide');
  };

  $(modal).find('.modal-title').html(title);
  $(modal).find('.modal-body').html( body );

  $(modal).find('button.btn-save').one('click', function() {
    $(modal).trigger('save', body);
    close(body);
  });

  $(modal).find('.btn-close').one('click', function() {
    close();
  });

  $('body').append(modal);
  $(modal).modal();
  return modal;
}
