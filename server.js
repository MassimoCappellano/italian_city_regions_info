'use strict';

const Hapi = require('hapi');

const HapiSwagger = require('hapi-swagger');

const Pack = require('./package');

const server = new Hapi.Server();

server.connection({ port: (process.env.PORT || 5000) });

const optionsGood = {
    ops: {
        interval: 10000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./logs/server.log']
        }]
    }
};


const optionsSwagger = {
	cors: true,
	produces: ['application/json'],
	consumes: ['application/json'],
	documentationPage: true,
    swaggerUI: false,
    info: {
            'title': 'Test API Documentation',
            'version': Pack.version,
        }
    };

server.register([
	require('inert'),
	require('vision'),
	{
		'register': require('good'),
		'options': optionsGood
	},
	{
        'register': HapiSwagger,
        'options': optionsSwagger
    }], (err) => {
		if(err) {
			throw err;
		}

	server.ext('onPreResponse', (request, reply) => {

	    if (request.response.isBoom) {
	        const err = request.response;
	        const errName = err.output.payload.error;
	        const statusCode = err.output.payload.statusCode;

	        return reply.view('error', {
	            statusCode: statusCode,
	            errName: errName
	        })
	        .code(statusCode);
	    }

	    reply.continue();
	});

	/*
	server.auth.strategy('jwt', 'jwt',
		    { key: server.settings.app.secretJWT,          // Never Share your secret key 
		      redirectTo: '/login',
		      validateFunc: validateJWT,            // validate function defined above 
		      verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm 
		    });
	*/
 
    // server.auth.default('jwt');

        server.views({
			engines: {
				hbs: require('handlebars')
			},
			relativeTo: __dirname,
			path: './views',
			layoutPath: './views/layout',
			helpersPath: './views/helpers',
			layout: true,
			isCached: false
		});

		server.route(require('./routes'));

		server.start((err) => {

		    if (err) {
		        throw err;
		    }
		    server.log('info', 'Server listening at CUSTOMER: ' + server.info.uri);
		});

});


