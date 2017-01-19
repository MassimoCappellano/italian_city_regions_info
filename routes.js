'use strict';

const Joi = require('joi');

const Assets = require('./handlers/assets');

const fc = require('./lib/find_comune');

const responseModelListMunicipies = Joi.array().items(Joi.object({
    n: Joi.string().required().description('name of city'),
    c: Joi.number().integer().required().description('pk for search city info'),
    pc: Joi.string().required().description('code province')
})).label('Result infos list cities');

/*
	"geometry": {
		    "bounds": {
		      "northeast": {
		        "lat": 45.6430867,
		        "lng": 8.8042525
		      },
		      "southwest": {
		        "lat": 45.6027756,
		        "lng": 8.7624716
		      }
		    },
		    "location": {
		      "lat": 45.6260364,
		      "lng": 8.7870324
		    },
		    "location_type": "APPROXIMATE",
		    "viewport": {
		      "northeast": {
		        "lat": 45.6430867,
		        "lng": 8.8042525
		      },
		      "southwest": {
		        "lat": 45.6027756,
		        "lng": 8.7624716
		      }
		    }
  }


*/

const pointModel = Joi.object({

	lat: Joi.number().required().description('latitudo'),
	lng: Joi.number().required().description('longitudo')

});

const areaModel = Joi.object({

		northeast: pointModel.required().label('NE point'),
		southwest: pointModel.required().label('SW point')

	});

const geometryModel = Joi.object({

	bounds: areaModel.required().label('Bounds area'),
	
	location: pointModel.required().label('Location point'),
	
	location_type: Joi.string().required(),
	
	viewport: areaModel.required().label('View area')
});


/*
	"name": "Samarate",
  "codice_istat": 12118,
  "codice_catastale": "H736",
  "is_capoluogo": false,
  "provincia_id": 12,
  "altitudine": 221,
  "superficie": 16.01,
  "popolazione": 16168,
  "place_id": "ChIJkVjwFxOKhkcRbfhmH_LQCJw",
  "geometry":

*/

const responseModelMunicipality = Joi.object({

    name: Joi.string().required().description('name of city'),
    codice_istat: Joi.number().integer().required().description('ISTAT code'),
    codice_catastale: Joi.string().required().description('codice catastale'),
    is_capoluogo: Joi.boolean().required().description('if mastercity'),
    provincia_id: Joi.number().integer().required().description('pk of province'),

    altitudine: Joi.number().integer().required().allow(null).description('meters of altitudine'),
    superficie: Joi.number().required().allow(null).description('Area kmq'),
    popolazione: Joi.number().integer().required().allow(null).description('number of citizen'),

    place_id: Joi.string().optional().description('ID in GMAP'),
    geometry: geometryModel.optional().label('Geometry city area')

}).label('Result City info');


/*
  "name": "Varese",
  "code": "VA",
  "regione_id": 3,
  "place_id": "ChIJvUYMaLZ_hkcRIH5mLgJ4BgM",
  "geometry": 
*/

const responseModelProvince = Joi.object({

	name: Joi.string().required().description('name of province'),
	code: Joi.string().length(2).required().description('code of province - 2 chars'),
	regione_id: Joi.number().integer().required().description('pk of region'),

	place_id: Joi.string().optional().description('ID in GMAP'),
    geometry: geometryModel.optional().label('Geometry province area')

}).label('Result Province info');


/*
	"name": "Lombardia",
  "place_id": "ChIJf4M-GsNEgUcR1JMVKCIm8qY",
  "geometry":
*/

const responseModelRegion = Joi.object({

	name: Joi.string().required().description('name of region'),

	place_id: Joi.string().optional().description('ID in GMAP'),
    geometry: geometryModel.optional().label('Geometry region area')

}).label('Result Region info');;

module.exports = [{
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply.view('homePage');
	}
}, {
	method: 'GET',
	path: '/query_examples',
	handler: function (request, reply) {
		reply.view('query_examples');
	}

}, {
	method: 'GET',
	path: '/comuni',
	handler: function (request, reply) {
			let query = '';

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

		},
	config: {
		cors: true,
		tags: ['api'],
		description: 'Get list of all municipies',
        notes: 'Returns list of all municipies',
        response: {schema: responseModelListMunicipies}
        }	
}, {
	method: 'GET',
	path: '/comuni/{name}',
	handler: function (request, reply) {
			let query = request.params.name;

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

		},
	config: {
		cors: true,
		tags: ['api'],
		description: 'Get list of all municipies that start with {name}',
        notes: 'Returns list of all municipies that start with {name}',
        response: { schema: responseModelListMunicipies }, 
        validate: {
			params: {
				name: Joi.string()
			}
		}
	}	
}, {
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
	},
	config: {
		cors: true,
		tags: ['api'],
		description: 'Get municipality info by {idMunicipality}',
        notes: 'Returns lmunicipality info by {idMunicipality}',
		response: { schema: responseModelMunicipality }, 
		validate: {
			params: {
				idMunicipality: Joi.number().integer().min(1)
			}
		}
	}
},
{	
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
	},
	config: {
		cors: true,
		tags: ['api'],
		description: 'Get province info by {idProvince}',
        notes: 'Returns province info by {idProvince}',
        response: { schema: responseModelProvince }, 
		validate: {
			params: {
				idProvince: Joi.number().integer().min(1)
			}
		}
	}
},
{
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
	},
	config: {
		cors: true,
		tags: ['api'],
		description: 'Get region info by {idRegion}',
        notes: 'Returns region info by {idRegion}',
        response: { schema: responseModelRegion }, 
		validate: {
			params: {
				idRegion: Joi.number().integer().min(1)
			}
		}
	}
},
{
	method: 'GET',
	path: '/{params*}',
	config: { auth: false },
	handler: Assets.servePublicDirectory
}];
