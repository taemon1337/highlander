function Alert(opts) {
  var main = document.getElementById(opts.main || "main");
  var type = opts.type || "info";
  var div = document.createElement("div");
  div.style.position = "absolute";
  div.setAttribute("class","alert alert-"+type+" alert-dismissable fade in");
  var bod = "<button type='button' class='close' data-dismiss='alert'>";
  bod += "<span>&times;</span></button>";
  if(opts.title) {
    bod += "<h4>"+opts.title+"</h4>";
  }
  if(opts.description) {
    bod += "<p>"+opts.description+"</p>";
  }
  div.innerHTML = bod;

  main.insertBefore(div, main.childNodes[0]);

  setTimeout(function() {
    div.remove();
  }, 9000);
};
