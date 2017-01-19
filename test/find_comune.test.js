'use strict';

const fc = require('../lib/find_comune');

const test = require('tape');

function xtest(){}

// [{"k":"Samarate","v":"1472","pro":"PROV"},{"k":"Samassi","v":"7904","pro":"PROV"},{"k":"Samatzai","v":"7189","pro":"PROV"}]

test('Municipality that start with \'Sam\'', function(t) {
	
	const PA = fc.findComuni('Sam');

	var expectedResult = [ { name: 'Samarate',
						    code: 1472,
						    provincia_id: 12,
						    provincia_name: 'Varese',
						    provincia_code: 'VA',
						    regione_id: 3,
						    regione_name: 'Lombardia' },
						  { name: 'Samassi',
						    code: 7904,
						    provincia_id: 106,
						    provincia_name: 'Medio Campidano',
						    provincia_code: 'VS',
						    regione_id: 20,
						    regione_name: 'Sardegna' },
						  { name: 'Samatzai',
						    code: 7189,
						    provincia_id: 92,
						    provincia_name: 'Cagliari',
						    provincia_code: 'CA',
						    regione_id: 20,
						    regione_name: 'Sardegna' },
						  { name: 'Sambuca Pistoiese',
						    code: 4331,
						    provincia_id: 47,
						    provincia_name: 'Pistoia',
						    provincia_code: 'PT',
						    regione_id: 9,
						    regione_name: 'Toscana' },
						  { name: 'Sambuca di Sicilia',
						    code: 6903,
						    provincia_id: 84,
						    provincia_name: 'Agrigento',
						    provincia_code: 'AG',
						    regione_id: 19,
						    regione_name: 'Sicilia' },
						  { name: 'Sambuci',
						    code: 4854,
						    provincia_id: 58,
						    provincia_name: 'Roma',
						    provincia_code: 'RM',
						    regione_id: 12,
						    regione_name: 'Lazio' },
						  { name: 'Sambuco',
						    code: 693,
						    provincia_id: 4,
						    provincia_name: 'Cuneo',
						    provincia_code: 'CN',
						    regione_id: 1,
						    regione_name: 'Piemonte' },
						  { name: 'Sammichele di Bari',
						    code: 6039,
						    provincia_id: 72,
						    provincia_name: 'Bari',
						    provincia_code: 'BA',
						    regione_id: 16,
						    regione_name: 'Puglia' },
						  { name: 'Samo',
						    code: 6628,
						    provincia_id: 80,
						    provincia_name: 'Reggio di Calabria',
						    provincia_code: 'RC',
						    regione_id: 18,
						    regione_name: 'Calabria' },
						  { name: 'Samolaco',
						    code: 1706,
						    provincia_id: 14,
						    provincia_name: 'Sondrio',
						    provincia_code: 'SO',
						    regione_id: 3,
						    regione_name: 'Lombardia' },
						  { name: 'Samone',
						    code: 2949,
						    provincia_id: 22,
						    provincia_name: 'Trento',
						    provincia_code: 'TN',
						    regione_id: 4,
						    regione_name: 'Trentino-Alto Adige/Südtirol' },
						  { name: 'Sampeyre',
						    code: 694,
						    provincia_id: 4,
						    provincia_name: 'Cuneo',
						    provincia_code: 'CN',
						    regione_id: 1,
						    regione_name: 'Piemonte' },
						  { name: 'Samugheo',
						    code: 7381,
						    provincia_id: 95,
						    provincia_name: 'Oristano',
						    provincia_code: 'OR',
						    regione_id: 20,
						    regione_name: 'Sardegna' } ];
    
	PA.done(function(content) {
		console.log('FOUND COMUNI STARTS: ', content);
	}, function(error) {
   		console.log('FOUND ERROR2: ', error);
	});

	t.end();
});


xtest('Municipality that start with \'Sam\' only name and code', function(t) {
	const PA = fc.findComuni('Sam');
	
	/*
		{ name: 'Samugheo',
	    code: '7381',
	    provincia_id: 95,
	    provincia_name: 'Oristano',
	    provincia_code: 'OR',
	    regione_id: 20,
	    regione_name: 'Sardegna' }
	*/

	PA.done(function(content) {

		let mContent = content.map((item) => {
			let obj = {};
			obj.n = item.name;
			obj.c = item.code;
			obj.pc = item.provincia_code;

			return obj;
		});

		console.log(mContent);

	}, function(error) {
   		console.log('FOUND ERROR2: ', error);
	});

	t.end();
});

test('Find by code municipality', function(t) {
	const PA = fc.getComuneByCode(1472);

	var expectedReturn = { 	
		name: 'Samarate',
  		codice_istat: 12118,
  		codice_catastale: 'H736',
  		is_capoluogo: false,
  		provincia_id: 12,
  		altitudine: 221,
  		superficie: 16.01,
  		popolazione: 16168
	};

    PA.done(function(content) {

		console.log(content);

	}, function(error) {
   		console.log('FOUND ERROR2: ', error);
	});

	t.end();
});


test('Find by code getComuneInfoByCodComune', function(t) {
	const PA = fc.getComuneInfoByCodComune(1472);

	var resultExpected = { name: 'Samarate',
  	  code: 1472,
      provincia_id: 12,
      provincia_name: 'Varese',
      provincia_code: 'VA',
      regione_id: 3,
  	  regione_name: 'Lombardia' };

    PA.done(function(content) {

		console.log(content);

	}, function(error) {
   		console.log('FOUND ERROR2: ', error);
	});

	t.end();
});



