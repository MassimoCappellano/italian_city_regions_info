'use strict';

const test = require('tape');

const checkContiguity = require('../lib/geo/check_contiguity');

/*

SAMARATE
"bounds" : {
               "northeast" : {
                  "lat" : 45.6430867,
                  "lng" : 8.8042525
               },
               "southwest" : {
                  "lat" : 45.6027756,
                  "lng" : 8.7624716
               }
            },


FERNO
"bounds" : {
               "northeast" : {
                  "lat" : 45.63416369999999,
                  "lng" : 8.7784896
               },
               "southwest" : {
                  "lat" : 45.6061066,
                  "lng" : 8.7066842
               }
            },
VARESE
"bounds" : {
               "northeast" : {
                  "lat" : 45.8645247,
                  "lng" : 8.863587299999999
               },
               "southwest" : {
                  "lat" : 45.7805121,
                  "lng" : 8.7758284
               }
            },

*/

function xtest(){

}

function buildArea(point1, point2){

	return {
		northeast: {
			lat: point1.lat,
			lng: point1.lng
		},
		southwest: {
			lat: point2.lat,
			lng: point2.lng
		}
	};
}

test('test SAMARATE - FERNO', function(t) {
	// SAMARATE
	const area1 = buildArea({lat: 45.6430867, lng: 8.8042525 }, {lat: 45.6027756, lng: 8.7624716 });

	// FERNO
	const area2 = buildArea({lat: 45.63416369999999, lng: 8.7784896 }, {lat: 45.6061066, lng: 8.7066842 }); 

	var bRes = checkContiguity.checkContiguity(area1, area2);

	console.log(area1, area2, ' --> ', bRes);

   t.equal(true, bRes);
	t.end();
});

test('test SAMARATE - VARESE', function(t) {
	// SAMARATE
	const area1 = buildArea({lat: 45.6430867, lng: 8.8042525 }, {lat: 45.6027756, lng: 8.7624716 });

  /*
	VARESE
"bounds" : {
               "northeast" : {
                  "lat" : 45.8645247,
                  "lng" : 8.863587299999999
               },
               "southwest" : {
                  "lat" : 45.7805121,
                  "lng" : 8.7758284
               }
            },
  */
	// VARESE
	const area2 = buildArea({lat: 45.8645247, lng: 8.863587299999999 }, {lat: 45.7805121, lng: 8.7758284 }); 

	var bRes = checkContiguity.checkContiguity(area1, area2);

	console.log(area1, area2, ' --> ', bRes);

   t.equal(false, bRes);
	t.end();
});


test('test FERNO - VARESE', function(t) {
	// FERNO
	const area1 = buildArea({lat: 45.63416369999999, lng: 8.7784896 }, {lat: 45.6061066, lng: 8.7066842 });

  /*
	VARESE
"bounds" : {
               "northeast" : {
                  "lat" : 45.8645247,
                  "lng" : 8.863587299999999
               },
               "southwest" : {
                  "lat" : 45.7805121,
                  "lng" : 8.7758284
               }
            },
  */
	// VARESE
	const area2 = buildArea({lat: 45.8645247, lng: 8.863587299999999 }, {lat: 45.7805121, lng: 8.7758284 }); 

	var bRes = checkContiguity.checkContiguity(area1, area2);

	console.log(area1, area2, ' --> ', bRes);

   t.equal(false, bRes);
	t.end();
});


test('test SAMARATE - LOMBARDIA', function(t) {
	// SAMARATE
	const area1 = buildArea({lat: 45.6430867, lng: 8.8042525 }, {lat: 45.6027756, lng: 8.7624716 });

	/*
	bounds" : {
               "northeast" : {
                  "lat" : 46.6351853,
                  "lng" : 11.4276993
               },
               "southwest" : {
                  "lat" : 44.6796491,
                  "lng" : 8.4978605
               }
            },

	*/
	// LOMBARDIA
	const area2 = buildArea({lat: 46.6351853, lng: 11.4276993 }, {lat: 44.6796491, lng: 8.4978605 }); 

	var bRes = checkContiguity.checkContiguity(area1, area2);

	console.log(area2);
	console.log(area1);

	t.equal( true, bRes);
	t.end();
});

