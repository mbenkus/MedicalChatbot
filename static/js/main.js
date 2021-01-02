$(document).ready(function () {

  symptoms = JSON.parse(symptoms);
  var dataList = document.getElementById("symptoms-list");

  $(".symptoms-list-container").css("display", "none");

  $("#send").click(function () {
    $.fn.handleUserMessage();
  });

  $("#message-text").on("keypress", function (e) {
    if (e.which == 13) {
      $.fn.handleUserMessage();
    }
  });

  $.fn.getSuggestedSymptoms = function (val) {
    let suggestedSymptoms = []
    $.each(symptoms, function(i,v) {
      if (v.includes(val)) {
        suggestedSymptoms.push(v);
      }
    });
    return suggestedSymptoms.slice(0,3);
  }

  $("#message-text").on("input", function () {
    let insertedValue = $(this).val();
    $("#symptoms-list").empty();
    if (insertedValue.length > 2) {
      ssymptoms = $.fn.getSuggestedSymptoms(insertedValue);
      for (let i = 0; i < ssymptoms.length; i++) {
        var li = document.createElement("li");
        li.textContent = ssymptoms[i];
        dataList.appendChild(li);
      }
    }
  });

  $("#message-text").on("focus", function () {
    $(".symptoms-list-container ").css("display", "block");
  });

  $("#message-text").on("blur", function () {
    $(".symptoms-list-container").css("display", "none");
  });

  $.fn.handleUserMessage = function () {
    $.fn.appendUserMessage();
    $.fn.getPredictedSymptom();
    $("#message-text").val("");
  }

  $.fn.appendUserMessage = function () {
    var tekst = $("#message-text").val();
    $("#conversation").append(
      `<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">${tekst}</div></div></div></div>`
    );
  }

  $.fn.getPredictedSymptom = function () {
    var tekst = $("#message-text").val();
    $.ajax({
      url: "http://127.0.0.1:5000/symptom",
      data: JSON.stringify({ "sentence": tekst }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "POST",
      success: function (response) {
        console.log(response);
        $("#conversation").append(
          `<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">${response}</div></div></div></div>`
        );
      },
      error: function () {
        console.log("Error");
      }
    });
  }
});
