<record-buttons>
  <div>
    <a each={ btn in buttons } onclick={ onclick } href={ href(btn) } title={ btn.text } class="icon icon-{ size } text-{ color }">
      <span if={ btn.text && !btn.glyph && !btn.fa }>{ btn.text }</span>
      <span if={ btn.glyph } class="glyphicon glyphicon-{ btn.glyph }"></span>
      <span if={ btn.fa } class="fa fa-{ btn.fa }"></span>
    </button>
  </div>

  <style>
    .icon:link, .icon:visited, .icon:active {
      text-decoration: none;
    }
    .icon {
      cursor:pointer;
    }
    .icon-xs {
      font-size: 10px;
    }
    .icon-sm {
      font-size: 15px;
    }
    .icon-md {
      font-size: 20px;
    }
    .icon-lg {
      font-size: 30px;
    }
  </style>

  <script>
    this.record = opts.record
    this.buttons = opts.buttons || []
    this.color = opts.color || "primary"
    this.size = opts.size || "sm"

    this.onclick = function(e) {
      if(e.item.btn && e.item.btn.event) {
        this.parent.parent.parent.trigger(e.item.btn.event, this.record)
      } else {
        return true
      }
    }

    this.href = function(btn) {
      if(typeof btn.href === "function") {
        return btn.href(this.record)
      } else if(btn.href) {
        return btn.href
      } else {
        return "#"
      }
    }
  </script>
</record-buttons>
