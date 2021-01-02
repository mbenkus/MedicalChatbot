$(document).ready(function () {
  symptoms = JSON.parse(symptoms);
  let input = $("#message-text");
  let dataList = $("#symptoms-list");
  let suggestedItem = $("#symptoms-list li");

  $(".symptoms-list-container").css("display", "none");

  input.on("input", function () {
    let insertedValue = $(this).val();
    $("#symptoms-list").empty();

    if (insertedValue.length > 1) {
      ssymptoms = $.fn.getSuggestedSymptoms(insertedValue);
      for (let i = 0; i < ssymptoms.length; i++) {
        var li = document.createElement("li");
        li.textContent = ssymptoms[i];
        dataList.append(li);
      }
    }
  });

  input.on("focus", function () {
    $(".symptoms-list-container ").css("display", "block");
  });

  //todo - check why it does not work
  suggestedItem.click(function () {
    console.log("test");
  });

  input.on("keypress", function (e) {
    if (e.which == 13) {
      $.fn.handleUserMessage();
    }
  });

  $("#send").click(function () {
    $.fn.handleUserMessage();
  });

  $.fn.handleUserMessage = function () {
    $.fn.appendUserMessage();
    $.fn.getPredictedSymptom();
    input.val("");
  }

  $.fn.appendUserMessage = function () {
    var tekst = input.val();
    $("#conversation").append(
      `<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">${tekst}</div></div></div></div>`
    );
  }

  $.fn.getPredictedSymptom = function () {
    var tekst = input.val();
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

  $.fn.getSuggestedSymptoms = function (val) {
    let suggestedSymptoms = []
    $.each(symptoms, function(i,v) {
      if (v.includes(val)) {
        suggestedSymptoms.push(v);
      }
    });
    return suggestedSymptoms.slice(0,3);
  }
});
