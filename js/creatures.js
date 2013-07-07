
var Creatures = function (name, view, lid, paper, x, y) {
	this.name = name;
	this.view = view;
	this.lid = lid;
	this.paper = paper;
	this.x = y;
	this.y = y;

	this.sprite = this.draw();
}

Creatures.prototype.draw = function () {
	return this.paper.text(this.x, this.y, this.view).attr({"font": "20px Arial"});
}

Creatures.prototype.getPosition = function () {
	return [this.x, this.y];
}

Creatures.prototype.getLID = function () {
	return this.lid;
}

Creatures.prototype.getView = function () {
	return this.view;
}

Creatures.prototype.getName = function () {
	return this.name;
}

Creatures.prototype.setLID = function (lid, paper) {
	this.lid = lid;
}

Creatures.prototype.setPosition = function (x, y, paper) {
	this.x = x;
	this.y = y;

	if (paper && this.paper != paper) {
		this.paper = paper;
		this.sprite = this.draw();
	}

	this.sprite.attr({"x": x, "y": y});
}




