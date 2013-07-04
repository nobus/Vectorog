
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

// 20 x 15
// var Location = []
var lid = 0;

var drawLocation = function(paper, l) {
	var x = 20;
	var y = 20;

	var maps = l.getMaps();

	for (var i = 0; i < maps.length; i++){
		for (var ii = 0; ii < maps[i].length; ii++){
			var e = maps[i][ii];

			if (e == 2663) {
				paper.text(x, y, "\u2663").attr({"font": "20px Arial"});
			}

			x += 40;
		}
		x = 20;
		y += 40;
	}
}

var drawGrid = function(paper){
	var size= 40

	for(var i = 0; i < 800; i = i + size){
		for (var ii = 0; ii < 600; ii = ii + size){
			paper.rect(i, ii, size, size);
		}
	}
}

var drawAll = function() {
	var bg = this.rect(0, 0, 800, 600).attr({"fill": "#5da130"});
	drawGrid(this);
	lid = WorldMap.newLocation("Starting location.", "veld", 2, 2);

	var l = WorldMap.getLocationByLID(lid);
	drawLocation(this, l);

	player = this.text(100, 100, "@").attr({"font": "20px Arial"});
	//tree = this.text(20, 20, "\u2663").attr({"font": "20px Arial"});
}

var checkPath = function(x, y) {
	// 0, 0, 800, 600
	if (x <= 0 || x >= 800){
		return false;
	} else if (y <= 0 || y >= 600) {
		return false;
	}

	var xx = Math.ceil(x / 40) - 1;
	var yy = Math.ceil(y / 40) - 1;

	var l = WorldMap.getLocationByLID(lid);
	var maps = l.getMaps();

	var e = maps[yy][xx];

	if (e == 2663) {
		return false;
	}

	return true;
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

		var step = 40;
		if (key == 87 || key == 38) {
			// up
			if (checkPath(x , y - step)){
				player.attr({"y": y - step});
			}
		} else if (key == 83 || key == 40) {
			// down
			if (checkPath(x, y + step)){
				player.attr({"y": y + step});
			}
		} else if (key == 65 || key == 37) {
			// left
			if (checkPath(x - step, y)){
				player.attr({"x": x - step});
			}
		} else if (key == 68 || key == 39) {
			// right
			if (checkPath(x + step, y)){
				player.attr({"x": x + step});
			}
		}

	});

});

