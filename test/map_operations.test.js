'use strict';

const mo = require('../lib/map_operations');

const test = require('tape');

// for disable tests
function xtest(){

}

xtest('find elenco regioni', function(t) {

	var expectdReturn = [ { key: 'Abruzzo', value: { value: 13 } },
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
			  { key: 'Veneto', value: { value: 5 } } ];

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

xtest('find elenco province \'Lombardia\' code: 3', function(t) {

	var expectedResult = [ { name: 'Monza e della Brianza',
			    code: 'MB',
			    regione_id: 3,
			    provincia_id: '108' },
			  { name: 'Varese',
			    code: 'VA',
			    regione_id: 3,
			    provincia_id: '12' },
			  { name: 'Como',
			    code: 'CO',
			    regione_id: 3,
			    provincia_id: '13' },
			  { name: 'Sondrio',
			    code: 'SO',
			    regione_id: 3,
			    provincia_id: '14' },
			  { name: 'Milano',
			    code: 'MI',
			    regione_id: 3,
			    provincia_id: '15' },
			  { name: 'Bergamo',
			    code: 'BG',
			    regione_id: 3,
			    provincia_id: '16' },
			  { name: 'Brescia',
			    code: 'BS',
			    regione_id: 3,
			    provincia_id: '17' },
			  { name: 'Pavia',
			    code: 'PV',
			    regione_id: 3,
			    provincia_id: '18' },
			  { name: 'Cremona',
			    code: 'CR',
			    regione_id: 3,
			    provincia_id: '19' },
			  { name: 'Mantova',
			    code: 'MN',
			    regione_id: 3,
			    provincia_id: '20' },
			  { name: 'Lecco',
			    code: 'LC',
			    regione_id: 3,
			    provincia_id: '97' },
			  { name: 'Lodi',
			    code: 'LO',
			    regione_id: 3,
			    provincia_id: '98' } ];

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


xtest('find elenco province by invalid code regione: 5555', function(t) {
	
	var expectedResult = [];

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



