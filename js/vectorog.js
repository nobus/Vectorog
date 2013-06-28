
var drawAll = function() {
	var bg = this.rect(0, 0, 800, 600).attr({"fill": "#5da130"});
	var txt = this.text(100, 100, "@").attr({"font": "20px Arial"});
}

$(function() {
	var screen = Raphael("container", 800, 600, drawAll); 
});

