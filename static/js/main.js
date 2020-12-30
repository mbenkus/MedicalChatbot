$(document).ready(function () {
  $("#send").click(function () {
    var tekst = $("#message-text").val();
    $("#conversation").append(
      `<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">${tekst}</div></div></div></div>`
    );
    $("#message-text").val("");
  });

  $(document).on("keypress", function (e) {
    if (e.which == 13) {
      var tekst = $("#message-text").val();
      $("#conversation").append(
        `<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">${tekst}</div></div></div></div>`
      );
      $("#message-text").val("");
    }
  });
});

function autocomplete(symptoms) {
  var currentFocus;
  var input = document.getElementById("message-text");

  input.addEventListener("input", function (e) {
    var a, b, i, val = this.value;

    closeAllLists();

    if (!val) {
      return false;
    }

    currentFocus = -1;
    a = document.createElement("div");
    a.setAttribute("id", this.id + " autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);

    for (i = 0; i < symptoms.length; i++) {
      if (symptoms[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("div");
        b.innerHTML = "<strong>" + symptoms[i].substr(0, val.length) + "</strong>";
        b.innerHTML += symptoms[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + symptoms[i] + "'>";

        b.addEventListener("click", function (e) {
          input.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });

        a.appendChild(b);
      }
    }
  });
  
  input.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");

    // On arrow down, arrow up and enter
    if (e.code == 'ArrowUp') {
      currentFocus++;
      addActive(x);
    } else if (e.code == 'ArrowDown') {
      currentFocus--;
      addActive(x);
    } else if (e.code == 'Enter') {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  // Defines item as active
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  // Removes active state from all autocomplete items
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != input) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

autocomplete(symptoms);
