Handlebars.registerHelper('jsoneach', function(json_str, opts) {
  return JSON.parse(json_str).map(function(a) { return opts.fn(a) }).join(" ")
})

Handlebars.registerHelper('jsonify', function(json, opts) {
  return JSON.stringify(json)
})

Handlebars.registerHelper('fileSize', function(size, opts) {
  if(!humanFileSize) {
    alert('Cannot find humanFileSize!');
    return;
  }
  if(typeof size !== "number") {
    size = parseInt(size);
  }

  return humanFileSize(size);
});

Handlebars.registerHelper('hashColorLabel', function(str, opts) {
  if(!hashColor || !inverseColor) {
    alert('Cannot find hashColor or inverseColor!');
    return;
  }
  var bg = hashColor(str);
  var txt = inverseColor(bg);

  return "<span class='label' style='color:#"+txt+";background-color:#"+bg+"'>"+str+"</span>";
});

Handlebars.registerHelper('hashColorLine', function(str, opts) {
  console.log("STR: ", str);
  if(!hashColor) {
    alert('Cannot find hashColor!');
    return;
  }
  var bg = hashColor(str);

  return "<span style='border-bottom:2px solid #"+bg+";'>"+str+"</span>";
});


Handlebars.registerHelper('hashColor', function(str, opts) {
  if(!hashColor) {
    alert('Cannot find hashColor!');
    return;
  }
  return "#"+hashColor(str);
});

