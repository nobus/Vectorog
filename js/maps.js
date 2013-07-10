
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
	return lid.split("_");
}

WorldMap._newLocation = function(name, type, x, y, z, px, py) {
	// px and py == undefined if palyer not in location
	var lid = this.getLIDByXYZ(x, y, z);

	if (!(lid in this.locations)) {
		var l = new Location(name, type, px, py);
		this.locations[lid] = l;
	}

	return lid;
}

WorldMap.newLocation = function(name, type, x, y, z, px, py) {
	var lid = this._newLocation(name, type, x, y, z, px, py);

	/*
	setNeighborhood:
		top		later	!!!!!
		down	later	!!!!!
		west
		east
		north
		south
	*/

	this._newLocation("UNDEFINED", type, x - 1, y, z);
	this._newLocation("UNDEFINED", type, x + 1, y, z);
	this._newLocation("UNDEFINED", type, x, y - 1, z);
	this._newLocation("UNDEFINED", type, x, y + 1, z);

	return lid;
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

var Location = function(name, type, px, py) {
	this.name = name;
	this.type = type;
	this.neighborhood = {};	// ???
	this.maps = mapGenerator(type, px, py);
	this.bg_color = bgFactory(type);
}

var bgFactory = function(type) {
	var locationTypes = {"thicket": "#5da130", "forest": "#5da130", "veld": "#5da130"};
	return locationTypes[type];
}

var mapGenerator = function(type, px, py) {
	// 20 x 15
	// tree = "\u2663"

	/*
		types:
			forest = 0.7
			thicket = 0.5


	*/

	var locationTypes = {"thicket": 0.5, "forest": 0.7, "veld": 0.9};
	var t = locationTypes[type];

	var l = [];

	for (var i = 0; i < 15; i++){
		l.push([]);

		for (var ii = 0; ii < 20; ii++){
			var r = randInt();

			if (i == py && ii == px) {
				l[i].push(0);  // player
			}

			if (r > t){
				l[i].push(2663);
			} else {
				l[i].push(0);
			}
		}
	}

	return l;
}



