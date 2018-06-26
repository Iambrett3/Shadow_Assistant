var hotkeys = (function() {
    var init = function(){
      $(document).keypress(function(e) {
        	//alert(e.keyCode);
        	if (e.keyCode == 32) { //space
        		if (upload_panel.isPaused())
        			upload_panel.play();
        		else
        			upload_panel.pause();
        	}
        	if (e.keyCode == 97) { //a
        		upload_panel.skipBack(2);
        	}
        	if (e.keyCode == 100) { //d
        		upload_panel.skipAhead(2);
        	}
        	if (e.keyCode == 115) { //s
        		var curr_speed = $('#speed-slider').val()*1;
        		var min_speed = document.getElementById("speed-slider").min;
        		var new_speed = Math.max(min_speed, curr_speed-1);
        		$('#speed-slider').val(new_speed);
        		upload_panel.notifySpeedChange();
        	}
        	if (e.keyCode == 119) { //w
        		var curr_speed = $('#speed-slider').val()*1;
        		var max_speed = document.getElementById("speed-slider").max;
        		var new_speed = Math.min(max_speed, curr_speed+1);
        		$('#speed-slider').val(new_speed);
        		upload_panel.notifySpeedChange();
        	}
        });
    }

    return {
        init: init
    }
})();