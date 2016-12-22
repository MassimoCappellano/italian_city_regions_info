'use strict';

const Point = require('../point');
const CalculateDistance = require('../calculate_distance');

const test = require('tape');

// for disable tests
function xtest(){

}

test('test on point coordinates', function(t) {
	const p1 = new Point(12.12, 14.21);

	t.equal(12.12, p1.lat());
	t.equal(14.21, p1.lng());
	t.end();
});

/*
	"bounds" : {
               "northeast" : {
                  "lat" : 46.1221409,
                  "lng" : 9.0660618
               },
               "southwest" : {
                  "lat" : 45.558311,
                  "lng" : 8.5522925
               }
            },

*/

test('test distance calculation', function(t) {

	const pNortEast = new Point(46.1221409, 9.0660618);
	const pSouthWest = new Point(45.558311, 8.5522925);
	let dinst = CalculateDistance.getDistance(pNortEast, pSouthWest);
	console.log('DINST: ', dinst);
	t.end();

});



