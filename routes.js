'use strict';

const Assets = require('./handlers/assets');

const fc = require('./find_comune');

module.exports = [{
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply.view('homePage');
	}
}, {
	config: {
		cors: true
	},
	method: 'GET',
	path: '/comuni',
	handler: function (request, reply) {
		let query = '';

		if(request.query.q)
			query = request.query.q;

		const P = fc.findComuni(query);

		P.done(function(content) {
			return reply(content.map((item) => {
					let obj = {};
					obj.n = item.name;
					obj.c = item.code;
					obj.pc = item.provincia_code;

					return obj;
					}));
		}, function(error) {
   			return reply(error);
		});

	}
}, {
	config: {
		cors: true
	},
	method: 'GET',
	path: '/getMunicipalityInfo/{idMunicipality}',
	handler: function (request, reply) {
		
		const idMunicipality = request.params.idMunicipality;

		console.log('idMunicipality:', idMunicipality);

		const P = fc.getComuneByCode(idMunicipality);

		P.done( function (municipality) {

			return reply(municipality);
		}, function (error) {
			
			return reply(error);
		});
	}
},
{	
	config: {
		cors: true
	},
	method: 'GET',
	path: '/getProvinceInfo/{idProvince}',
	handler: function (request, reply) {
		
		const idProvince = request.params.idProvince;

		console.log('idProvince:', idProvince);

		const P = fc.getProvinciaByCode(idProvince);

		P.done( function (province) {

			return reply(province);
		}, function (error) {
			
			return reply(error);
		});
	}
},
{
	config: {
		cors: true
	},
	method: 'GET',
	path: '/getRegionInfo/{idRegion}',
	handler: function (request, reply) {
		
		const idRegion = request.params.idRegion;

		console.log('idRegion:', idRegion);

		const P = fc.getRegioneByCode(idRegion);

		P.done( function (region) {

			return reply(region);
		}, function (error) {
			
			return reply(error);
		});
	}
},
{
	method: 'GET',
	path: '/{params*}',
	config: { auth: false },
	handler: Assets.servePublicDirectory
}];
