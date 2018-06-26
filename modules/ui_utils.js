function toggleRedCircle() {
	var red_circle = $('#'.concat(RED_CIRCLE_ID));
	var opacity = red_circle.css('opacity');
	if (opacity == 1 )
		red_circle.css('opacity', 0);
	else
		red_circle.css('opacity', 1);
}