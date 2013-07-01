
/*
	need classes:
	- creature
	- player (creature)

	- location
	- worldmap

	Unicode:
	http://en.wikipedia.org/wiki/Miscellaneous_Symbols	
	http://en.wikipedia.org/wiki/List_of_Unicode_characters
*/

var player = NaN;

var checkPath = function() {
	// !!!!!!!!
}

var drawAll = function() {
	var bg = this.rect(0, 0, 800, 600).attr({"fill": "#5da130"});
	player = this.text(100, 100, "\u263a").attr({"font": "20px Arial"});
}

$(function() {
	var screen = Raphael("container", 800, 600, drawAll); 

	$(document).keydown(function(event){
		/*
			key codes:
			w		87
			a		65
			s		83
			d		68

			up		38
			left	37
			down	40
			right	39
		*/

		var key = event.keyCode;
		var attr = player.attr(["x", "y"]);
		var x = attr["x"];
		var y = attr["y"];

		if (key == 87 || key == 38) {
			// up
			player.attr({"y": y - 10});
		} else if (key == 83 || key == 40) {
			// down
			player.attr({"y": y + 10});
		} else if (key == 65 || key == 37) {
			// left
			player.attr({"x": x - 10});
		} else if (key == 68 || key == 39) {
			// right
			player.attr({"x": x + 10});
		}

	});

});

