var mixer = (function() {
	    var audioCtx;
	    var audioL;
		var audioR;
		var l_slider;
		var r_slider;
		var audioLVol = DEFAULT_L_VOL;
		var audioLPan = DEFAULT_L_PAN;
		var audioRVol = DEFAULT_R_VOL;
		var audioRPan = DEFAULT_R_PAN;


		var init = function() {
			audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			l_slider = $('#'.concat(L_SLIDER_ID));
			r_slider = $('#'.concat(R_SLIDER_ID));
			audioL = $('#'.concat(L_AUDIO_ID))[0];
	        audioR = $('#'.concat(R_AUDIO_ID))[0];
			createPan(audioL, audioLPan);
			createPan(audioR, audioRPan);

			//can't use jquery here because it doesn't support oninput yet
			document.getElementById(L_SLIDER_ID).addEventListener("input", function() {
  				audioLVol = changeVolume(l_slider, audioL);
  			});

  			document.getElementById(R_SLIDER_ID).addEventListener("input", function() {
  				audioRVol = changeVolume(r_slider, audioR);
  			});
		};

		function changeVolume(slider, audio) {
  			var newVolume = 1.0 + slider.val()*.05;
  			audio.volume = (newVolume);
  			return newVolume;
  		}

		function createPan(audio, pan) {
			var source = audioCtx.createMediaElementSource(audio);
			var panNode = audioCtx.createStereoPanner();
			panNode.pan.value = pan;
			source.connect(panNode);
			panNode.connect(audioCtx.destination);
		}

		return {
			init: init
		}
	})();