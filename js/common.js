
var randInt = function() {
	return Math.random();
}

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var storageSupport = function() {
	try {
    	return 'localStorage' in window && window['localStorage'] !== null;
  	} catch (e) {
    	return false;
  	}
}


