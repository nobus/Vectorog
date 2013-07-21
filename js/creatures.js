
var Creatures = function (ctx) {
	this.ctx = ctx;
	this.sprite = this.draw();
	this.initMenu();
}

Creatures.prototype.initMap = function () {
	// 20 x 15 - > 60 x 45 * 2 -> 120 x 90
	this.map = Raphael("map", 120, 90, function () {
				this.rect(0, 0, 120, 90).attr({"fill": "#5da130"});
			}); 
}

Creatures.prototype.initBackpack = function () {
	this.backpack = Raphael("backpack", 120, 160, function () {
				this.rect(0, 0, 120, 160).attr({"fill": "#cd853f"});
				// from vectorog.js:
				drawGrid(this, 120, 160, 40);
			}); 
}

Creatures.prototype.initMenu = function () {
	$("#might").html("Might: " + this.ctx.might);
	$("#dex").html("Dex: " + this.ctx.dex);
	$("#int").html("Int: " + this.ctx.intel);

	$("#health").html("Health: " + this.ctx.health);
	$("#stamina").html("Stamina: " + this.ctx.stamina);
	$("#mana").html("Mana: " + this.ctx.mana);

	$("#coints").html("Coints: " + this.ctx.coints);

	this.initMap();
	this.initBackpack();
}

Creatures.prototype.draw = function () {
	return this.ctx.paper.text(this.ctx.x, this.ctx.y, this.ctx.view).attr({"font": "20px Arial"});
}

Creatures.prototype.getPosition = function () {
	return [this.ctx.x, this.ctx.y];
}

Creatures.prototype.getLID = function () {
	return this.ctx.lid;
}

Creatures.prototype.getView = function () {
	return this.ctx.view;
}

Creatures.prototype.getName = function () {
	return this.ctx.name;
}

Creatures.prototype.setLID = function (lid, paper) {
	this.ctx.lid = lid;
}

Creatures.prototype.setPosition = function (x, y, paper) {
	this.ctx.x = x;
	this.ctx.y = y;

	if (paper && this.paper != paper) {
		this.ctx.paper = paper;
		this.sprite = this.draw();
	}

	this.sprite.attr({"x": x, "y": y});
}




