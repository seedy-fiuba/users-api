exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 404,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 401,
		message: msg,
	};
	return res.status(401).json(data);
};

exports.unexpectedError = function (res, msg) {
	var data = {
		status: 500,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.createdOk = function (res, data) {
	return res.status(201).json(data);
};