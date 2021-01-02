var dataList = document.getElementById("symptoms-list");
var input = document.getElementById("message-text");

var request = new XMLHttpRequest();

request.onreadystatechange = function (response) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      symptoms = JSON.parse(symptoms);
      for (let i = 0; i < symptoms.length; i++) {
        var li = document.createElement("li");
        li.textContent = symptoms[i];
        dataList.appendChild(li);
      }
    } else {
      input.placeholder = "Couldn't load symptoms datalist :(";
    }
  }
};

request.open("GET", "static/assets/files/ds_symptoms.txt", true);
request.send();
