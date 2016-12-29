<riot-table>
  <h3 if={ title }>{ title }</h3>

  <table class="table table-striped table-bordered" style="font-size:80%;">
    <thead>
      <tr>
        <th each={ field,cfg in _headers }>
          <riot-cell text={ cfg.text || field.toUpperCase() } title={ cfg.title }></riot-cell>
        </th>
        <th if={ records.length && record_actions.length }>
          { headers.length ? "Actions" : "ACTIONS" }
        </th>
        <th if={ records.length && record_buttons.length }></th>
      </tr>
    </thead>

    <tbody>
      <tr each={ record in records }>
        <td each={ field,cfg in _headers }>
          <riot-cell record={ record } field={ field } template={ cfg.template }></riot-cell>
        </td>
        <td if={ records.length && record_actions.length }>
          <record-actions actions={ parent.record_actions } record={ record }></record-actions>
        </td>
        <td if={ records.length && record_buttons.length }>
          <record-buttons buttons={ parent.record_buttons } record={ record }></record-buttons>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td if={ record_actions.length }></td>
        <td if={ record_buttons.length }></td>
        <td colspan={ Object.keys(_headers).length }>
          <span onclick={ reload } class="fa fa-refresh pull-right"></span>
        </td>
      </tr>
    </tfoot>
  </table>

  <style>
    td {
      max-width:200px;
      word-wrap:break-word;
    }
    .glyphicon {
      cursor: pointer;
    }
  </style>

  <script>
    var that = this
    this.title = opts.title
    this.headers = opts.headers || {}
    this.add_headers = opts.add_headers || {}
    this.ignore = opts.ignore || []
    this.records = opts.records || []
    this.record_actions = opts.record_actions || []
    this.record_buttons = opts.record_buttons || []
    this._headers = opts._headers || {}
    this.fetch = opts.fetch || function(cb) { cb([]) }

    this.getHeaders = function(fields) {
      var hdrs = {} // headers is an object, not array

      if(Object.keys(this.headers).length) {
        for(var field in this.headers) {
          var hdr = this.headers[field]
          hdrs[field] = typeof hdr === "object" ? hdr : {}
        }
      } else if(fields) {
        fields.forEach(function(field) {
          hdrs[field] = {}
        })
      } else {
        return {}
      }

      // Custom headers or override headers
      if(this.add_headers) {
        for(var field in this.add_headers) {
          hdrs[field] = this.add_headers[field]
        }
      }

      // Ignore headers in ignore[] or start with _
      for(var field in hdrs) {
        if(this.ignore.indexOf(field) !== -1) {
          delete hdrs[field]
        } else if(field.startsWith("_")) {
          delete hdrs[field]
        }
      }
      return hdrs
    }

    this.reload = function() {
      if(that.fetch) {
        var icon = $(this.root).find(".fa-refresh")
        $(icon).removeClass("fa-refresh").addClass("fa-spinner fa-spin");
        that.fetch(function(records) {
          var r1 = records[0] || {}
          if(Object.keys(that._headers).length) {
            that.update({ records: records })
          } else {
            that.update({ records: records, _headers: that.getHeaders(Object.keys(r1)) })
          }
          $(icon).removeClass("fa-spinner fa-spin").addClass("fa-refresh");
        })
      }
    }

    this.on('mount', function() {
      this.reload()
    })
  </script>
</riot-table>
