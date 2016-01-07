var interval = false,
  inSession = true;

$(function () {

  $('.minus').click(function (e) {
    var target = $(this).next();
    var newNum = Math.max(Number(target.text()) - 1, 1);
    $(target).text(newNum);
    // change timer if session length updated
    if (target[0].id === 'session') $('#session').trigger('change');
  });

  $('.plus').click(function (e) {
    var target = $(this).prev();
    var newNum = Math.min(Number(target.text()) + 1, 60);
    $(target).text(newNum);
    // change timer if session length updated
    if (target[0].id === 'session') $('#session').trigger('change');
  });

  $('#timer').click(function (e) {
    startTimer();
  });

  $('#session').on('change', function () {
    if (inSession) {
      stopTimer();
      startSession();
    }
  });

  $(window).resize(function () {
    resize();
  });

});

function runTimer() {
  var originalSeconds = inSession ? $('#session').text() * 60 : $('#break').text() * 60;
  interval = setInterval(function () {
    var totalSecondsLeft = $('#min').text() * 60 + Number($('#sec').text()) - 1;

    var minLeft = Math.floor(totalSecondsLeft / 60);

    var secLeft = totalSecondsLeft - minLeft * 60;
    if (secLeft < 10) secLeft = '0' + secLeft;

    $('#min').text(minLeft);
    $('#sec').text(secLeft);

    var percentDone = (originalSeconds - totalSecondsLeft) / originalSeconds;
    draw(percentDone);

    if (totalSecondsLeft < 1) {
      stopTimer();
      startOther();
    }
  }, 1000);
}

function startTimer() {
  if (!interval) {
    runTimer();
  } else {
    stopTimer();
  }
}

function stopTimer() {
  if (interval) {
    clearInterval(interval);
    interval = false;
  }
}

function startOther() {
  // if break or session just ended, start the other
  if (inSession) {
    startBreak();
  } else {
    startSession();
  }
}

function startSession() {
  $('#min').text($('#session').text());
  $('#sec').text('00');
  inSession = true;
  runTimer();
}

function startBreak() {
  $('#min').text($('#break').text());
  $('#sec').text('00');
  inSession = false;
  runTimer();
}

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#CC1814";
var i = 1;
resize();

function resize() {
  c.style.left = ($(window).width() - 300) / 2 + "px";
}

function draw(percentDone) {
  var pxWidth = percentDone * 300;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillRect(0, 0, pxWidth, 200);
}
