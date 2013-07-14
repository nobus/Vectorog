
var WorldMap = {
	locations: {}
}

WorldMap.getLocationByLID = function(lid) {
	return this.locations[lid];
}

WorldMap.getLIDByXYZ = function(x, y, z) {
	return parseInt(x) + "_" + parseInt(y) + "_" + parseInt(z);
}

WorldMap.getXYZByLID = function(lid) {
	var raw = lid.split("_");
	return [parseInt(raw[0]), parseInt(raw[1]), parseInt(raw[2])];
}

WorldMap.generateLocationType = function(x, y, z) {
	var ground = ["veld", "forest", "thicket"];
	var underground = ["cave", "mine"];

	if (x == 0 && y == 0 && z == 0) {
		return "veld";
	} else if (z == 0) {
		return ground[getRandomInt(0, ground.length - 1)];
	} else {
		return underground[getRandomInt(0, underground.length - 1)];
	}
}

WorldMap._newLocation = function(name, x, y, z, px, py) {
	// px and py == undefined if palyer not in location
	var lid = this.getLIDByXYZ(x, y, z);

	if (!(lid in this.locations)) {
		var type = this.generateLocationType(x, y, z);
		var loc = new Location(name, type, lid, px, py);
		this.locations[lid] = loc;
	}

	return this.locations[lid];
}

WorldMap.getLocation = function(name, x, y, z, px, py) {
	var loc = this._newLocation(name, x, y, z, px, py);

	/*
	setNeighborhood:
		top		later	!!!!!
		down	later	!!!!!
		west
		east
		north
		south
	*/

	this._newLocation("UNDEFINED", x - 1, y, z);
	this._newLocation("UNDEFINED", x + 1, y, z);
	this._newLocation("UNDEFINED", x, y - 1, z);
	this._newLocation("UNDEFINED", x, y + 1, z);

	return loc;
}

WorldMap.getNeighborhoodLocation = function (direction, lid) {
	var coord = this.getXYZByLID(lid);
	var x = coord[0];
	var y = coord[1];
	var z = coord[2];

	if (direction == "north") {
		y--;
	} else if (direction == "south") {
		y++;
	} else if (direction == "west") {
		x--;
	} else if (direction == "east") {
		x++;
	}

	var new_lid = this.getLIDByXYZ(x, y, z);

	if (new_lid in this.locations) {
		return new_lid;
	}

	return false;
}

var Location = function(name, type, lid, px, py) {
	this.name = name;
	this.type = type;
	this.lid = lid;
	this.neighborhood = {};	// ???
	this.portals = portalsGenerator();
	this.maps = mapGenerator(this, px, py);
	this.bg_color = bgFactory(type);
}

var bgFactory = function(type) {
	var locationTypes = {"thicket": "#5da130", "forest": "#5da130", "veld": "#5da130", "cave": "#99958c", "mine": "#99958c"};
	return locationTypes[type];
}

var portalsGenerator = function() {
	var portals = [];

	// in location 2 side
	var side = [[0, 9], [10, 19]];

	for (var i = 0; i < 2; i++) {
		var n = getRandomInt(0, 1);

		if (n) {
			var s = side[i];
			var x = getRandomInt(s[0], s[1]);
			var y = getRandomInt(0, 14);
			portals.push([x, y]);
		}
	}

	return portals;
}

var checkPortal = function(portals, x, y) {
	if (portals.length > 0) {
		for (var i = 0; i < portals.length; i++){
			var p = portals[i];
			if (x == p[0] && y == p[1]) {
				return true;
			}
		}
	}

	return false;
}

var mapGenerator = function(loc, px, py) {
	var locationTypes = {"thicket": 0.5, "forest": 0.7, "veld": 0.9};
	var t = locationTypes[loc.type];

	var l = [];

	for (var y = 0; y < 15; y++){
		l.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

		for (var x = 0; x < 20; x++){
			var r = randInt();

			if (checkPortal(loc.portals, x, y)) {
				l[y][x] = 2617;
			} else if (r > t) {
				l[y][x] = 2663;
			}
		}
	}

	return l;
}