test('test SAMARATE - P COMO', function(t) {
	// SAMARATE
	const area1 = buildArea({lat: 45.6430867, lng: 8.8042525 }, {lat: 45.6027756, lng: 8.7624716 });

	/*
	bounds" : {
               "northeast" : {
                  "lat" : 46.2395544,
                  "lng" : 9.440817800000001
               },
               "southwest" : {
                  "lat" : 45.6397384,
                  "lng" : 8.8935168
               }
            },

	*/
	// P COMO
	const area2 = buildArea({lat: 46.2395544, lng: 9.440817800000001 }, {lat: 45.6397384, lng: 8.8935168 }); 

	var bRes = checkContiguity.checkContiguity(area1, area2);

	console.log(area2);
   console.log(area1);

	t.equal(false, bRes);
	t.end();
});

test('test P VARESE - P COMO', function(t) {

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

	// P VARESE
	const area1 = buildArea({lat: 46.1221409, lng: 9.0660618 }, {lat: 45.558311, lng: 8.5522925 });

	/*
	bounds" : {
               "northeast" : {
                  "lat" : 46.2395544,
                  "lng" : 9.440817800000001
               },
               "southwest" : {
                  "lat" : 45.6397384,
                  "lng" : 8.8935168
               }
            },

	*/
	// P COMO
	const area2 = buildArea({lat: 46.2395544, lng: 9.440817800000001 }, {lat: 45.6397384, lng: 8.8935168 }); 

	var bRes = checkContiguity.checkContiguity(area1, area2);

	console.log(area2);
	console.log(area1);

	t.equal( true, bRes);
	t.end();
});

test('test P VARESE - P MANTOVA', function(t) {

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

	// P VARESE
	const area1 = buildArea({lat: 46.1221409, lng: 9.0660618 }, {lat: 45.558311, lng: 8.5522925 });

	/*
	"bounds" : {
               "northeast" : {
                  "lat" : 45.4281063,
                  "lng" : 11.4277056
               },
               "southwest" : {
                  "lat" : 44.9083042,
                  "lng" : 10.3092922
               }
            },

	*/
	// P MANTOVA
	const area2 = buildArea({lat: 45.4281063, lng: 11.4277056 }, {lat: 44.9083042, lng: 10.3092922 }); 

	var bRes = checkContiguity.checkContiguity(area1, area2);

	console.log(area2);
	console.log(area1);

	t.equal( false, bRes);
	t.end();
});

/*
LIGURIA vs LOMBARDIA

"bounds": {
    "northeast": {
     "lat": 44.6764264,
     "lng": 10.0710317
    },
    "southwest": {
     "lat": 43.7596721,
     "lng": 7.4948099
    }
   },


   "bounds": {
    "northeast": {
     "lat": 46.6351853,
     "lng": 11.4276993
    },
    "southwest": {
     "lat": 44.6796491,
     "lng": 8.4978605
    }
   },


*/

test('test LIGURIA - LOMBARDIA', function(t) {

   /*
      
     "bounds": {
    "northeast": {
     "lat": 44.6764264,
     "lng": 10.0710317
    },
    "southwest": {
     "lat": 43.7596721,
     "lng": 7.4948099
    }
   },
   */

   // LIGURIA
    
   const area1 = buildArea({lat: 44.6764264, lng: 10.0710317 }, {lat: 43.7596721, lng: 7.4948099 });

   /*
   "bounds": {
    "northeast": {
     "lat": 46.6351853,
     "lng": 11.4276993
    },
    "southwest": {
     "lat": 44.6796491,
     "lng": 8.4978605
    }
   },

   */
   // LOMBARDIA
   const area2 = buildArea({lat: 46.6351853, lng: 11.4276993 }, {lat: 44.6796491, lng: 8.4978605 }); 

   var bRes = checkContiguity.checkContiguity(area1, area2);

   console.log(area2);
   console.log(area1);

   t.equal(true, bRes);
   t.end();
});







