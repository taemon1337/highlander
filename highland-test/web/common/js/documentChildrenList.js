function documentChildrenList(children) {
  if(typeof children === 'string') {
    children = JSON.parse(children);
  }

  return children.map(function(child) {
    return "<span title='"+JSON.stringify(child)+"' class='label label-default'>"+child.filename+"</span>"
  }).join(' ');
}
