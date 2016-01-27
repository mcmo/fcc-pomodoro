'use strict';

var Timer = (function () {

  $(function () {

    $('#break .minus').click(function () {
      decreaseTime(this);
      setActive('#break');
    });

    $('#break .plus').click(function () {
      increaseTime(this);
      setActive('#break');
    });

    $('#session .minus').click(function () {
      decreaseTime(this);
      setActive('#session');
    });

    $('#session .plus').click(function () {
      increaseTime(this);
      setActive('#session');
    });

    $('#timer').click(function () {
      timerClicked();
    });

    init();

  });

  function setActive(active) {
    if (!s.interval) {
      var inactive = active === '#session' ? '#break' : '#session';
      s.inSession = active === '#session' ? true : false;
      $(active).addClass('active');
      $(inactive).removeClass('active');
    }
  }

  function decreaseTime(self) {
    if (!s.interval) {
      var target = $(self).next();
      var newNum = Math.max(Number(target.text()) - 1, 1);
      $(target).text(newNum);
      resetTimer(newNum);
    }
  }

  function increaseTime(self) {
    if (!s.interval) {
      var target = $(self).prev();
      var newNum = Math.min(Number(target.text()) + 1, 60);
      $(target).text(newNum);
      resetTimer(newNum);
    }
  }

  var s = { // settings
    interval: false,
    inSession: true,
    seconds: 60
  };

  function init() {
    setActive('#session');
    circle.update(true);
  }

  var circle = Circles.create({
    id: 'timer',
    radius: 150,
    value: 0,
    maxValue: $('#session span').text() * s.seconds,
    width: 10,
    text: function (value) {
      return formatTimeLeft(value, this.getMaxValue());
    },
    colors: ['#D3B6C6', '#4B253A'],
    duration: 0
  });

  function resetTimer(max) {
    circle._maxValue = max * s.seconds;
    circle._value = 0;
    circle.update(true);
  }

  function formatTimeLeft(value, maxValue) {
    var totalSecLeft = maxValue - value;

    var minLeft = Math.floor(totalSecLeft / s.seconds);
    var secLeft = totalSecLeft - minLeft * s.seconds;
    if (secLeft < 10) secLeft = '0' + secLeft;

    return minLeft + ':' + secLeft;
  }

  function startTimer() {
    s.interval = setInterval(function () {

      circle.update(circle.getValue() + 1)
      var totalSecondsLeft = circle.getMaxValue() - circle.getValue();
      if (totalSecondsLeft < 1) {
        stopTimer();
        playSound();
        startOther();
      }
    }, 1000);
  }

  function timerClicked() {
    if (!s.interval) {
      startTimer();
    } else {
      stopTimer();
    }
  }

  function stopTimer() {
    if (s.interval) {
      clearInterval(s.interval);
      s.interval = false;
    }
  }

  function startOther() {
    // if break or session just ended, start the other
    if (s.inSession) {
      setActive('#break');
      startBreak();
    } else {
      setActive('#session');
      startSession();
    }
  }

  function startSession() {
    resetTimer($('#session span').text());
    s.inSession = true;
    startTimer();
  }

  function startBreak() {
    resetTimer($('#break span').text());
    s.inSession = false;
    startTimer();
  }

  function playSound() {
    document.getElementById('play').play();
  }

  return {
    timerClicked: timerClicked,
    circle: circle,
    resetTimer: resetTimer
  }

})();
