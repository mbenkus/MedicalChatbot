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
