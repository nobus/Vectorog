
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

var gamePaused = false;		// ugly hack
var player = NaN;

// 20 x 15
var lid = 0;

var drawLocation = function(paper, l) {
	var x = 20;
	var y = 20;

	var maps = l.maps;

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

var checkPath = function (x, y, lid) {
	if (gamePaused) {
		return false;
	}

	// 0, 0, 800, 600

	if (x <= 0 || x >= 800) {
		return false;
	} else if (y <= 0 || y >= 600) {
		return false;
	}

	var xx = Math.ceil(x / 40) - 1;
	var yy = Math.ceil(y / 40) - 1;

	var l = WorldMap.getLocationByLID(lid);
	var maps = l.maps;

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

	var current_lid = player.getLID();

	if (x <= 0){
		// west
		var next_location = WorldMap.getNeighborhoodLocation("west", current_lid);
		x = 780;
		return checkPath(x, y, next_location);
	} else if (x >= 800){
		// east
		var next_location = WorldMap.getNeighborhoodLocation("east", current_lid);
		x = 20;
		return checkPath(x, y, next_location);
	} else if (y <= 0) {
		// north
		var next_location = WorldMap.getNeighborhoodLocation("north", current_lid);
		y = 580;
		return checkPath(x, y, next_location);
	} else if (y >= 600) {
		// south
		var next_location = WorldMap.getNeighborhoodLocation("south", current_lid);
		y = 20;
		return checkPath(x, y, next_location);
	}

	return false;
}

$(function() {
	if (storageSupport()) {
		if ("vectorog" in window.localStorage) {
			WorldMap["locations"] = JSON.parse(window.localStorage["vectorog"]);
		}
	} else {
		return false;
	}

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

		var lid = player.getLID();

		var step = 40;
		if (key == 87 || key == 38) {
			// up
			if (nextLocation(x, y - step)) {
				drawSomeLocation("north");
			} else if (checkPath(x, y - step, lid)) {
				player.setPosition(x, y - step);
			}
		} else if (key == 83 || key == 40) {
			// down
			if (nextLocation(x, y + step)) {
				drawSomeLocation("south");
			} else if (checkPath(x, y + step, lid)) {
				player.setPosition(x, y + step);
			}
		} else if (key == 65 || key == 37) {
			// left
			if (nextLocation(x - step, y)) {
				drawSomeLocation("west");
			} else if (checkPath(x - step, y, lid)) {
				player.setPosition(x - step, y);
			}
		} else if (key == 68 || key == 39) {
			// right
			if (nextLocation(x + step, y)) {
				drawSomeLocation("east");
			} else if (checkPath(x + step, y, lid)) {
				player.setPosition(x + step, y);
			}
		}

	});

	$("#menu").click(function(){
		gamePaused = true;
		$("#dialog_menu").show();
	});

	$("#return").click(function(){
		gamePaused = false;
		$("#dialog_menu").hide();
	});

	$("#save_game").click(function(){
		window.localStorage["vectorog"] = JSON.stringify(WorldMap["locations"]);
	});
});

