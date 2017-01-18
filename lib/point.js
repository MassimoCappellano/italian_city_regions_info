'use strict';

function Point(vLat, vLong){
	this.vLat = vLat;
	this.vLong = vLong;
}

Point.prototype.lat = function() {
	return this.vLat;
};

Point.prototype.lng = function() {
	return this.vLong;
};

module.exports = Point;

