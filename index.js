$(document).ready(function() {
	master_controls.init(); //init first, because master controls are used by other modules

	mixer.init();
	upload_panel.init();
	recording_panel.init();


  	hotkeys.init(); //init last, because uses all other modules
});