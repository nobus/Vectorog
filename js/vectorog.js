
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

var drawAll = function (paper, name, type, x, y, z, px, py) {
	var bg = paper.rect(0, 0, 800, 600).attr({"fill": "#5da130"});
	var lid = WorldMap.newLocation(name, type, x, y, z, px, py);
	var l = WorldMap.getLocationByLID(lid);

	drawLocation(paper, l);
	drawGrid(paper);

	$("#map").html(lid);

	return lid;
}

var drawStartLocation = function () {
	var lid = drawAll(this, "Starting location.", "veld", 0, 0, 0, 2, 2);
	player = new Creatures("Player", "@", lid, this, 100, 100);
}

var drawSomeLocation = function (direction) {
	var c = WorldMap.getXYZByLID(player.getLID());
	var x = c[0];
	var y = c[1];
	var z = c[2];

	var p = player.getPosition();
	var px = p[0];
	var py = p[1];

	if (direction == "north") {
		y--;
		py = 580;
	} else if (direction == "south") {
		y++;
		py = 20;
	} else if (direction == "west") {
		x--;
		px = 780;
	} else if (direction == "east") {
		x++;
		px = 20;
	}

	$("#container").html("");

	var screen = Raphael("container", 800, 600, function () {
			var lid = drawAll(this, "UNDEFINED", "veld", x, y, z, px, py);			

			player.setLID(lid);
			player.setPosition(px, py, this);

		}); 
}

var checkPath = function (x, y) {
	// 0, 0, 800, 600
	var xx = Math.ceil(x / 40) - 1;
	var yy = Math.ceil(y / 40) - 1;

	var lid = player.getLID();
	var l = WorldMap.getLocationByLID(lid);
	var maps = l.getMaps();

	if (xx >= 0 && yy >= 0 && yy < maps.length && xx < maps[yy].length){
		var e = maps[yy][xx];

		if (e == 2663) {
			return false;
		}
	}

	return true;
}

var nextLocation = function(x, y) {
	// 0, 0, 800, 600
	if (x <= 0 || x >= 800){
		return true;
	} else if (y <= 0 || y >= 600) {
		return true;
	}

	return false;
}

$(function() {
	var screen = Raphael("container", 800, 600, drawStartLocation); 

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

		var position = player.getPosition();
		var x = position[0];
		var y = position[1];

		var step = 40;
		if (key == 87 || key == 38) {
			// up
			if (checkPath(x, y - step)) {
				if (nextLocation(x, y - step)) {
					drawSomeLocation("north");
				} else {
					player.setPosition(x, y - step);
				}
			}
		} else if (key == 83 || key == 40) {
			// down
			if (checkPath(x, y + step)) {
				if (nextLocation(x, y + step)) {
					drawSomeLocation("south");
				} else {
					player.setPosition(x, y + step);
				}
			}
		} else if (key == 65 || key == 37) {
			// left
			if (checkPath(x - step, y)) {
				if (nextLocation(x - step, y)) {
					drawSomeLocation("west");
				} else {
					player.setPosition(x - step, y);
				}
			}
		} else if (key == 68 || key == 39) {
			// right
			if (checkPath(x + step, y)) {
				if (nextLocation(x + step, y)) {
					drawSomeLocation("east");
				} else {
					player.setPosition(x + step, y);
				}
			}
		}

	});

});

