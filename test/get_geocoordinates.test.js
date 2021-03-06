'use strict';

const test = require('tape');

const getGeoCoordinates = require('../lib/geo/get_geocoordinates');


function xtest() {

}

/*

	[ { key: 'Abruzzo', value: { value: 13 } },
	  { key: 'Basilicata', value: { value: 17 } },
	  { key: 'Calabria', value: { value: 18 } },
	  { key: 'Campania', value: { value: 15 } },
	  { key: 'Emilia-Romagna', value: { value: 8 } },
	  { key: 'Friuli-Venezia Giulia', value: { value: 6 } },
	  { key: 'Lazio', value: { value: 12 } },
	  { key: 'Liguria', value: { value: 7 } },
	  { key: 'Lombardia', value: { value: 3 } },
	  { key: 'Marche', value: { value: 11 } },
	  { key: 'Molise', value: { value: 14 } },
	  { key: 'Piemonte', value: { value: 1 } },
	  { key: 'Puglia', value: { value: 16 } },
	  { key: 'Sardegna', value: { value: 20 } },
	  { key: 'Sicilia', value: { value: 19 } },
	  { key: 'Toscana', value: { value: 9 } },
	  { key: 'Trentino-Alto Adige/Südtirol', value: { value: 4 } },
	  { key: 'Umbria', value: { value: 10 } },
	  { key: 'Valle d\'Aosta/Vallée d\'Aoste', value: { value: 2 } },
	  { key: 'Veneto', value: { value: 5 } } ]

  */

test('get coordinate region', function(t) {

	getGeoCoordinates.getRegionCoordinates('Lombardia').done(
			function (result) {

				console.log( 'OK: >>: ', result);

			},
			function (error) {

				console.log(error);
			}
		);
	t.end();
});


test('get coordinate region NOT EXISTENT', function(t) {

	getGeoCoordinates.getRegionCoordinates('LombardiaAAAAAA').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});

test('get coordinate NOT region name', function(t) {

	getGeoCoordinates.getRegionCoordinates('Samarate').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});


test('get coordinate province name', function(t) {

	getGeoCoordinates.getProvinceCoordinates('VA').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});


test('get coordinate NOT province name', function(t) {

	getGeoCoordinates.getProvinceCoordinates('Samarate').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});

test('get coordinate municipality', function(t) {

	getGeoCoordinates.getMunicipalityCoordinates('Samarate', 'VA').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});

test('get coordinate municipality Varese', function(t) {

	getGeoCoordinates.getMunicipalityCoordinates('Varese', 'VA').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});


test('get coordinate region Sicilia', function(t) {

	getGeoCoordinates.getRegionCoordinates('Sicilia').done(
			function (result) {

				console.log( 'OK: >>: ', result);

			},
			function (error) {

				console.log(error);
			}
		);
	t.end();
});

test('get coordinate region Sardegna', function(t) {

	getGeoCoordinates.getRegionCoordinates('Sardegna').done(
			function (result) {

				console.log( 'OK: >>: ', result);

			},
			function (error) {

				console.log(error);
			}
		);
	t.end();
});

test('get coordinate municipality', function(t) {

	getGeoCoordinates.getMunicipalityCoordinates('Biassono', 'MB').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});

// Oggiona con Santo Stefano

test('get coordinate municipality Oggiona con Santo Stefano', function(t) {

	getGeoCoordinates.getMunicipalityCoordinates('Oggiona con Santo Stefano', 'VA').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	t.end();
});


/*
	++++ ERROR NOT MUNICIPALITY FOUND FOR 'Dello' IN PROVINCE BS'
	++++ ERROR NOT MUNICIPALITY FOUND FOR 'Borgo San Giovanni' IN PROVINCE LO'
	++++ ERROR NOT MUNICIPALITY FOUND FOR 'Tronzano Lago Maggiore' IN PROVINCE VA'
*/



/*
	++++ ERROR NOT MUNICIPALITY FOUND FOR 'Padova' IN PROVINCE PD'
	++++ ERROR NOT MUNICIPALITY FOUND FOR 'Venezia' IN PROVINCE VE'
	++++ ERROR NOT MUNICIPALITY FOUND FOR 'Rovigo' IN PROVINCE RO'

*/

test('get coordinate municipality Padova', function(t) {

	getGeoCoordinates.getMunicipalityCoordinates('Padova', 'PD').done(
			function (result) {

				console.log( '>>>>>>: ', result);

			},
			function (error) {

				console.log('IN ERROR', error);
			}
		);
	
	t.end();
});