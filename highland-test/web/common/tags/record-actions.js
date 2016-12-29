<record-actions>
  <div if={ actions.length && record } class="btn-group pull-right">
    <button type="button" class="btn btn-{ color } btn-{ size } dropdown-toggle" data-toggle="dropdown">
      <span if={ text }>{ text }</span>
      <span if={ glyph } class="glyphicon glyphicon-{ glyph }"></span>
      <span if={ fa } class="fa fa-{ fa }"></span>
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
      <li each={ action in actions }>
        <a onclick={ onclick } href={ href(action) } title={ action.title }>
          <span if={ action.glyph } class="glyphicon glyphicon-{ action.glyph }"></span>
          <span if={ action.fa } class="fa fa-{ action.fa }"></span>
          { action.text }
        </a>
      </li>
    </ul>
  </div>

  <script>
    this.text = opts.text || "action"
    this.glyph = opts.glyph || ""
    this.fa = opts.fa || ""
    this.color = opts.color || "primary"
    this.size = opts.size || "sm"
    this.record = opts.record || {}
    this.actions = opts.actions || {}

    this.onclick = function(e) {
      if(e.item.action && e.item.action.event) {
        this.parent.parent.parent.trigger(e.item.action.event, this.record)
      } else {
        return true;
      }
    }

    this.href = function(action) {
      if(typeof action.href === "function") {
        return action.href(this.record)
      } else if(action.href) {
        return action.href
      } else {
        return "#"
      }
    }
  </script>
</record-actions>
