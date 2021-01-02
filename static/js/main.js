$(document).ready(function () {
  symptoms = JSON.parse(symptoms);
  let input = $("#message-text");
  let dataList = $("#symptoms-list");
  let chat = $("#conversation");

  $(".symptoms-list-container").css("display", "none");

  // Handler for any input on the message input field
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

  // Handler for click on one of the suggested symptoms
  dataList.on("click", "li", function() {
    input.val($(this).text());
  });
  //todo: blur on input - does not work with suggestion item clicks

  input.on("focus", function () {
    $(".symptoms-list-container ").css("display", "block");
  });

  input.on("keypress", function (e) {
    if (e.which == 13) {
      $.fn.handleUserMessage();
    }
  });

  $("#send").click(function () {
    $.fn.handleUserMessage();
  });

  // Handler function for sending a message 
  $.fn.handleUserMessage = function () {
    $.fn.appendUserMessage();
    $.fn.getPredictedSymptom();
    input.val("");
    chat.animate({
      scrollTop: $("#conversation .message-body:last-child").position().top
    });
  };

  // Creates the newly sent message element
  $.fn.appendUserMessage = function () {
    var tekst = input.val();
    $("#conversation").append(
      `<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">${tekst}</div></div></div></div>`
    );
  };

  // Retreives prediction to show as bot message
  $.fn.getPredictedSymptom = function () {
    var tekst = input.val();
    $.ajax({
      url: "http://127.0.0.1:5000/symptom",
      data: JSON.stringify({ sentence: tekst }),
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
      },
    });
  };

  $.fn.getSuggestedSymptoms = function (val) {
    let suggestedSymptoms = [];
    $.each(symptoms, function (i, v) {
      if (v.includes(val)) {
        suggestedSymptoms.push(v);
      }
    });
    return suggestedSymptoms.slice(0, 3);
  };
});
