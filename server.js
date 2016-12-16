'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({ port: 4000 });

/*

server.bind({
	SessionManager: SessionManager
});

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
*/

server.register([
	require('inert'),
	require('vision')	
	], (err) => {
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
		    console.log('Server listening at CUSTOMER:', server.info.uri);
		});

});


