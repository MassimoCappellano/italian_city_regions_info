'use strict';

const fc = require('./find_comune2');

// [{"k":"Samarate","v":"1472","pro":"PROV"},{"k":"Samassi","v":"7904","pro":"PROV"},{"k":"Samatzai","v":"7189","pro":"PROV"}]

/*
const P = fc.getComuneByCode(1472);

P.done(function(content) {
	console.log('FOUND CONTENT COMUNE: ', content);


}, function(error) {
   console.log('FOUND ERROR: ', error);
});

console.log('LOUNCHING SECOND TEST2');

const P2 = fc.getProvinciaInfoByCodComune(1472);

P2.then(function(content) {
	console.log('FOUND CONTENT COMUNE2: ', content);


}, function(error) {
   console.log('FOUND ERROR2: ', error);
});
*/

const PA = fc.findComuniPs('Sam');

PA.done(function(content) {
	console.log('FOUND COMUNI STARTS: ', content);


}, function(error) {
   console.log('FOUND ERROR2: ', error);
});
