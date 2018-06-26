
var master_controls = (function() {
	var play_all;
	var pause_all;
	var stop_all;

	var init = function() {
		play_all = $('#'.concat(PLAY_ALL_BUTTON_ID));
		pause_all = $('#'.concat(PAUSE_ALL_BUTTON_ID));
		stop_all = $('#'.concat(STOP_ALL_BUTTON_ID));
    pause_all.hide();
		initBindings();
	}

  var stopAll = function() {
    stop_all.click();
  }

  var playAll = function() {
    play_all.click();
  }

  var pauseAll = function() {
    pause_all.click();
  }

	function initBindings() {
		play_all.click(function() {
  			pause_all.show();
  			$(this).hide();
  			upload_panel.play();
  			recording_panel.play();
  		});

  		pause_all.click(function() {
  			play_all.show();
  			$(this).hide();
  			upload_panel.pause();
  			recording_panel.pause();
  		});

  		stop_all.click(function() {
  			if (recording_panel.isCurrentlyRecording()) {
  				recording_panel.stopRecording();
  			}
  			pause_all.click();
  			upload_panel.reset();
        recording_panel.reset();
  		});
	}

	return {
		init: init,
    stopAll: stopAll,
    pauseAll: pauseAll,
    playAll: playAll
	}
})();