
var randInt = function() {
	return Math.random();
}

var storageSupport = function() {
	try {
    	return 'localStorage' in window && window['localStorage'] !== null;
  	} catch (e) {
    	return false;
  	}
}


