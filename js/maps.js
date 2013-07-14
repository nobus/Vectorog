
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
	return [parseInt(raw[0]), parseInt(raw[1]), parseInt(raw[2])];	// need {} !!!!
}

WorldMap.generateLocationType = function(x, y, z) {
	var ground = ["veld", "forest", "thicket"];
	var underground = ["cave"];

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
	/*
		!!!!!!!!!!!!!!!
		need chunk generator
		!!!!!!!!!!!!!!!
	*/

	var loc = this._newLocation(name, x, y, z, px, py);

	// west
	this._newLocation("UNDEFINED", x - 1, y, z);

	// east
	this._newLocation("UNDEFINED", x + 1, y, z);

	// north
	this._newLocation("UNDEFINED", x, y - 1, z);

	// south
	this._newLocation("UNDEFINED", x, y + 1, z);

	// down
	if (z > -9) {
		this._newLocation("UNDEFINED", x, y, z - 1);
	}

	// top
	if (z < 0 ) {
		this._newLocation("UNDEFINED", x, y, z + 1);
	}

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
	} else if (direction == "down") {
		z--;
	} else if (direction == "up") {
		z++;
	}

	var new_lid = this.getLIDByXYZ(x, y, z);

	if (!(new_lid in this.locations)) {
		var c = this.getXYZByLID(lid)
		this.getLocation("UNDEFINED", c[0], c[1], c[2]);
	}	

	return new_lid;
}

var Location = function(name, type, lid, px, py) {
	this.name = name;
	this.type = type;
	this.lid = lid;
	this.coord = WorldMap.getXYZByLID(lid);

	this.upPortals = createUpPortals(this);
	this.downPortals = portalsGenerator(this);

	this.maps = mapGenerator(this, px, py);
	this.bg_color = bgFactory(type);
}

var bgFactory = function(type) {
	var locationTypes = {"thicket": "#5da130", "forest": "#5da130", "veld": "#5da130", "cave": "#99958c"};
	return locationTypes[type];
}

var createUpPortals = function(loc) {
	// all down portal have up portal
	var coord = WorldMap.getXYZByLID(loc.lid);

	// if this location is undeground
	if (coord[2] < 0 ) {
		var locup_lid = WorldMap.getNeighborhoodLocation("up", loc.lid);
		var locup = WorldMap.getLocationByLID(locup_lid);

		return locup.downPortals;
	} else {
		return [];
	}
}

var portalsGenerator = function(loc) {
	var portals = [];

	// in location 2 side
	var side = [[0, 9], [10, 19]];

	for (var i = 0; i < 2; i++) {
		var n = getRandomInt(0, 1);

		if (n) {
			var s = side[i];
			var x = getRandomInt(s[0], s[1]);
			var y = getRandomInt(0, 14);

			if (!checkUpPortal(loc, x, y)) { 
				portals.push([x, y]);
			}
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

var checkUpPortal = function(loc, x, y) {
	return checkPortal(loc.upPortals, x, y);
}

var checkDownPortal = function(loc, x, y) {
	return checkPortal(loc.downPortals, x, y);
}

var blankMap = function() {
	var map = [];

	for (var y = 0; y < 15; y++){
		map.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
	}

	return map;
}

var mapGenerator = function(loc, px ,py) {
	var z = loc.coord[2];	

	if (z < 0 ) {
		return undegroundGenerator(loc, px, py);
	} else {
		return groundGenerator(loc, px, py);
	}
}

var groundGenerator = function(loc, px, py) {
	var locationTypes = {"thicket": 0.5, "forest": 0.7, "veld": 0.9};
	var t = locationTypes[loc.type];

	var l = blankMap();

	for (var y = 0; y < 15; y++){
		for (var x = 0; x < 20; x++){
			var r = randInt();

			if (checkDownPortal(loc, x, y)) {
				l[y][x] = 2617;
			} else if (r > t) {
				l[y][x] = 2663;
			}
		}
	}

	return l;
}

var undegroundGenerator = function(loc, px, py) {
	var l = blankMap();

	for (var y = 0; y < 15; y++){
		for (var x = 0; x < 20; x++){
			if (checkUpPortal(loc, x, y)) {
				l[y][x] = 2616;
			} else if (checkDownPortal(loc, x, y)) {
				l[y][x] = 2617;
			}
		}
	}

	return l;
}


