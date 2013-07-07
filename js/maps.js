
var WorldMap = {
	locations: {}
}

WorldMap.getLocationByLID = function(lid) {
	return this.locations[lid];
}

WorldMap.getLIDByXYZ = function(x, y, z) {
	return x + "_" + y + "_" + z;
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

var Location = function(name, type, px, py) {
	this.name = name;
	this.type = type;
	this.neighborhood = {};
	this.maps = this.mapGenerator(px, py);
}

Location.prototype.mapGenerator = function(px, py) {
	// 20 x 15
	// tree = "\u2663"

	/*
		types:
			forest = 0.7
			thicket = 0.5


	*/

	var locationTypes = {"thicket": 0.5, "forest": 0.7, "veld": 0.9};
	var t = locationTypes[this.type];

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

Location.prototype.getMaps = function() {
	return this.maps;
}

Location.prototype.setNeighborhood = function (direction, lid) {
	/*
		top
		down
		west
		east
		north
		south
	*/

	this.neighborhood[direction] = lid;
}

