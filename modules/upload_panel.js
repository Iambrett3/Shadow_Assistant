var upload_panel = (function() {
		var audioPlayer;
		var sound;
		var uploader;
		var curr_speed;
		var speed_text;

		var speed_slider;

		var init = function() {
			speed_slider = $('#'.concat(SPEED_SLIDER_ID));
			audioPlayer = $('#'.concat(L_AUDIO_ID));
			sound = audioPlayer[0];
			uploader = $('#'.concat(FILE_UPLOAD_ID));
			curr_speed = DEFAULT_SPEED;
			speed_text = $('#'.concat(SPEED_TEXT_ID));


			initBindings();
			
		}

    var getCurrSpeed = function() {
      return curr_speed;
    }

    var play = function() {
      sound.play();
    }

    var pause = function () {
      sound.pause();
    }

    var reset = function() {
      sound.currentTime = 0;
    }

    var notifySpeedChange = function() {
      changeSpeed();
    }

    var skipBack = function(s) {
      sound.currentTime = Math.max(sound.currentTime - s,0);
    }

    var skipAhead = function(s) {
      sound.currentTime = Math.min(sound.currentTime + 2,sound.duration);
    }

    var isPaused = function() {
      return sound.paused;
    }

		function initBindings() {
			uploader.change(function(e){
    			resetSpeedSlider();
    			sound.src = URL.createObjectURL(this.files[0]);
    			sound.onend = function(e) {
      				URL.revokeObjectURL(this.src);
    			}
    			audioPlayer.focus().blur(); //remove focus from the upload button 
  			});

  			//can't use jquery here because it doesn't support oninput yet
  			document.getElementById(SPEED_SLIDER_ID).addEventListener("input", function() {
  				changeSpeed();
  			});


      audioPlayer.bind('ended', function() {
        master_controls.stopAll();
      })
  	}

		function changeSpeed() {
  			var newSpeed = 1.0 + speed_slider.val()*.05;
  			curr_speed = newSpeed;
  			var newSpeedText;
  			if (newSpeed > 1.0)
  				newSpeedText = "+" + speed_slider.val();
  			else if (newSpeed < 1.0)
  				newSpeedText = speed_slider.val();
  			else
  				newSpeedText = "Original";
  			speed_text.text("Speed: " + newSpeedText);
  			sound.playbackRate = newSpeed;
  		}

  		function resetSpeedSlider() {
  			speed_slider.val(0);
  			speed_text.text("Speed: Original");
  		}

  		return {
  			init: init,
        getCurrSpeed: getCurrSpeed,
        notifySpeedChange: notifySpeedChange,
        play: play,
        pause: pause,
        skipAhead: skipAhead,
        skipBack: skipBack,
        isPaused: isPaused,
        reset: reset
  		}
	})();