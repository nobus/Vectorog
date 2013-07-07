
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

WorldMap.newLocation = function(name, type, x, y, z, px, py) {
	// px and py == undefined if palyer not in location
	var l = new Location(name, type, px, py);
	var lid = this.getLIDByXYZ(x, y, z);

	this.locations[lid] = l;

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
		lid is index of the array World.locations

		top
		down
		west
		east
		north
		south
	*/

	this.neighborhood[direction] = lid;
}

