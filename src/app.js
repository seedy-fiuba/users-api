'use strict';

const server = require('./server');

// Constants
const PORT = process.env.PORT || 8080;

// ToDo encapsular con try catch
server.connectDB();

server.app.listen(PORT, () =>
	console.log('server is up')
);