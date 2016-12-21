'use strict';



function checkIfInside(latN, latS, lngE, lngW, point){

		if( (point.lat <= latN && point.lat >= latS) && (point.lng <= lngE && point.lng >= lngW))
			return true;

		return false;
}

function checkContinuityInt(bounds1, bounds2) {
	 // NW
	const v1 = { lat: bounds2.northeast.lat, lng: bounds2.southwest.lng };
	// NE
	const v2 = { lat: bounds2.northeast.lat, lng: bounds2.northeast.lng };
	// SW
	const v3 = { lat: bounds2.southwest.lat, lng: bounds2.southwest.lng };
	// SE
	const v4 = { lat: bounds2.southwest.lat, lng: bounds2.northeast.lng };

	//
	const latN = bounds1.northeast.lat;
	const latS = bounds1.southwest.lat;

	const lngE = bounds1.northeast.lng;
	const lngW = bounds1.southwest.lng;

	console.log('latN: ', latN, ', latS: ', latS, ', lngE: ', lngE, ', lngW: ', lngW);

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





