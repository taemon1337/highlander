<bootswatch-selector>
  <div class="dropdown pull-right clearfix">
    <button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
      <span class="glyphicon glyphicon-cog"></span>
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
      <li each={ theme in themes }>
        <a onclick={ setTheme } href="/set/theme/{ theme }">{ theme }</a>
      </li>
    </ul>
  </div>

  <script>
    var that = this
    this.current = opts.current
    this.base = opts.base || "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/"
    this.filename = opts.filename || "/bootstrap.min.css"
    this.themes = ["cerulean","cosmo","cyborg","darkly","flatly","journal","lumen","paper","readable","sandstone","simplex","slate","spacelab","superhero","united","yeti"]

    this.setTheme = function(e) {
      try {
        var link = document.createElement("link")
        link.setAttribute("rel","stylesheet")
        link.setAttribute("type","text/css")
        link.setAttribute("href",this.base+e.item.theme+this.filename)
        document.getElementsByTagName("head")[0].insertBefore(link, this.current)
        that.current.disabled = true
        that.update({ current: link })
      } catch(err) {
        console.warn("ERROR", err)
      }
    }

    this.on('mount', function() {
      var link = document.createElement("link")
      link.setAttribute("rel","stylesheet")
      link.setAttribute("type","text/css")
      link.setAttribute("href",this.base+"cerulean"+this.filename)
      document.getElementsByTagName("head")[0].appendChild(link)
      this.update({ current: link })
    })
  </script>
</bootswatch-selector>
