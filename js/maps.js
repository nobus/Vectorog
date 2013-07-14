
var WorldMap = {
	locations: {}
}

WorldMap.getLocationByLID = function(lid) {
	return this.locations[lid];
}

WorldMap.getLocationByXYZ = function(xyz) {
	var lid = this.getLIDByXYZ(xyz);
	return this.locations[lid];
}

WorldMap.getLIDByXYZ = function(xyz) {
	return parseInt(xyz.x) + "_" + parseInt(xyz.y) + "_" + parseInt(xyz.z);
}

WorldMap.getXYZByLID = function(lid) {
	var raw = lid.split("_");

	var xyz = {};
	xyz.x = parseInt(raw[0]); 
	xyz.y = parseInt(raw[1]); 
	xyz.z = parseInt(raw[2]);	// need {} !!!!

	return xyz;
}

WorldMap.generateLocationType = function(xyz) {
	var ground = ["veld", "forest", "thicket"];
	var underground = ["cave"];

	if (xyz.x == 0 && xyz.y == 0 && xyz.z == 0) {
		return "veld";
	} else if (xyz.z == 0) {
		return ground[getRandomInt(0, ground.length - 1)];
	} else {
		return underground[getRandomInt(0, underground.length - 1)];
	}
}

WorldMap._newLocation = function(name, xyz, px, py) {
	// px and py == undefined if palyer not in location
	var lid = this.getLIDByXYZ(xyz);

	if (!(lid in this.locations)) {
		var type = this.generateLocationType(xyz);
		var loc = new Location(name, type, lid, px, py);
		this.locations[lid] = loc;
	}

	return this.locations[lid];
}

WorldMap.chunkGenerator = function(xyz) {
	return {};
}

WorldMap.getLocation = function(name, xyz, px, py) {
	/*
		!!!!!!!!!!!!!!!
		need chunk generator
		!!!!!!!!!!!!!!!
	*/

	var loc = this._newLocation(name, xyz, px, py);

	// west
	this._newLocation("UNDEFINED", {"x": xyz.x - 1, "y": xyz.y, "z": xyz.z});

	// east
	this._newLocation("UNDEFINED", {"x": xyz.x + 1, "y": xyz.y, "z": xyz.z});

	// north
	this._newLocation("UNDEFINED", {"x": xyz.x, "y": xyz.y - 1, "z": xyz.z});

	// south
	this._newLocation("UNDEFINED", {"x": xyz.x, "y": xyz.y + 1, "z": xyz.z});

	// down
	if (xyz.z > -9) {
		this._newLocation("UNDEFINED", {"x": xyz.x, "y": xyz.y, "z": xyz.z - 1});
	}

	// top
	if (xyz.z < 0 ) {
		this._newLocation("UNDEFINED", {"x": xyz.x, "y": xyz.y, "z": xyz.z + 1});
	}

	return loc;
}

WorldMap.getNeighborhoodLocation = function (direction, lid) {
	var xyz = this.getXYZByLID(lid);

	if (direction == "north") {
		xyz.y--;
	} else if (direction == "south") {
		xyz.y++;
	} else if (direction == "west") {
		xyz.x--;
	} else if (direction == "east") {
		xyz.x++;
	} else if (direction == "down") {
		xyz.z--;
	} else if (direction == "up") {
		xyz.z++;
	}

	var new_lid = this.getLIDByXYZ(xyz);

	if (!(new_lid in this.locations)) {
		var new_xyz = this.getXYZByLID(lid)
		this.getLocation("UNDEFINED", new_xyz);
	}	

	return new_lid;
}

var Location = function(name, type, lid, px, py) {
	this.name = name;
	this.type = type;
	this.lid = lid;
	this.xyz = WorldMap.getXYZByLID(lid);

	this.upPortals = createUpPortals(this);
	this.downPortals = portalsGenerator(this, px, py);

	this.maps = mapGenerator(this, px, py);
	this.bg_color = bgFactory(type);
}

var bgFactory = function(type) {
	var locationTypes = {"thicket": "#5da130", "forest": "#5da130", "veld": "#5da130", "cave": "#99958c"};
	return locationTypes[type];
}

var createUpPortals = function(loc) {
	// all down portal have up portal
	var xyz = WorldMap.getXYZByLID(loc.lid);

	// if this location is undeground
	if (xyz.z < 0 ) {
		var locup_lid = WorldMap.getNeighborhoodLocation("up", loc.lid);
		var locup = WorldMap.getLocationByLID(locup_lid);

		return locup.downPortals;
	} else {
		return [];
	}
}

var portalsGenerator = function(loc, px, py) {
	var portals = [];

	// in location 2 side
	var side = [[0, 9], [10, 19]];

	for (var i = 0; i < 2; i++) {
		var n = getRandomInt(0, 1);

		if (n) {
			var s = side[i];
			var x = getRandomInt(s[0], s[1]);
			var y = getRandomInt(0, 14);

			// player
			if (x == px && y == py) {
				continue;
			}

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
	var z = loc.xyz.z;	

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

			// player
			if (x == px && y == py) {
				continue;
			}

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

			// player
			if (x == px && y == py) {
				continue;
			}

			if (checkUpPortal(loc, x, y)) {
				l[y][x] = 2616;
			} else if (checkDownPortal(loc, x, y)) {
				l[y][x] = 2617;
			}
		}
	}

	return l;
}


