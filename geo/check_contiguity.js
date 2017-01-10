'use strict';



function checkIfInside(latN, latS, lngE, lngW, point){

		if( (point.lat <= latN && point.lat >= latS) && (point.lng <= lngE && point.lng >= lngW))
			return true;

		return false;
}

function checkContinuityInt(bounds1, bounds2) {
	 // NW
	const v1 = { 
		lat: parseFloat(bounds2.northeast.lat.toFixed(2)), 
		lng: parseFloat(bounds2.southwest.lng.toFixed(2)) 
		};

	// NE
	const v2 = { 
		lat: parseFloat(bounds2.northeast.lat.toFixed(2)), 
		lng: parseFloat(bounds2.northeast.lng.toFixed(2))
		};

	// SW
	const v3 = { 
		lat: parseFloat(bounds2.southwest.lat.toFixed(2)), 
		lng: parseFloat(bounds2.southwest.lng.toFixed(2))
		};

	// SE
	const v4 = { 
		lat: parseFloat(bounds2.southwest.lat.toFixed(2)), 
		lng: parseFloat(bounds2.northeast.lng.toFixed(2)) 
		};

	//
	const latN = parseFloat(bounds1.northeast.lat.toFixed(2));
	const latS = parseFloat(bounds1.southwest.lat.toFixed(2));

	const lngE = parseFloat(bounds1.northeast.lng.toFixed(2));
	const lngW = parseFloat(bounds1.southwest.lng.toFixed(2));

	// console.log('latN: ', latN, ', latS: ', latS, ', lngE: ', lngE, ', lngW: ', lngW);

	if( checkIfInside(latN, latS, lngE, lngW, v1) || 
		checkIfInside(latN, latS, lngE, lngW, v2) || 
		checkIfInside(latN, latS, lngE, lngW, v3) ||
		checkIfInside(latN, latS, lngE, lngW, v4)) {
		return true;
	} else {
		return false;
	}
}

exports.checkContiguity = function (bounds1, bounds2) {

	var bRes = checkContinuityInt(bounds1, bounds2);

    if(bRes){
    	return true;
    }

    // swap arguments
    return checkContinuityInt(bounds2, bounds1);

}





