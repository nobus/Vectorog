
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

	var bg_color = l.bg_color;
	paper.rect(0, 0, 800, 600).attr({"fill": bg_color});

	var maps = l.maps;

	for (var i = 0; i < maps.length; i++){
		for (var ii = 0; ii < maps[i].length; ii++){
			var e = maps[i][ii];

			if (e == 2663) {
				paper.text(x, y, "\u2663").attr({"font": "20px Arial"});
			} else if (e == 2617) {
				paper.text(x, y, "\u2617").attr({"font": "20px Arial"});
			} else if (e == 2616) {
				paper.text(x, y, "\u2616").attr({"font": "20px Arial"});
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

var drawAll = function (paper, name, xyz, px, py) {
	var loc = WorldMap.getLocation(name, xyz, px, py);

	drawLocation(paper, loc);
	drawGrid(paper);

	$("#map").html(loc.lid);

	return loc.lid;
}

var drawStartLocation = function () {
	var lid = drawAll(this, "Starting location.", {"x": 0, "y": 0, "z": 0}, 2, 2);
	player = new Creatures("Player", "@", lid, this, 100, 100);
}

var drawSomeLocation = function (direction) {
	var xyz = WorldMap.getXYZByLID(player.getLID());

	var p = player.getPosition();
	var px = p[0];
	var py = p[1];

	if (direction == "north") {
		xyz.y--;
		py = 580;
	} else if (direction == "south") {
		xyz.y++;
		py = 20;
	} else if (direction == "west") {
		xyz.x--;
		px = 780;
	} else if (direction == "east") {
		xyz.x++;
		px = 20;
	} else if (direction == "up") {
		xyz.z++;
	} else if (direction == "down") {
		xyz.z--;
	}

	$("#container").html("");

	var screen = Raphael("container", 800, 600, function () {
			var lid = drawAll(this, "UNDEFINED", xyz, px, py);			

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
		if (checkPath(x, y, next_location)) {
			return "west";
		}
	} else if (x >= 800){
		// east
		var next_location = WorldMap.getNeighborhoodLocation("east", current_lid);
		x = 20;
		if (checkPath(x, y, next_location)) {
			return "east";
		}
	} else if (y <= 0) {
		// north
		var next_location = WorldMap.getNeighborhoodLocation("north", current_lid);
		y = 580;
		if (checkPath(x, y, next_location)) {
			return "north";
		}
	} else if (y >= 600) {
		// south
		var next_location = WorldMap.getNeighborhoodLocation("south", current_lid);
		y = 20;
		if (checkPath(x, y, next_location)) {
			return "south";
		}
	}

	// get portals
	var curLocation = WorldMap.getLocationByLID(current_lid);

	x = Math.ceil(x / 40) - 1;
	y = Math.ceil(y / 40) - 1;

	// check portals
	if (checkUpPortal(curLocation, x, y)) {	
		// up or down
		return "up";
	} else if (checkDownPortal(curLocation, x, y)) {
		return "down"
	}

	return false;
}

var checkAndStep = function(x, y) {
	var lid = player.getLID();

	var direction = nextLocation(x, y);

	if (direction) {
		drawSomeLocation(direction);
	} else if (checkPath(x, y, lid)) {
		player.setPosition(x, y);
	}
}

$(function() {
	if (storageSupport()) {
		if ("vectorog" in window.localStorage) {
			WorldMap["locations"] = JSON.parse(window.localStorage["vectorog"]);
		} else {
			WorldMap.initialLocations();
		}
	} else {
		return false;
	}

	var screen = Raphael("container", 800, 600, drawStartLocation); 

	$(document).keydown(function(event){
		var key = event.keyCode;

		var position = player.getPosition();
		var x = position[0];
		var y = position[1];

		var step = 40;

		// w or up key
		if (key == 87 || key == 38) {
			// north
			checkAndStep(x, y - step);
		// s or down keys
		} else if (key == 83 || key == 40) {
			// south
			checkAndStep(x, y + step);
		// a or left keys
		} else if (key == 65 || key == 37) {
			// west
			checkAndStep(x - step, y);
		// d or right keys
		} else if (key == 68 || key == 39) {
			// east
			checkAndStep(x + step, y);
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
		gamePaused = false;
		$("#dialog_menu").hide();
	});

	$("#new_game").click(function(){
		$("#dialog_menu").hide();
		$("#dialog_approve").show();
	});

	$("#approve").click(function(){
		window.localStorage.removeItem("vectorog");
		window.location.reload();
	});

	$("#no_approve").click(function(){
		$("#dialog_approve").hide();
		gamePaused = false;
	});


});



