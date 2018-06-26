var recording_panel = (function() {
		var recorder;
		var lagOffset = DEFAULT_LAG_OFFSET;
		var currently_recording = false;
		var record_button;
		var stop_button;
		var audioPlayer;
		var recording;

		var offset_slider;
		var offset_text;

		var init = function() {
			offset_slider = $('#'.concat(OFFSET_SLIDER_ID));
			audioPlayer = $('#'.concat(R_AUDIO_ID));
			recording = audioPlayer[0];
			record_button = $('#'.concat(RECORD_BUTTON_ID));
			stop_button = $('#'.concat(STOP_BUTTON_ID));
			stop_button.hide();
			offset_text = $('#'.concat(OFFSET_TEXT_ID));
			
			initBindings();

		}

		var isCurrentlyRecording = function() {
			return currently_recording;
		}

		var reset = function() {
			recording.currentTime = lagOffset;
		}

		var play = function() {
			recording.play();
		}

		var pause = function() {
			recording.pause();
		}

		var stopRecording = async function() {
			const audio = await recorder.stop();
			audioPlayer.attr('src', audio.audioUrl);
  			recording.onend = function(e) {
      			URL.revokeObjectURL(this.src);
    		}
			currently_recording = false;

			stop_button.hide();
    		record_button.show();
    		toggleRedCircle();

			reset();
		}

		var startRecording = function() {
			currently_recording = true;
  			(async () => {
  				recorder = await recordAudio();
  				$('#'.concat(L_AUDIO_ID))[0].play();
  				recorder.start();
  			})();

  			toggleRedCircle();
  			record_button.hide();
  			stop_button.show();
		}

		function changeOffset() {
  			master_controls.stopAll();
  			var newOffset = offset_slider.val()*.005;
  			lagOffset = newOffset

  			var newOffsetText = "";
  			if (lagOffset > 0)
  				newOffsetText += "+";
  			newOffsetText += Math.round(lagOffset*100)/100 + "s";
  			offset_text.text("Offset: "+newOffsetText);
  		}

		function initBindings() {
			record_button.click(function() {
  				startRecording();
  			});

			stop_button.click(function() {
				stopRecording();
			});

			 //can't use jquery here because it doesn't support oninput yet
  			document.getElementById('offset-slider').addEventListener("input", function() {
  				changeOffset();
  			});
		}

		return {
			init: init,
			lagOffset: lagOffset,
			isCurrentlyRecording: isCurrentlyRecording,
			startRecording: startRecording,
			stopRecording: stopRecording,
			play: play,
			pause: pause,
			reset: reset
		};

	})();