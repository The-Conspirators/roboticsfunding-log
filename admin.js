verify = function verify(id, e) {
  let state = e.target.checked;
  let request = new XMLHttpRequest();
  let callback = (checked) => e.target.checked=checked=="true";
  callback.bind(this);
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      newstate = this.responseText;
      callback(newstate);
    }
  };
  request.open('POST', serverurl+'/verify', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({_id: id, verified: state}));
  return false;
}
