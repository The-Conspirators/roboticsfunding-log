const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function prettyDate(date) {
  if(!date) return;
  date = date.split('-');
  if(date.length < 3) return;
  return months[parseInt(date[1])-1] + ' ' + date[2] + ', ' + date[0];
}
function times(amount, item) {
  if(!item) return;
  if(!amount || amount == 1) return item;
  return amount + '×' + item; 
}
function prettyType(type) {
  if(!type) return;
  let amount = type.match(/^[0-9]*/);
  let value = type.match(/[0-9]*$/);
  return amount + ' Ticket' + (amount==1?'':'s') + ' for $' + value;
}
function calculateValue(type, amount) {
  if(!type || !amount) return;
  return (parseInt(type.match(/[0-9]*$/))*parseInt(amount));
}

function sendRequest(website, table) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      json = this.responseText;
      if(table !== null) {
        console.log(json);
        json = JSON.parse(json);

        for (let item of json) {
          let row = document.createElement('tr');
          let value = calculateValue(item.type, item.amount);
          for (let info of [prettyDate(item.date), item.seller, times(item.amount, prettyType(item.type)), '$'+value]){
            let td = document.createElement('td');
            td.textContent = info;
            row.appendChild(td);
          }
          table.appendChild(row);
        }
      }
    }
  };
  request.open('GET', website, true);
  //request.setRequestHeader('Content-Type', 'application/json');
  request.send();
}

function init() {
  sendRequest('http://localhost:3000/list', document.getElementById('selllist'));
  loadDate();
}

function loadDate() {
  function formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    return year+'-'+(month<10?'0':'')+month+'-'+(day<10?'0':'')+day;
  }
  for (datepicker of document.querySelectorAll("input[type=date]")){
    datepicker.setAttribute("min","2018-12-06");
    let today = formatDate(new Date());
    datepicker.setAttribute("max", today);
    datepicker.value = today;
  }
}
