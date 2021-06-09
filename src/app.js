'use strict';

require('dd-trace').init({
	logger: {
		error: err => console.error(err),
		warn: message => console.warn(message),
		info: message => console.info(message),
		debug: message => console.trace(message),
	},
	debug: true
});
const server = require('./server');

// Constants
const PORT = process.env.PORT || 8080;

// ToDo encapsular con try catch
server.connectDB();

server.app.listen(PORT, () =>
	console.log('server is up')
);