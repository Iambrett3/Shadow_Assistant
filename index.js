$(document).ready(function() {

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var audioL = $('#sound')[0];
	var audioR = $('#recording')[0];
	var recorder;
	initPan();



	function initPan() {
		var sourceL = audioCtx.createMediaElementSource(audioL);
		var panNodeL = audioCtx.createStereoPanner();
		panNodeL.pan.value = -0.5;
		sourceL.connect(panNodeL);
		panNodeL.connect(audioCtx.destination);

		var sourceR = audioCtx.createMediaElementSource(audioR);
		var panNodeR = audioCtx.createStereoPanner();
		panNodeR.pan.value = 0.5;
		sourceR.connect(panNodeR);
		panNodeR.connect(audioCtx.destination);

	}

	var lagOffset = 0.1; //offset in seconds
	$('#stop-btn').hide();
	$('#pause-all-btn').hide();
	$('#red-circle').css('opacity', 0);

	$('#stop-btn').click(function() {
		stopAndLoadAudio();
		$(this).hide();
		$('#red-circle').css('opacity', 0);
  		$('#record-btn').show();
  		changeVolume('record-volume-slider', 'recording');
  		$('#recording')[0].currentTime = lagOffset;
		//$('#sound')[0].currentTime=0;
		//$('#sound')[0].pause();
	});

  $('#file-upload').change(function(e){
    var sound = $('#sound')[0];
    resetSpeedSlider();
    sound.src = URL.createObjectURL(this.files[0]);
    sound.onend = function(e) {
      URL.revokeObjectURL(this.src);
    }
    $("#sound").focus().blur(); //remove focus from the uplaod button
    changeVolume('upload-volume-slider', 'sound');
    
  });


$('#sound').bind('ended', function() {
	$('#stop-all-btn').click();
})

  $('#play-all-btn').click(function() {
  	$('#pause-all-btn').show();
  	$(this).hide();
  	$('#sound')[0].play();
  	$('#recording')[0].play();
  });

  $('#pause-all-btn').click(function() {
  	$('#play-all-btn').show();
  	$(this).hide();
  	$('#sound')[0].pause();
  	$('#recording')[0].pause();
  });

  $('#stop-all-btn').click(function() {
  	if (currently_recording) {
  		stopAndLoadAudio();
  		$('#stop-btn').hide();
    	$('#record-btn').show();
  	}


  	$('#sound')[0].pause();
  	$('#recording')[0].pause();
  	$('#sound')[0].currentTime = 0;
  	$('#recording')[0].currentTime = lagOffset;
  	$('#pause-all-btn').hide();
  	$('#play-all-btn').show();
  	$('#red-circle').css('opacity', 0);
    changeVolume('record-volume-slider', 'recording');
    $('#recording')[0].currentTime = lagOffset;
  });


async function stopAndLoadAudio() {
		const audio = await recorder.stop();
		audio.loadAudio();
		currently_recording = false;
		$('#recording')[0].currentTime = lagOffset;
}


  $('#record-btn').click(function() {
  	$('#red-circle').css('opacity', 1);

  	currently_recording = true;

  	(async () => {
  		recorder = await recordAudio();
  		$('#sound')[0].play();
  		recorder.start();
  	})();

  	$(this).hide();
  	$('#stop-btn').show();
  	$('#sound')[0].currentTime=0;
  	
  });

  $(document).keypress(function(e) {
  	if (document.activeElement === document.getElementById('text-area')) {
  		return;
  	}
  	//alert(e.keyCode);
  	var sound = $('#sound')[0];
  	if (e.keyCode == 32) {
  		if (sound.paused)
  			sound.play();
  		else
  			sound.pause();
  	}
  	if (e.keyCode == 97) {
  		sound.currentTime = Math.max(sound.currentTime - 2,0);
  	}
  	if (e.keyCode == 100) {
  		sound.currentTime = Math.min(sound.currentTime + 2,sound.duration);
  	}
  	if (e.keyCode == 115) {
  		var curr_speed = $('#speed-slider').val()*1;
  		var min_speed = document.getElementById("speed-slider").min;
  		var new_speed = Math.max(min_speed, curr_speed-1);
  		$('#speed-slider').val(new_speed);
  		changeSpeed();
  	}
  	if (e.keyCode == 119) {
  		var curr_speed = $('#speed-slider').val()*1;
  		var max_speed = document.getElementById("speed-slider").max;
  		var new_speed = Math.min(max_speed, curr_speed+1);
  		$('#speed-slider').val(new_speed);
  		changeSpeed();
  	}
  });

  //can't use jquery here because it doesn't support oninput yet
  document.getElementById('speed-slider').addEventListener("input", function() {
  	changeSpeed();
  });

  document.getElementById('upload-volume-slider').addEventListener("input", function() {
  	changeVolume('upload-volume-slider', 'sound');
  });

  document.getElementById('record-volume-slider').addEventListener("input", function() {
  	changeVolume('record-volume-slider', 'recording');
  });

  document.getElementById('offset-slider').addEventListener("input", function() {
  	changeOffset();
  });

  function changeSpeed() {
  	var slider = $('#speed-slider');
  	var sound = $('#sound')[0];
  	var newSpeed = 1.0 + slider.val()*.05;
  	var newSpeedText;
  	if (newSpeed > 1.0)
  		newSpeedText = "+" + slider.val();
  	else if (newSpeed < 1.0)
  		newSpeedText = slider.val();
  	else
  		newSpeedText = "Original";
  	$("#curr_speed").text("Speed: "+newSpeedText);
  	sound.playbackRate = newSpeed;
  }

  function changeOffset() {
  	$('#stop-all-btn').click();
  	var slider = $('#offset-slider');
  	var sound = $('#recording')[0];
  	var newOffset = slider.val()*.005;
  	lagOffset = newOffset

  	var newOffsetText = "";
  	if (lagOffset > 0)
  		newOffsetText += "+";
  	newOffsetText += Math.round(lagOffset*100)/100 + "s";
  	$("#curr_offset").text("Offset: "+newOffsetText);
  }

  function resetSpeedSlider() {
  	$("#speed-slider").val(0);
  	$("#curr_speed").text("Speed: Original");
  }

  function changeVolume(sliderId, audioId) {
  	var slider = $('#'+sliderId);
  	var sound = $('#'+audioId)[0];
  	var newVolume = 1.0 + slider.val()*.05;
  	sound.volume = newVolume;
  }

  function resetVolumeSlider(sliderId) {
  	$("#"+sliderId).val(0);
  	$("#curr_speed").text("Speed: Original");
  }

//taken from https://medium.com/@bryanjenningz/how-to-record-and-play-audio-in-javascript-faa1b2b3e49b
const recordAudio = () => {
  return new Promise(resolve => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        const start = () => {
          mediaRecorder.start();
        };

        const stop = () => {
          return new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
              const audioBlob = new Blob(audioChunks);
              const audioUrl = URL.createObjectURL(audioBlob);
              //const audio = new Audio(audioUrl);
              const loadAudio = () => {
                //$('#recording-container').html('<audio id="recording" src="'+audioUrl+'" controls></audio>');
  			    $('#recording').attr('src', audioUrl);
  			    $('#recording')[0].onend = function(e) {
      			    URL.revokeObjectURL(this.src);
    		    }
    		    
              };

              resolve({ audioBlob, audioUrl, loadAudio });
            });


            mediaRecorder.stop();
            

          });
        };

        resolve({ start, stop });
      });
  });
};

});