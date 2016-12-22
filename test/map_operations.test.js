'use strict';

const mo = require('../map_operations');

const test = require('tape');

// for disable tests
function xtest(){

}

test('find elenco regioni', function(t) {
	mo.getElencoRegioni().done(
			function (results) {
				console.log(results);
			},
			function (error) {
				console.log(error);
			}
		);

	t.end();
});

test('find elenco province \'Lombardia\' code: 3', function(t) {
	mo.getProvinceByCodeRegione(3).done(
		function (results) {
				console.log(results);
			},
		function (error) {
				console.log(error);
			}
		);

	t.end();
});


test('find elenco province by invalid code regione: 5555', function(t) {
	mo.getProvinceByCodeRegione(5555).done(
		function (results) {
				console.log(results);
			},
		function (error) {
				console.log(error);
			}
		);
	
	t.end();
});


test('find elenco comuni by code provincia: 12, Varese', function(t) {
	mo.getComuniByCodeProvincia(12).done(
		function (results) {
				console.log(results);
			},
		function (error) {
				console.log(error);
			}
		);
	
	t.end();
});



